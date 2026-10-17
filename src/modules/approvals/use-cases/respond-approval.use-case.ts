import { approvalRepository } from '../repositories/approval.repository';
import { RespondApprovalInput, RespondApprovalSchema } from '../schemas/respond-approval.schema';

export class RespondApprovalUseCase {
  async execute(input: RespondApprovalInput, userId?: string) {
    const validated = RespondApprovalSchema.parse(input);

    const existing = await approvalRepository.findById(validated.approvalId);
    if (!existing) {
      throw new Error('Data pengajuan verifikasi tidak ditemukan.');
    }

    // Keamanan hak akses: hanya verifikator yang ditunjuk yang berhak merespon
    const isDesignatedApprover = existing.approverId === userId || existing.approverMockId === userId;

    if (!isDesignatedApprover) {
      throw new Error(
        'Anda tidak memiliki hak akses untuk merespon verifikasi ini. Hanya saksi verifikator yang ditunjuk yang diizinkan.'
      );
    }

    if (validated.action === 'REJECT') {
      await approvalRepository.updateApproval(
        validated.approvalId,
        'REJECTED',
        validated.note || 'Pengajuan ditolak oleh verifikator'
      );
      await approvalRepository.updateReportStatus(existing.reportId, 'REJECTED');

      return {
        success: true,
        message: 'Pengajuan Clock-in berhasil ditolak.',
        reportStatus: 'REJECTED',
      };
    }

    // Aksi APPROVE
    await approvalRepository.updateApproval(
      validated.approvalId,
      'APPROVED',
      validated.note
    );

    const allApprovals = await approvalRepository.findByReportId(existing.reportId);
    const allApproved =
      allApprovals.length > 0 &&
      allApprovals.every((app) => app.status === 'APPROVED');

    if (allApproved) {
      await approvalRepository.updateReportStatus(existing.reportId, 'PUBLISHED');
      return {
        success: true,
        message: 'Pengajuan Clock-in telah disetujui lengkap oleh semua saksi dan status laporan kini PUBLISHED.',
        reportStatus: 'PUBLISHED',
      };
    }

    return {
      success: true,
      message: 'Persetujuan verifikator telah dicatat. Menunggu verifikator lainnya.',
      reportStatus: 'PENDING_APPROVAL',
    };
  }
}

export const respondApprovalUseCase = new RespondApprovalUseCase();
