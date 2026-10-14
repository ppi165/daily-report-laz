import DashboardView from "@/src/modules/dashboard/components/dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Daily Report LAZ Persis",
  description: "Dashboard Utama Sistem Pelaporan Harian LAZ Persis",
};

export default function DashboardPage() {
  return <DashboardView />;
}
