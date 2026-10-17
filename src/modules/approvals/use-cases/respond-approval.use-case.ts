import { approvalRepository } from '../repositories/approval.repository';
import { RespondApprovalInput, RespondApprovalSchema } from '../schemas/respond-approval.schema';

export class RespondApprovalUseCase {
  async execute(input: RespondApprovalInput, userId?: string, userRole?: string, userName?: string) {
    const validated = RespondApprovalSchema.parse(input);

    const existing = await approvalRepository.findById(validated.approvalId);
    if (!existing) {
      throw new Error('Data pengajuan verifikasi tidak ditemukan.');
    }

    // Keamanan hak akses: hanya verifikator yang ditunjuk atau Admin/Supervisor yang berhak merespon
    const isDesignatedApprover = existing.approverId === userId || existing.approverMockId === userId;
    const isPrivileged = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'SUPERVISOR';

    if (userId && !isDesignatedApprover && !isPrivileged) {
      throw new Error(
        'Anda tidak memiliki hak akses untuk merespon verifikasi ini. Hanya verifikator yang ditunjuk atau Supervisor yang diizinkan.'
      );
    }

    // Deteksi jika persetujuan ini dilakukan oleh Admin/Supervisor sebagai delegasi / override
    const isOverride = Boolean(isPrivileged && !isDesignatedApprover);
    const overrideData = isOverride
      ? {
          isOverridden: true,
          respondedByName:
            userName || (userRole === 'SUPER_ADMIN' ? 'Superadmin' : 'Administrator'),
        }
      : undefined;

    if (validated.action === 'REJECT') {
      await approvalRepository.updateApproval(
        validated.approvalId,
        'REJECTED',
        validated.note ||
          (isOverride
            ? `Ditolak oleh Administrator (${overrideData?.respondedByName})`
            : 'Pengajuan ditolak oleh verifikator'),
        overrideData
      );
      await approvalRepository.updateReportStatus(existing.reportId, 'REJECTED');

      return {
        success: true,
        message: isOverride
          ? `Pengajuan Clock-in ditolak oleh Administrator (${overrideData?.respondedByName}).`
          : 'Pengajuan Clock-in berhasil ditolak.',
        reportStatus: 'REJECTED',
      };
    }

    // Aksi APPROVE
    await approvalRepository.updateApproval(
      validated.approvalId,
      'APPROVED',
      validated.note,
      overrideData
    );

    const allApprovals = await approvalRepository.findByReportId(existing.reportId);
    const allApproved =
      allApprovals.length > 0 &&
      allApprovals.every((app) => app.status === 'APPROVED');

    if (allApproved) {
      await approvalRepository.updateReportStatus(existing.reportId, 'PUBLISHED');
      return {
        success: true,
        message: isOverride
          ? `Disetujui oleh Administrator (${overrideData?.respondedByName}). Seluruh verifikator terpenuhi, laporan resmi PUBLISHED!`
          : 'Seluruh verifikator telah menyetujui. Laporan Clock-in resmi PUBLISHED!',
        reportStatus: 'PUBLISHED',
      };
    }

    return {
      success: true,
      message: isOverride
        ? `Disetujui oleh Administrator (${overrideData?.respondedByName}). Menunggu verifikator lainnya.`
        : 'Persetujuan Anda telah dicatat. Masih menunggu respon verifikator lainnya.',
      reportStatus: 'PENDING_APPROVAL',
    };
  }
}

export const respondApprovalUseCase = new RespondApprovalUseCase();
