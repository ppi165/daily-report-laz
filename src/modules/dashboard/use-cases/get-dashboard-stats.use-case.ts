import { dashboardRepository } from '../repositories/dashboard.repository';

export class GetDashboardStatsUseCase {
  async execute(userId?: string) {
    const [totalReports, activeUsers, totalUsers, todayReport] = await Promise.all([
      dashboardRepository.countTotalReports(),
      dashboardRepository.countActiveUsers(),
      dashboardRepository.countTotalUsers(),
      userId ? dashboardRepository.findTodayReportByUserId(userId) : Promise.resolve(null),
    ]);

    const completionRate =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    return {
      totalReports,
      activeUsers,
      totalUsers,
      completionRate,
      hasReportedToday: !!todayReport,
      todayReport: todayReport
        ? {
            id: todayReport.id,
            title: todayReport.title,
            createdAt: todayReport.createdAt,
            status: todayReport.status,
            division: todayReport.division,
          }
        : null,
    };
  }
}

export const getDashboardStatsUseCase = new GetDashboardStatsUseCase();
