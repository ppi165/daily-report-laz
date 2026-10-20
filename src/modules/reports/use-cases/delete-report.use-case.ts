import { reportRepository } from '../repositories/report.repository';
import { userRepository } from '@/src/modules/users/repositories/user.repository';

export class DeleteReportUseCase {
  async execute(reportId: string, actorId: string) {
    if (!reportId) {
      throw new Error('ID laporan wajib diisi.');
    }

    if (!actorId) {
      throw new Error('Unauthorized: Sesi tidak ditemukan.');
    }

    const actor = await userRepository.findById(actorId);
    if (!actor) {
      throw new Error('Akun pemohon tidak ditemukan.');
    }

    // Hanya Superadmin yang berwenang menghapus laporan
    if (actor.role !== 'SUPERADMIN' && actor.role !== 'SUPER_ADMIN') {
      throw new Error('Pelanggaran hak akses: Fitur hapus laporan hanya dapat dilakukan oleh akun Superadmin.');
    }

    const report = await reportRepository.findById(reportId);
    if (!report) {
      throw new Error('Laporan tidak ditemukan atau sudah dihapus.');
    }

    await reportRepository.delete(reportId);

    return {
      success: true,
      message: `Laporan amil "${report.author?.name || 'Amil'}" berhasil dihapus secara permanen.`,
      data: {
        deletedReportId: reportId,
      },
    };
  }
}

export const deleteReportUseCase = new DeleteReportUseCase();
