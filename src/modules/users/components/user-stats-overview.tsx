"use client";

import { Card, CardContent } from "@/components/ui/card";

interface UserStatsOverviewProps {
  stats: {
    total: number;
    superadmin: number;
    admin: number;
    supervisor: number;
    staff: number;
  };
}

export default function UserStatsOverview({ stats }: UserStatsOverviewProps) {
  const cards = [
    {
      title: "Total Amil Terdaftar",
      value: stats.total,
      desc: "Seluruh personil aktif",
      icon: "group",
      color: "text-primary",
      borderColor: "border-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pimpinan / Admin",
      value: stats.admin + stats.superadmin,
      desc: `${stats.superadmin} Root + ${stats.admin} Pimpinan`,
      icon: "shield_person",
      color: "text-amber-500",
      borderColor: "border-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Supervisor / Koor",
      value: stats.supervisor,
      desc: "Verifikator & PJ Bidang",
      icon: "verified_user",
      color: "text-secondary",
      borderColor: "border-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Staf Pelaksana",
      value: stats.staff,
      desc: "Amil pelaksana harian",
      icon: "person",
      color: "text-on-surface",
      borderColor: "border-outline",
      bgColor: "bg-surface-container",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((c) => (
        <Card
          key={c.title}
          className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden"
        >
          <CardContent className="p-0 flex flex-col justify-between h-full gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-outline tracking-tight">
                {c.title}
              </span>
              <div className={`size-8 rounded-xl ${c.bgColor} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[18px] ${c.color}`}>
                  {c.icon}
                </span>
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight tabular-nums">
                {c.value}
              </div>
              <div className="text-[11px] text-outline font-medium mt-0.5">
                {c.desc}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
