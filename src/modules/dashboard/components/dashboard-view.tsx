import AppShell from "@/src/common/components/app-shell";
import GreetingBanner from "./greeting-banner";
import TodayStatusCard from "./today-status-card";
import DashboardStats from "./dashboard-stats";
import RecentActivityCard from "./recent-activity-card";
import TeamFeed from "./team-feed";

interface DashboardViewProps {
  user?: {
    name?: string;
  } | null;
  stats?: {
    totalReports: number;
    activeUsers: number;
    totalUsers: number;
    completionRate: number;
    hasReportedToday: boolean;
    deadlineTime?: string;
    activeScheduleName?: string | null;
    todayReport?: {
      id: string;
      title: string | null;
      createdAt: string | Date;
      status: string;
      division: string;
    } | null;
    recentReports?: Array<{
      id: string;
      title: string | null;
      content: string;
      createdAt: string | Date;
      status: string;
      appreciations?: number;
      attachments?: string[];
      division?: string;
    }>;
    teamFeeds?: Array<{
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
    }>;
  } | null;
}

export default function DashboardView({ user, stats }: DashboardViewProps) {
  return (
    <AppShell>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 sm:gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <GreetingBanner user={user} />
          <TodayStatusCard
            initialData={
              stats
                ? {
                    hasReportedToday: stats.hasReportedToday,
                    todayReport: stats.todayReport
                      ? {
                          ...stats.todayReport,
                          createdAt:
                            typeof stats.todayReport.createdAt === "string"
                              ? stats.todayReport.createdAt
                              : stats.todayReport.createdAt.toISOString(),
                        }
                      : null,
                    deadlineTime: stats.deadlineTime,
                    activeScheduleName: stats.activeScheduleName,
                  }
                : undefined
            }
          />
        </div>

        <DashboardStats
          initialData={
            stats
              ? {
                  totalReports: stats.totalReports,
                  activeUsers: stats.activeUsers,
                  totalUsers: stats.totalUsers,
                  completionRate: stats.completionRate,
                }
              : undefined
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <RecentActivityCard activities={stats?.recentReports} />
          <TeamFeed feeds={stats?.teamFeeds} />
        </div>
      </main>
    </AppShell>
  );
}
