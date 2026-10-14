"use client";

import { useEffect, useState } from "react";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalReports: 0,
    activeUsers: 0,
    totalUsers: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/v1/dashboard/stats");
        const result = await res.json();
        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="h-1 w-full bg-primary-container absolute top-0 left-0"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Presensi Kerja
          </span>
          <div className="p-2 rounded-lg bg-surface-container text-primary-container">
            <span className="material-symbols-outlined text-[20px]">
              event_available
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl text-on-surface font-bold tracking-tight">
            {stats.activeUsers} <span className="text-xl">dari {stats.totalUsers}</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Pegawai Aktif Melapor
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="h-1 w-full bg-secondary absolute top-0 left-0"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Aktivitas Pelaporan
          </span>
          <div className="p-2 rounded-lg bg-surface-container text-secondary">
            <span className="material-symbols-outlined text-[20px]">
              task_alt
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl text-on-surface font-bold tracking-tight">
            {stats.totalReports}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Total Laporan Terbit
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Tingkat Disiplin
          </span>
          <div className="p-2 rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[20px]">
              percent
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl text-on-surface font-bold tracking-tight">
            {stats.completionRate}%
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Kelengkapan Pelaporan
          </p>
        </div>
      </div>
    </div>
  );
}
