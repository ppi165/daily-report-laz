"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  initialData?: {
    totalReports: number;
    activeUsers: number;
    totalUsers: number;
    completionRate: number;
    monthlyReportsCount?: number;
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
        monthlyReportsCount: 0,
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {/* 1. Presensi Kerja Hari Ini */}
      <Card className="bg-surface-container-lowest p-5 rounded-2xl border-outline-variant/60 shadow-xs flex flex-col gap-2">
        <CardHeader className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Presensi Hari Ini
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-0.5">
          <CardTitle className="text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight tabular-nums">
            {stats.activeUsers}{" "}
            <span className="text-sm font-semibold text-outline">
              / {stats.totalUsers} Amil
            </span>
          </CardTitle>
          <p className="text-xs text-on-surface-variant">
            Pegawai telah mengirim laporan
          </p>
        </CardContent>
      </Card>

      {/* 2. Tingkat Kelengkapan Hari Ini */}
      <Card className="bg-surface-container-lowest p-5 rounded-2xl border-outline-variant/60 shadow-xs flex flex-col gap-2">
        <CardHeader className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Tingkat Kelengkapan
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-0.5">
          <CardTitle className="text-2xl sm:text-3xl text-secondary font-extrabold tracking-tight tabular-nums">
            {stats.completionRate}%
          </CardTitle>
          <p className="text-xs text-on-surface-variant">
            Rasio kepatuhan seluruh unit
          </p>
        </CardContent>
      </Card>

      {/* 3. Laporan Saya Bulan Ini */}
      <Card className="bg-surface-container-lowest p-5 rounded-2xl border-outline-variant/60 shadow-xs flex flex-col gap-2">
        <CardHeader className="p-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Laporan Anda Bulan Ini
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-0.5">
          <CardTitle className="text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight tabular-nums">
            {stats.monthlyReportsCount !== undefined
              ? stats.monthlyReportsCount
              : stats.totalReports}{" "}
            <span className="text-sm font-semibold text-outline">Laporan</span>
          </CardTitle>
          <p className="text-xs text-on-surface-variant">
            Tercatat di periode berjalan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
