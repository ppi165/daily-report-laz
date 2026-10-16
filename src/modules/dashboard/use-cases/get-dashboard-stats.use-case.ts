import { dashboardRepository } from '../repositories/dashboard.repository';
import { settingRepository } from '@/src/modules/settings';

export class GetDashboardStatsUseCase {
  async execute(userId?: string) {
    const [totalReports, activeUsers, totalUsers, todayReport, settings] = await Promise.all([
      dashboardRepository.countTotalReports(),
      dashboardRepository.countActiveUsers(),
      dashboardRepository.countTotalUsers(),
      userId ? dashboardRepository.findTodayReportByUserId(userId) : Promise.resolve(null),
      settingRepository.findDefault(),
    ]);

    const completionRate =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    const deadlineTime = settings.isRamadhanMode
      ? settings.ramadhanDeadlineTime
      : settings.dailyDeadlineTime;

    return {
      totalReports,
      activeUsers,
      totalUsers,
      completionRate,
      hasReportedToday: !!todayReport,
      deadlineTime,
      isRamadhanMode: settings.isRamadhanMode,
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
