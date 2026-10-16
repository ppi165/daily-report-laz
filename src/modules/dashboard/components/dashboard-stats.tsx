"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  initialData?: {
    totalReports: number;
    activeUsers: number;
    totalUsers: number;
    completionRate: number;
  } | null;
}

export default function DashboardStats({ initialData }: DashboardStatsProps) {
  const [stats, setStats] = useState(() => {
    return (
      initialData ?? {
        totalReports: 0,
        activeUsers: 0,
        totalUsers: 0,
        completionRate: 0,
      }
    );
  });

  useEffect(() => {
    if (initialData !== undefined && initialData !== null) {
      setStats(initialData);
      return;
    }

    let ignore = false;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/v1/dashboard/stats");
        const result = await res.json();
        if (!ignore && result.success && result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
    return () => {
      ignore = true;
    };
  }, [initialData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <Card className="bg-surface-container-lowest/80 backdrop-blur-xs p-5 rounded-2xl border-outline-variant/50 shadow-none hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col gap-2.5">
        <div className="h-1 w-full bg-primary-container absolute top-0 left-0"></div>
        <CardHeader className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Presensi Kerja
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-1">
          <CardTitle className="text-3xl sm:text-4xl text-primary font-black tracking-tight tabular-nums">
            {stats.activeUsers}{" "}
            <span className="text-sm sm:text-base font-semibold text-outline">
              / {stats.totalUsers}
            </span>
          </CardTitle>
          <p className="text-xs text-on-surface-variant font-medium">
            Pegawai Aktif Melapor
          </p>
        </CardContent>
      </Card>

      <Card className="bg-surface-container-lowest/80 backdrop-blur-xs p-5 rounded-2xl border-outline-variant/50 shadow-none hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col gap-2.5">
        <div className="h-1 w-full bg-secondary absolute top-0 left-0"></div>
        <CardHeader className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Aktivitas Pelaporan
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-1">
          <CardTitle className="text-3xl sm:text-4xl text-secondary font-black tracking-tight tabular-nums">
            {stats.totalReports}
          </CardTitle>
          <p className="text-xs text-on-surface-variant font-medium">
            Total Laporan Terbit
          </p>
        </CardContent>
      </Card>

      <Card className="bg-surface-container-lowest/80 backdrop-blur-xs p-5 rounded-2xl border-outline-variant/50 shadow-none hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col gap-2.5">
        <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>
        <CardHeader className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Tingkat Disiplin
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-1">
          <CardTitle className="text-3xl sm:text-4xl text-on-surface font-black tracking-tight tabular-nums">
            {stats.completionRate}%
          </CardTitle>
          <p className="text-xs text-on-surface-variant font-medium">
            Kelengkapan Pelaporan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
