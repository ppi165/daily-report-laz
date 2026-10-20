"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpecialSchedulesCard } from "@/src/modules/schedules";
import { SystemSettingData } from "../types/setting.types";

interface GeneralSettingsTabProps {
  form: Partial<SystemSettingData>;
  onChange: <K extends keyof SystemSettingData>(key: K, value: SystemSettingData[K]) => void;
}

const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Senin" },
  { key: "TUESDAY", label: "Selasa" },
  { key: "WEDNESDAY", label: "Rabu" },
  { key: "THURSDAY", label: "Kamis" },
  { key: "FRIDAY", label: "Jumat" },
  { key: "SATURDAY", label: "Sabtu" },
  { key: "SUNDAY", label: "Ahad" },
];

export default function GeneralSettingsTab({ form, onChange }: GeneralSettingsTabProps) {
  const currentWorkDays = form.workDays || [];

  const handleToggleDay = (dayKey: string) => {
    if (currentWorkDays.includes(dayKey)) {
      if (currentWorkDays.length === 1) return; // minimal 1 hari
      onChange("workDays", currentWorkDays.filter((d) => d !== dayKey));
    } else {
      onChange("workDays", [...currentWorkDays, dayKey]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Card Jam & Deadline */}
      <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              schedule
            </span>
            Jadwal Batas Pelaporan Harian
          </CardTitle>
          <CardDescription className="text-xs text-on-surface-variant">
            Konfigurasi jam batas akhir pengisian laporan harian reguler dan waktu pengingat otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dailyDeadlineTime" className="text-xs font-semibold text-on-surface">
                Jam Batas Pelaporan Reguler (WIB)
              </Label>
              <Input
                id="dailyDeadlineTime"
                type="time"
                value={form.dailyDeadlineTime || "17:00"}
                onChange={(e) => onChange("dailyDeadlineTime", e.target.value)}
                className="h-11 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm font-medium"
              />
              <span className="text-[11px] text-outline">
                Laporan yang diisi setelah jam ini akan diarahkan ke pengajuan Clock-in.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reminderTime" className="text-xs font-semibold text-on-surface">
                Jam Pengingat Laporan (WIB)
              </Label>
              <Input
                id="reminderTime"
                type="time"
                value={form.reminderTime || "16:00"}
                onChange={(e) => onChange("reminderTime", e.target.value)}
                className="h-11 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm font-medium"
              />
              <span className="text-[11px] text-outline">
                Banner pengingat mulai dipertegas di dashboard pegawai.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Jadwal Kerja Khusus / Event Dinamis */}
      <SpecialSchedulesCard
        retentionType={form.scheduleRetentionType}
        retentionValue={form.scheduleRetentionValue}
      />

      {/* Card Hari Kerja */}
      <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              calendar_month
            </span>
            Hari Kerja Wajib Lapor
          </CardTitle>
          <CardDescription className="text-xs text-on-surface-variant">
            Pilih hari-hari efektif kerja di mana amil diwajibkan mengirimkan laporan harian.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = currentWorkDays.includes(day.key);
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => handleToggleDay(day.key)}
                  className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-secondary text-white border-secondary shadow-xs font-semibold"
                      : "bg-surface-container-lowest border-outline-variant/70 text-on-surface-variant hover:bg-surface-container-low font-normal"
                  }`}
                >
                  <span className="text-xs">{day.label}</span>
                  <span className="text-[10px] opacity-80">
                    {isSelected ? "Wajib" : "Libur"}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
