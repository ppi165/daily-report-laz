import { dashboardRepository } from '../repositories/dashboard.repository';

export class GetDashboardStatsUseCase {
  async execute() {
    const [totalReports, activeUsers, totalUsers] = await Promise.all([
      dashboardRepository.countTotalReports(),
      dashboardRepository.countActiveUsers(),
      dashboardRepository.countTotalUsers(),
    ]);

    const completionRate =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    return {
      totalReports,
      activeUsers,
      totalUsers,
      completionRate,
    };
  }
}

export const getDashboardStatsUseCase = new GetDashboardStatsUseCase();
