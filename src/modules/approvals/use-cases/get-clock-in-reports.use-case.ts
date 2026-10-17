import { approvalRepository } from '../repositories/approval.repository';

export class GetClockInReportsUseCase {
  async execute(userId?: string, role?: string) {
    try {
      if (!userId) {
        return [];
      }

      // Admin, Superadmin, dan Supervisor dapat memantau seluruh pengajuan (monitoring / read-only)
      if (
        role === 'ADMIN' ||
        role === 'SUPERADMIN' ||
        role === 'SUPER_ADMIN' ||
        role === 'SUPERVISOR'
      ) {
        return await approvalRepository.findAllClockInReports();
      }

      // Staf biasa hanya bisa melihat pengajuan miliknya atau jika ia ditunjuk sebagai verifikator
      return await approvalRepository.findClockInReportsForUser(userId);
    } catch (error) {
      console.error('Gagal memuat laporan clock-in dari database:', error);
      return [];
    }
  }
}

export const getClockInReportsUseCase = new GetClockInReportsUseCase();
