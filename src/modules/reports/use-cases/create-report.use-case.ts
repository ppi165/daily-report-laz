import { reportRepository } from '../repositories/report.repository';
import { CreateReportInput, CreateReportSchema } from '../schemas/create-report.schema';
import { approvalRepository } from '@/src/modules/approvals';
import { userRepository } from '@/src/modules/users';
import { settingRepository } from '@/src/modules/settings';

export class CreateReportUseCase {
  async execute(input: CreateReportInput, authorId: string) {
    const validated = CreateReportSchema.parse(input);

    if (!authorId) {
      throw new Error('Unauthorized: Author ID wajib ada');
    }

    const settings = await settingRepository.findDefault();

    if (!validated.attachments || validated.attachments.length === 0) {
      throw new Error('Dokumentasi foto pekerjaan wajib dilampirkan minimal 1 foto.');
    }

    const reportDate = validated.reportDate
      ? new Date(`${validated.reportDate}T12:00:00.000Z`)
      : undefined;

    const isClockIn = Boolean(validated.isClockIn);

    if (isClockIn) {
      if (reportDate) {
        const now = new Date();
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

      return report;
    }

    return reportRepository.create({
      title: validated.title || 'Daily Report',
      content: validated.content,
      division: validated.division,
      attachments: validated.attachments || [],
      authorId,
      status: 'PUBLISHED',
      appreciations: 0,
      isClockIn: false,
      ...(reportDate ? { createdAt: reportDate } : {}),
    });
  }
}

export const createReportUseCase = new CreateReportUseCase();
