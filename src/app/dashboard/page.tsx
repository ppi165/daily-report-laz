import DashboardView from "@/src/modules/dashboard/components/dashboard-view";
import { getDashboardStatsUseCase } from "@/src/modules/dashboard/use-cases/get-dashboard-stats.use-case";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { verifyJWT } from "@/src/infrastructure/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dashboard - Daily Report LAZ Persis",
  description: "Dashboard Utama Sistem Pelaporan Harian LAZ Persis",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = await verifyJWT(token);
  if (!decoded?.userId) {
    redirect("/login");
  }

  const userId = decoded.userId as string;

  // Batching data fetching di sisi server dengan Promise.allSettled
  const [userResult, statsResult] = await Promise.allSettled([
    getCurrentUserUseCase.execute(token),
    getDashboardStatsUseCase.execute(userId),
  ]);

  const user = userResult.status === "fulfilled" ? userResult.value : null;
  const stats = statsResult.status === "fulfilled" ? statsResult.value : null;

  return <DashboardView user={user} stats={stats} />;
}
