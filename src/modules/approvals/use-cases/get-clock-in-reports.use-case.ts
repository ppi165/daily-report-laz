import { approvalRepository } from '../repositories/approval.repository';

export class GetClockInReportsUseCase {
  async execute(userId?: string, role?: string) {
    try {
      if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPERVISOR') {
        return await approvalRepository.findAllClockInReports();
      }

      if (userId) {
        return await approvalRepository.findClockInReportsForUser(userId);
      }

      return await approvalRepository.findAllClockInReports();
    } catch (error) {
      console.error('Gagal memuat laporan clock-in dari database:', error);
      return [];
    }
  }
}

export const getClockInReportsUseCase = new GetClockInReportsUseCase();
