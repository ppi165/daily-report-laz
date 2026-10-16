import { approvalRepository } from '../repositories/approval.repository';

export class GetClockInReportsUseCase {
  async execute() {
    try {
      const reports = await approvalRepository.findAllClockInReports();
      return reports || [];
    } catch (error) {
      console.error('Gagal memuat laporan clock-in dari database:', error);
      return [];
    }
  }
}

export const getClockInReportsUseCase = new GetClockInReportsUseCase();
