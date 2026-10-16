"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function GreetingBanner() {
  const [userName, setUserName] = useState("Pegawai");

  useEffect(() => {
    let ignore = false;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/users/me");
        const data = await res.json();
        if (!ignore && data.success && data.data?.name) {
          setUserName(data.data.name.split(" ")[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
    return () => {
      ignore = true;
    };
  }, []);

  const now = new Date();
  const currentDateFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const currentMonthYear = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <Card className="lg:col-span-8 bg-surface-container-lowest p-6 sm:p-7 rounded-2xl border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between gap-4">
      <div className="absolute top-0 right-0 size-64 bg-radial from-primary/5 to-transparent pointer-events-none rounded-full blur-2xl -mr-16 -mt-16"></div>
      
      <CardHeader className="p-0 flex flex-col gap-2 relative z-10">
        <span className="text-xs text-outline font-medium">Periode {currentMonthYear}</span>
        <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-on-surface font-extrabold tracking-tight">
          Selamat datang, {userName}!
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 relative z-10">
        <p className="text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
          Ringkasan komitmen dan laporan aktivitas harian Anda. Pertahankan konsistensi pelaporan untuk transparansi lembaga.
        </p>
      </CardContent>

      <Separator className="bg-surface-container/80 relative z-10" />

      <CardFooter className="p-0 bg-transparent border-0 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-on-surface-variant relative z-10">
        <span className="font-medium text-on-surface flex items-center gap-2">
          <span className="size-2 rounded-full bg-secondary"></span>
          {currentDateFormatted}
        </span>
        <span className="text-xs text-outline font-mono">
          Zona Waktu: WIB (GMT+7)
        </span>
      </CardFooter>
    </Card>
  );
}
