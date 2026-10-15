"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline">Status Hari Ini</span>
          {hasReportedToday === null ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-outline">
              Memeriksa...
            </span>
          ) : hasReportedToday ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
              Sudah Lapor
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-error-container text-on-error-container">
              Belum Lapor
            </span>
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
          <Link
            href="/rekap-report"
            className="w-full bg-secondary hover:bg-primary-container text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">
              task_alt
            </span>
            <span>Lihat Rekap Laporan</span>
          </Link>
        ) : (
          <Link
            href="/daily-report"
            className="w-full bg-primary-container hover:bg-secondary text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            <span>Tulis Laporan Hari Ini</span>
          </Link>
        )}
      </div>
    </div>
  );
}
