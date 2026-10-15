"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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

  useEffect(() => {
    async function checkTodayStatus() {
      try {
        const res = await fetch("/api/v1/dashboard/stats");
        const json = await res.json();
        if (json.success && json.data) {
          setHasReportedToday(json.data.hasReportedToday);
          setReportInfo(json.data.todayReport);
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

  return (
    <Card className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
      <CardContent className="p-0 space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline">Status Hari Ini</span>
            {hasReportedToday === null ? (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold bg-surface-container text-outline">
                Memeriksa...
              </Badge>
            ) : hasReportedToday ? (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold bg-secondary-container text-on-secondary-container">
                Sudah Lapor
              </Badge>
            ) : (
              <Badge variant="destructive" className="px-2 py-0.5 text-xs font-semibold bg-error-container text-on-error-container border-transparent">
                Belum Lapor
              </Badge>
            )}
          </div>

          <p className="text-lg font-semibold text-on-surface">
            {hasReportedToday
              ? "Laporan Hari Ini Telah Terkirim"
              : "Laporan Harian Belum Dikirim"}
          </p>

          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            {hasReportedToday ? (
              <>
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  check_circle
                </span>
                <span>
                  Terkirim pukul {formattedTime} ({reportInfo?.status || "PUBLISHED"})
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px] text-error">
                  alarm
                </span>
                <span>Belum disubmit (Batas 17:00 WIB)</span>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 mt-4">
          {hasReportedToday ? (
            <Button
              render={<Link href="/rekap-report" />}
              className="w-full bg-secondary hover:bg-primary-container text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-150 h-auto"
            >
              <span className="material-symbols-outlined text-[20px]">
                task_alt
              </span>
              <span>Lihat Rekap Laporan</span>
            </Button>
          ) : (
            <Button
              render={<Link href="/daily-report" />}
              className="w-full bg-primary-container hover:bg-secondary text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-150 h-auto"
            >
              <span className="material-symbols-outlined text-[20px]">
                add_circle
              </span>
              <span>Tulis Laporan Hari Ini</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
