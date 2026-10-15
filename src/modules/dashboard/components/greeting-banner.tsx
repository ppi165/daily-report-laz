"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GreetingBanner() {
  const [userName, setUserName] = useState("Pegawai");
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");
  const [currentMonthYear, setCurrentMonthYear] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/users/me");
        const data = await res.json();
        if (data.success && data.data?.name) {
          setUserName(data.data.name.split(' ')[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();

    const now = new Date();
    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
    setCurrentDateFormatted(dateFormatted);

    const monthYear = new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(now);
    setCurrentMonthYear(monthYear);
  }, []);

  return (
    <Card className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl border-outline-variant shadow-sm flex flex-col justify-between">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-xs font-semibold bg-secondary-container/30 text-on-secondary-container">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Amanah Operasional
            </Badge>
            <span className="text-sm text-outline">Bulan Berjalan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl text-on-surface font-bold">
            Selamat datang, {userName}!
          </h1>
          <p className="text-sm lg:text-base text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
            Berikut ringkasan komitmen dan laporan aktivitas harian Anda bulan {currentMonthYear || "ini"}. Pertahankan konsistensi pelaporan untuk transparansi lembaga.
          </p>
        </div>
        <div className="pt-4 mt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-2 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              calendar_today
            </span>
            {currentDateFormatted || "Hari ini"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              schedule
            </span>
            Zona Waktu: WIB (GMT+7)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
