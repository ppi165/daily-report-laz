import { approvalRepository } from '../repositories/approval.repository';
import { RespondApprovalInput, RespondApprovalSchema } from '../schemas/respond-approval.schema';
import { notificationRepository } from '@/src/modules/notifications/repositories/notification.repository';
import { createPeerReportNotificationUseCase } from '@/src/modules/notifications/use-cases/create-peer-report-notification.use-case';

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

      // Notifikasi ke pembuat laporan bahwa pengajuan Clock-in ditolak
      if (existing.report?.authorId) {
        await notificationRepository.create({
          userId: existing.report.authorId,
          type: 'APPROVAL_RESULT',
          title: 'Pengajuan Clock-in Ditolak',
          message: `${existing.approverName || 'Saksi verifikator'} menolak pengajuan Clock-in Anda. Catatan: ${validated.note || 'Pengajuan ditolak.'}`,
          link: '/verifikasi',
          reportId: existing.reportId,
          actorId: userId,
        });
      }

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

      // 1. Notifikasi ke pembuat laporan bahwa seluruh saksi telah menyetujui
      if (existing.report?.authorId) {
        await notificationRepository.create({
          userId: existing.report.authorId,
          type: 'APPROVAL_RESULT',
          title: 'Pengajuan Clock-in Disetujui',
          message: 'Pengajuan Clock-in Anda telah disetujui lengkap oleh para saksi dan dipublikasikan.',
          link: `/feed#report-${existing.reportId}`,
          reportId: existing.reportId,
          actorId: userId,
        });

        // 2. Notifikasi ke rekan sedivisi bahwa laporan baru sudah dipublikasikan
        await createPeerReportNotificationUseCase.execute({
          reportId: existing.reportId,
          authorId: existing.report.authorId,
          authorName: existing.report.author?.name || 'Rekan',
          division: existing.report.division,
        });
      }

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
