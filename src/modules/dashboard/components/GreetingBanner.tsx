"use client";

import { useEffect, useState } from "react";

export default function GreetingBanner() {
  const [userName, setUserName] = useState("Pegawai");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/users/me");
        const data = await res.json();
        if (data.success) {
          setUserName(data.data.name.split(' ')[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary-container/30 text-on-secondary-container">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Amanah Operasional
          </span>
          <span className="text-sm text-outline">Bulan Berjalan</span>
        </div>
        <h1 className="text-2xl lg:text-3xl text-on-surface font-bold">
          Selamat datang, {userName}! 👋
        </h1>
        <p className="text-sm lg:text-base text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
          Berikut ringkasan komitmen dan laporan aktivitas harian Anda bulan September 2026. Pertahankan konsistensi pelaporan untuk transparansi lembaga.
        </p>
      </div>
      <div className="pt-4 mt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-2 text-sm text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            calendar_today
          </span>
          Senin, 28 September 2026
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-primary-container">
            schedule
          </span>
          Zona Waktu: WIB (GMT+7)
        </span>
      </div>
    </div>
  );
}
