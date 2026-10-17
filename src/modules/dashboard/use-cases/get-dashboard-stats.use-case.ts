import { dashboardRepository } from '../repositories/dashboard.repository';
import { settingRepository } from '@/src/modules/settings';
import { getActiveScheduleUseCase } from '@/src/modules/schedules';

export interface DashboardReportItem {
  id: string;
  title: string | null;
  content: string;
  createdAt: string | Date;
  status: string;
  appreciations?: number;
  attachments?: string[];
  division?: string;
  commentsCount?: number;
}

export interface DashboardTeamFeedItem {
  id: string;
  author?: {
    name: string;
    division: string;
    role?: string;
  } | null;
  content: string;
  createdAt: string | Date;
  appreciations?: number;
  attachments?: string[];
  commentsCount?: number;
}

export function cleanDashboardSnippet(content: string): string {
  if (!content) return "";
  let text = content;

  // Cek apakah format baru dengan tag [PEKERJAAN]
  const pekerjaanMatch = text.match(/\[PEKERJAAN\]([\s\S]*?)(?=\[HASIL \/ OUTPUT\]|$)/i);
  if (pekerjaanMatch && pekerjaanMatch[1]) {
    text = pekerjaanMatch[1].trim();
  } else {
    text = text.replace(/\[PEKERJAAN\]/gi, "").replace(/\[HASIL \/ OUTPUT\]/gi, "").trim();
  }

  // Jika terlalu panjang, potong secara proporsional
  if (text.length > 180) {
    return text.slice(0, 180) + "...";
  }
  return text;
}

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
      monthlyReportsCount,
    ] = await Promise.all([
      dashboardRepository.countTotalReports(),
      dashboardRepository.countActiveUsersToday(),
      dashboardRepository.countTotalUsers(),
      userId ? dashboardRepository.findTodayReportByUserId(userId) : Promise.resolve(null),
      settingRepository.findDefault(),
      getActiveScheduleUseCase.execute(),
      userId ? dashboardRepository.findRecentReportsByUserId(userId, 3) : Promise.resolve([]),
      dashboardRepository.findTeamFeeds(3),
      userId ? dashboardRepository.countUserMonthlyReports(userId) : Promise.resolve(0),
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

    const cleanedRecentReports: DashboardReportItem[] = recentReports.map((r) => ({
      id: r.id,
      title: r.title,
      content: cleanDashboardSnippet(r.content),
      createdAt: r.createdAt,
      status: r.status,
      appreciations: r._count?.likes ? Math.max(r._count.likes, r.appreciations) : r.appreciations,
      attachments: r.attachments,
      division: r.division,
      commentsCount: r._count?.comments || 0,
    }));

    const cleanedTeamFeeds: DashboardTeamFeedItem[] = teamFeeds.map((f) => ({
      id: f.id,
      author: f.author,
      content: cleanDashboardSnippet(f.content),
      createdAt: f.createdAt,
      appreciations: f._count?.likes ? Math.max(f._count.likes, f.appreciations) : f.appreciations,
      attachments: f.attachments,
      commentsCount: f._count?.comments || 0,
    }));

    return {
      totalReports,
      activeUsers,
      totalUsers,
      completionRate,
      hasReportedToday: !!todayReport,
      deadlineTime,
      activeScheduleName,
      isRamadhanMode: settings.isRamadhanMode,
      monthlyReportsCount,
      todayReport: todayReport
        ? {
            id: todayReport.id,
            title: todayReport.title,
            createdAt: todayReport.createdAt,
            status: todayReport.status,
            division: todayReport.division,
          }
        : null,
      recentReports: cleanedRecentReports,
      teamFeeds: cleanedTeamFeeds,
    };
  }
}

export const getDashboardStatsUseCase = new GetDashboardStatsUseCase();
