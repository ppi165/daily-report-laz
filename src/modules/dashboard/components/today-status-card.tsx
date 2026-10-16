"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  // Format waktu laporan dikirim
  const formattedTime = reportInfo?.createdAt
    ? new Date(reportInfo.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    : "";

  const cardBorderClass =
    hasReportedToday === null
      ? "border-outline-variant/60"
      : hasReportedToday
      ? "border-secondary/40 shadow-xs"
      : "border-error/30 shadow-xs";

  return (
    <Card className={`lg:col-span-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl ${cardBorderClass} flex flex-col gap-4 relative overflow-hidden transition-colors`}>
      <CardHeader className="p-0 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Status Hari Ini
          </span>
          {hasReportedToday === null ? (
            <span className="text-xs font-semibold text-outline">
              Memeriksa...
            </span>
          ) : hasReportedToday ? (
            <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-secondary"></span>
              Sudah Lapor
            </span>
          ) : (
            <span className="text-xs font-bold text-error flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-error"></span>
              Belum Lapor
            </span>
          )}
        </div>

        <CardTitle className="text-lg sm:text-xl font-bold text-on-surface tracking-tight leading-snug">
          {hasReportedToday
            ? "Laporan Anda Telah Terkirim"
            : "Laporan Hari Ini Belum Dikirim"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-3">
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {hasReportedToday
            ? "Alhamdulillah, seluruh aktivitas dan laporan amil Anda untuk hari ini telah berhasil terdata dalam sistem."
            : "Pastikan laporan aktivitas kerja harian Anda diserahkan sebelum batas waktu agar presensi terekap tepat waktu."}
        </p>

        {hasReportedToday ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-secondary font-medium">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Terkirim: <strong className="text-on-surface">{formattedTime}</strong></span>
            </div>
            <span className="text-[11px] font-bold text-secondary">
              Tepat Waktu
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/80 border border-outline-variant/60 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
              <span>Batas: <strong className="text-on-surface">{deadlineTime} WIB</strong></span>
            </div>
            {activeScheduleName && (
              <span className="text-[11px] font-semibold text-secondary font-mono">
                {activeScheduleName}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 pb-5 sm:pb-6 pt-2 bg-transparent border-0 mt-auto">
        {hasReportedToday ? (
          <Button
            render={<Link href="/rekap-report" />}
            nativeButton={false}
            className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span data-icon="inline-start" className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Lihat Rekap Laporan</span>
          </Button>
        ) : (
          <Button
            render={<Link href="/daily-report" />}
            nativeButton={false}
            className="w-full h-11 bg-primary-container hover:bg-secondary text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span data-icon="inline-start" className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Tulis Laporan Hari Ini</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
