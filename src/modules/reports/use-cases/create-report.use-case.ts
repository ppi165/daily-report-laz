import { reportRepository } from '../repositories/report.repository';
import { CreateReportInput, CreateReportSchema } from '../schemas/create-report.schema';
import { approvalRepository, MOCK_APPROVERS } from '@/src/modules/approvals';

export class CreateReportUseCase {
  async execute(input: CreateReportInput, authorId: string) {
    const validated = CreateReportSchema.parse(input);

    if (!authorId) {
      throw new Error('Unauthorized: Author ID wajib ada');
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

        if (diffDays > 3) {
          throw new Error('Laporan susulan (Clock-in) hanya diizinkan maksimal hingga 3 hari ke belakang (H-3).');
        }
      }

      const approverIds = validated.approverMockIds || [];
      if (approverIds.length !== 2) {
        throw new Error('Clock-in daily report wajib memilih tepat 2 verifikator.');
      }
      if (approverIds[0] === approverIds[1]) {
        throw new Error('Verifikator 1 dan Verifikator 2 tidak boleh orang yang sama.');
      }

      const approver1 = MOCK_APPROVERS.find((a) => a.id === approverIds[0]);
      const approver2 = MOCK_APPROVERS.find((a) => a.id === approverIds[1]);

      if (!approver1 || !approver2) {
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

      await approvalRepository.createManyForReport(report.id, [
        {
          approverMockId: approver1.id,
          approverName: approver1.name,
          approverDivision: approver1.division,
        },
        {
          approverMockId: approver2.id,
          approverName: approver2.name,
          approverDivision: approver2.division,
        },
      ]);

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
