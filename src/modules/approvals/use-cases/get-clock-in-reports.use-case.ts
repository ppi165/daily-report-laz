import { approvalRepository } from '../repositories/approval.repository';
import { MOCK_CLOCK_IN_REPORTS } from '../constants/mock-clock-in-reports';

export class GetClockInReportsUseCase {
  async execute() {
    try {
      const reports = await approvalRepository.findAllClockInReports();
      if (reports && reports.length > 0) {
        return reports;
      }
      return MOCK_CLOCK_IN_REPORTS;
    } catch {
      return MOCK_CLOCK_IN_REPORTS;
    }
  }
}

export const getClockInReportsUseCase = new GetClockInReportsUseCase();
