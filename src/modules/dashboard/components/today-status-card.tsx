"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TodayReportInfo {
  id: string;
  title: string | null;
  createdAt: string;
  status: string;
  division: string;
}

export default function TodayStatusCard() {
  const [hasReportedToday, setHasReportedToday] = useState<boolean | null>(null);
  const [reportInfo, setReportInfo] = useState<TodayReportInfo | null>(null);
  const [deadlineTime, setDeadlineTime] = useState<string>("17:00");

  useEffect(() => {
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
        } else {
          setHasReportedToday(false);
        }
      } catch {
        setHasReportedToday(false);
      }
    }
    checkTodayStatus();
  }, []);

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
    <Card className={`lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl ${cardBorderClass} flex flex-col justify-between gap-4 relative overflow-hidden transition-colors`}>
      <CardHeader className="p-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
            Status Hari Ini
          </span>
          {hasReportedToday === null ? (
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-surface-container text-outline">
              Memeriksa...
            </Badge>
          ) : hasReportedToday ? (
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-secondary/15 text-secondary border-transparent">
              Sudah Lapor
            </Badge>
          ) : (
            <Badge variant="destructive" className="px-2.5 py-0.5 text-xs font-semibold bg-error/15 text-error border-transparent">
              Belum Lapor
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl font-bold text-on-surface tracking-tight">
          {hasReportedToday
            ? "Laporan Anda Telah Terkirim"
            : "Laporan Hari Ini Belum Dikirim"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
          {hasReportedToday ? (
            <span>
              Terkirim pukul {formattedTime}
            </span>
          ) : (
            <span>Batas pengisian: {deadlineTime} WIB</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-0 bg-transparent border-0 pt-2">
        {hasReportedToday ? (
          <Button
            render={<Link href="/rekap-report" />}
            nativeButton={false}
            className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center shadow-sm transition-all cursor-pointer"
          >
            <span>Lihat Rekap Laporan</span>
          </Button>
        ) : (
          <Button
            render={<Link href="/daily-report" />}
            nativeButton={false}
            className="w-full h-11 bg-primary-container hover:bg-secondary text-white rounded-xl text-sm font-semibold flex items-center justify-center shadow-sm transition-all cursor-pointer"
          >
            <span>Tulis Laporan Hari Ini</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
