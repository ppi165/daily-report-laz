import AppShell from "@/src/shared/components/AppShell";
import GreetingBanner from "./GreetingBanner";
import TodayStatusCard from "./TodayStatusCard";
import DashboardStats from "./DashboardStats";
import RecentActivityCard from "./RecentActivityCard";
import TeamFeed from "./TeamFeed";

export default function DashboardView() {
  return (
    <AppShell>
      <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
        {/* Greeting Banner & Quick CTA Card Bento Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <GreetingBanner />
          <TodayStatusCard />
        </div>

        {/* Metric Stat Cards (3 Cols) */}
        <DashboardStats />

        {/* Section Dua Kolom: Aktivitas Terbaru vs Feed Rekan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <RecentActivityCard />
          <TeamFeed />
        </div>
      </main>
    </AppShell>
  );
}
