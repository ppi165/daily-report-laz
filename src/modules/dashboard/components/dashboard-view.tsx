import AppShell from "@/src/common/components/app-shell";
import GreetingBanner from "./greeting-banner";
import TodayStatusCard from "./today-status-card";
import DashboardStats from "./dashboard-stats";
import RecentActivityCard from "./recent-activity-card";
import TeamFeed from "./team-feed";

export default function DashboardView() {
  return (
    <AppShell>
      <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <GreetingBanner />
          <TodayStatusCard />
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RecentActivityCard />
          <TeamFeed />
        </div>
      </main>
    </AppShell>
  );
}
