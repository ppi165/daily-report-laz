"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TodayReportInfo {
  id: string;
  title: string | null;
  createdAt: string;
  status: string;
  division: string;
}

interface TodayStatusCardProps {
  initialData?: {
    hasReportedToday: boolean;
    todayReport: TodayReportInfo | null;
    deadlineTime?: string;
    activeScheduleName?: string | null;
  } | null;
}

export default function TodayStatusCard({ initialData }: TodayStatusCardProps) {
  const [hasReportedToday, setHasReportedToday] = useState<boolean | null>(() => {
    return initialData !== undefined && initialData !== null
      ? initialData.hasReportedToday
      : null;
  });
  const [reportInfo, setReportInfo] = useState<TodayReportInfo | null>(() => {
    return initialData?.todayReport ?? null;
  });
  const [deadlineTime, setDeadlineTime] = useState<string>(() => {
    return initialData?.deadlineTime || "17:00";
  });
  const [activeScheduleName, setActiveScheduleName] = useState<string | null>(() => {
    return initialData?.activeScheduleName ?? null;
  });
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (initialData !== undefined && initialData !== null) {
      setHasReportedToday(initialData.hasReportedToday);
      setReportInfo(initialData.todayReport);
      if (initialData.deadlineTime) setDeadlineTime(initialData.deadlineTime);
      if (initialData.activeScheduleName !== undefined) {
        setActiveScheduleName(initialData.activeScheduleName);
      }
      return;
    }

    async function checkTodayStatus() {
      try {
        const res = await fetch("/api/v1/dashboard/stats");
        const json = await res.json();
        if (json.success && json.data) {
          setHasReportedToday(json.data.hasReportedToday);
          setReportInfo(json.data.todayReport);
          if (json.data.deadlineTime) {
            setDeadlineTime(json.data.deadlineTime);
          }
          if (json.data.activeScheduleName) {
            setActiveScheduleName(json.data.activeScheduleName);
          }
        } else {
          setHasReportedToday(false);
        }
      } catch {
        setHasReportedToday(false);
      }
    }
    checkTodayStatus();
  }, [initialData]);

  // Hitung sisa waktu mundur menuju deadline
  useEffect(() => {
    if (hasReportedToday) return;

    function updateRemaining() {
      const now = new Date();
      const [h, m] = deadlineTime.split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return;

      const deadline = new Date();
      deadline.setHours(h, m, 0, 0);

      const diffMs = deadline.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeRemaining("Batas waktu reguler telah lewat");
      } else {
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffHrs > 0) {
          setTimeRemaining(`Sisa ${diffHrs} jam ${diffMins} menit`);
        } else {
          setTimeRemaining(`Sisa ${diffMins} menit`);
        }
      }
    }

    updateRemaining();
    const timer = setInterval(updateRemaining, 60000);
    return () => clearInterval(timer);
  }, [deadlineTime, hasReportedToday]);

  const formattedTime = reportInfo?.createdAt
    ? new Date(reportInfo.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    : "";

  const isPending = reportInfo?.status === "PENDING_APPROVAL";

  return (
    <Card className="lg:col-span-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border-outline-variant/60 shadow-xs flex flex-col justify-between gap-4">
      <CardHeader className="p-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Status Hari Ini
          </span>
          {hasReportedToday === null ? (
            <span className="text-xs font-medium text-outline">Memeriksa...</span>
          ) : hasReportedToday ? (
            <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-secondary"></span>
              Sudah Lapor
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500"></span>
              Belum Lapor
            </span>
          )}
        </div>

        <CardTitle className="text-lg sm:text-xl font-bold text-on-surface tracking-tight leading-snug">
          {hasReportedToday
            ? isPending
              ? "Laporan Sedang Diverifikasi"
              : "Laporan Hari Ini Selesai"
            : "Belum Melapor Hari Ini"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-3">
        {hasReportedToday ? (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/40 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Jam Kirim</span>
              <span className="font-semibold text-on-surface">{formattedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Status</span>
              <span
                className={`font-bold ${
                  isPending ? "text-amber-500" : "text-secondary"
                }`}
              >
                {isPending ? "Menunggu Saksi" : "Diterbitkan"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/40 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Batas Waktu</span>
              <span className="font-semibold text-on-surface font-mono">
                {deadlineTime} WIB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Keterangan</span>
              <span className="text-xs text-secondary font-medium">
                {timeRemaining || activeScheduleName || "Hari Kerja Normal"}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bagian Tombol Aksi (Diberi padding atas dan breathing room bawah alami) */}
      <div className="pt-2 mt-auto">
        {hasReportedToday ? (
          <Link
            href="/rekap-report"
            className="w-full h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold flex items-center justify-center transition-colors border border-outline-variant/50"
          >
            Lihat Rekap Laporan
          </Link>
        ) : (
          <Link
            href="/daily-report"
            className="w-full h-11 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs sm:text-sm font-semibold flex items-center justify-center transition-colors shadow-xs"
          >
            Tulis Laporan Sekarang
          </Link>
        )}
      </div>
    </Card>
  );
}
