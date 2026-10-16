import { dashboardRepository } from '../repositories/dashboard.repository';
import { settingRepository } from '@/src/modules/settings';
import { getActiveScheduleUseCase } from '@/src/modules/schedules';

export class GetDashboardStatsUseCase {
  async execute(userId?: string) {
    const [
      totalReports,
      activeUsers,
      totalUsers,
      todayReport,
      settings,
      activeSchedule,
      recentReports,
      teamFeeds,
    ] = await Promise.all([
      dashboardRepository.countTotalReports(),
      dashboardRepository.countActiveUsers(),
      dashboardRepository.countTotalUsers(),
      userId ? dashboardRepository.findTodayReportByUserId(userId) : Promise.resolve(null),
      settingRepository.findDefault(),
      getActiveScheduleUseCase.execute(),
      userId ? dashboardRepository.findRecentReportsByUserId(userId, 3) : Promise.resolve([]),
      dashboardRepository.findTeamFeeds(5),
    ]);

    const completionRate =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    let deadlineTime = settings.dailyDeadlineTime;
    let activeScheduleName: string | null = null;

    if (activeSchedule) {
      deadlineTime = activeSchedule.deadlineTime;
      activeScheduleName = activeSchedule.name;
    } else if (settings.isRamadhanMode) {
      deadlineTime = settings.ramadhanDeadlineTime;
      activeScheduleName = "Mode Ramadhan";
    }

    return {
      totalReports,
      activeUsers,
      totalUsers,
      completionRate,
      hasReportedToday: !!todayReport,
      deadlineTime,
      activeScheduleName,
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
      recentReports: recentReports || [],
      teamFeeds: teamFeeds || [],
    };
  }
}

export const getDashboardStatsUseCase = new GetDashboardStatsUseCase();
