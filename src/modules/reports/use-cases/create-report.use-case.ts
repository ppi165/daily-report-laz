import { reportRepository } from '../repositories/report.repository';
import { CreateReportInput, CreateReportSchema } from '../schemas/create-report.schema';
import { approvalRepository } from '@/src/modules/approvals';
import { userRepository } from '@/src/modules/users';
import { settingRepository } from '@/src/modules/settings';
import { scheduleRepository } from '@/src/modules/schedules';
import { createApprovalRequestNotificationUseCase } from '@/src/modules/notifications/use-cases/create-approval-request-notification.use-case';
import { createPeerReportNotificationUseCase } from '@/src/modules/notifications/use-cases/create-peer-report-notification.use-case';
import { notificationRepository } from '@/src/modules/notifications/repositories/notification.repository';

export class CreateReportUseCase {
  async execute(input: CreateReportInput, authorId: string) {
    const validated = CreateReportSchema.parse(input);

    if (!authorId) {
      throw new Error('Unauthorized: Author ID wajib ada');
    }

    const author = await userRepository.findById(authorId);
    const settings = await settingRepository.findDefault();

    if (!validated.attachments || validated.attachments.length === 0) {
      throw new Error('Dokumentasi foto pekerjaan wajib dilampirkan minimal 1 foto.');
    }

    const reportDate = validated.reportDate
      ? new Date(`${validated.reportDate}T12:00:00.000Z`)
      : undefined;

    const isClockIn = Boolean(validated.isClockIn);
    const now = new Date();

    // Tentukan batas waktu (deadline) hari ini berdasarkan jadwal khusus atau pengaturan reguler
    const activeSchedule = await scheduleRepository.findActiveForDate(now);
    let deadlineTime = settings.dailyDeadlineTime || '17:00';
    if (activeSchedule) {
      deadlineTime = activeSchedule.deadlineTime;
    } else if (settings.isRamadhanMode && settings.ramadhanDeadlineTime) {
      deadlineTime = settings.ramadhanDeadlineTime;
    }

    // Evaluasi apakah pengiriman melewati batas waktu hari ini (WIB)
    let isLate = false;
    if (isClockIn) {
      isLate = true;
    } else {
      const [deadlineH, deadlineM] = deadlineTime.split(':').map(Number);
      const wibTimeParts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(now);

      const currentH = Number(wibTimeParts.find((p) => p.type === 'hour')?.value ?? now.getHours());
      const currentM = Number(wibTimeParts.find((p) => p.type === 'minute')?.value ?? now.getMinutes());

      const currentMinutes = currentH * 60 + currentM;
      const deadlineMinutes = deadlineH * 60 + deadlineM;

      if (currentMinutes > deadlineMinutes) {
        isLate = true;
      }
    }

    if (isClockIn) {
      if (reportDate) {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const repDay = new Date(reportDate.getFullYear(), reportDate.getMonth(), reportDate.getDate());

        const diffTime = today.getTime() - repDay.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) {
          throw new Error('Tanggal laporan susulan harus merupakan tanggal lampau sebelum hari ini.');
        }

        if (diffDays > settings.clockInMaxDays) {
          throw new Error(
            `Laporan susulan (Clock-in) hanya diizinkan maksimal hingga ${settings.clockInMaxDays} hari ke belakang (H-${settings.clockInMaxDays}).`
          );
        }
      }

      const approverIds = (validated.approverMockIds || []).filter((id) => Boolean(id && id.trim()));
      const requiredWitness = settings.clockInRequiredWitness;

      if (approverIds.length < requiredWitness) {
        throw new Error(
          requiredWitness === 1
            ? 'Verifikator saksi wajib dipilih.'
            : 'Verifikator tidak boleh kosong salah satu atau keduanya.'
        );
      }

      if (approverIds.length !== requiredWitness) {
        throw new Error(`Clock-in daily report wajib memilih tepat ${requiredWitness} verifikator.`);
      }

      if (new Set(approverIds).size !== approverIds.length) {
        throw new Error('Verifikator 1 dan Verifikator 2 tidak boleh orang yang sama.');
      }

      if (approverIds.includes(authorId)) {
        throw new Error('Anda tidak dapat memilih diri Anda sendiri sebagai saksi verifikator.');
      }

      const selectedApprovers = await userRepository.findByIds(approverIds);
      if (selectedApprovers.length !== approverIds.length) {
        throw new Error('Data verifikator yang dipilih tidak valid.');
      }

      const report = await reportRepository.create({
        title: validated.title || 'Clock-in Daily Report',
        content: validated.content,
        division: validated.division,
        attachments: validated.attachments || [],
        authorId,
        status: 'PENDING_APPROVAL',
        appreciations: 0,
        isClockIn: true,
        isLate: true,
        ...(reportDate ? { createdAt: reportDate } : {}),
      });

      await approvalRepository.createManyForReport(
        report.id,
        selectedApprovers.map((a) => ({
          approverId: a.id,
          approverMockId: a.id,
          approverName: a.name,
          approverDivision: a.division,
        }))
      );

      createApprovalRequestNotificationUseCase
        .execute({
          reportId: report.id,
          authorId,
          authorName: author?.name || 'Rekan Kerja',
          approverUserIds: selectedApprovers.map((a) => a.id),
        })
        .catch(() => {});

      return report;
    }

    const wibFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayWibStr = wibFormatter.format(now);
    const startOfTodayWib = new Date(`${todayWibStr}T00:00:00.000+07:00`);
    const endOfTodayWib = new Date(`${todayWibStr}T23:59:59.999+07:00`);

    // Validasi pencegahan duplikasi: 1 hari hanya boleh 1 daily report reguler
    const existingReportToday = await reportRepository.findTodayRegularReportByAuthor(
      authorId,
      startOfTodayWib,
      endOfTodayWib
    );

    if (existingReportToday) {
      throw new Error('Anda sudah membuat daily report hari ini.');
    }

    const createdReport = await reportRepository.create({
      title: validated.title || 'Daily Report',
      content: validated.content,
      division: validated.division,
      attachments: validated.attachments || [],
      authorId,
      status: 'PUBLISHED',
      appreciations: 0,
      isClockIn: false,
      isLate,
      ...(reportDate ? { createdAt: reportDate } : {}),
    });

    createPeerReportNotificationUseCase
      .execute({
        reportId: createdReport.id,
        authorId,
        authorName: author?.name || 'Rekan Kerja',
        division: validated.division,
      })
      .catch(() => {});

    // Bersihkan notifikasi pengingat harian (REMINDER) jika sebelumnya sudah dibuat hari ini
    try {
      const wibFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const todayWibStr = wibFormatter.format(now);
      const startOfTodayWib = new Date(`${todayWibStr}T00:00:00.000+07:00`);
      notificationRepository
        .deleteReminderForReportSubmitted(authorId, startOfTodayWib)
        .catch(() => {});
    } catch {
      // ignore
    }

    return createdReport;
  }
}

export const createReportUseCase = new CreateReportUseCase();
