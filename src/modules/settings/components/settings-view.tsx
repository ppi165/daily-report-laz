"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SuccessToast from "@/src/common/components/success-toast";
import GeneralSettingsTab from "./general-settings-tab";
import ClockInSettingsTab from "./clock-in-settings-tab";
import { updateSettingsAction } from "../actions/update-settings.action";
import { SystemSettingData } from "../types/setting.types";

interface SettingsViewProps {
  initialSettings: SystemSettingData;
}

export default function SettingsView({ initialSettings }: SettingsViewProps) {
  const [form, setForm] = useState<SystemSettingData>(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [toastData, setToastData] = useState<{ title: string; description: string } | null>(null);

  const handleFieldChange = <K extends keyof SystemSettingData>(key: K, value: SystemSettingData[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSettingsAction({
        dailyDeadlineTime: form.dailyDeadlineTime,
        reminderTime: form.reminderTime,
        clockInMaxDays: form.clockInMaxDays,
        clockInRequiredWitness: form.clockInRequiredWitness,
        clockInRequireReason: form.clockInRequireReason,
        workDays: form.workDays,
        isRamadhanMode: form.isRamadhanMode,
        ramadhanDeadlineTime: form.ramadhanDeadlineTime,
        requirePhoto: form.requirePhoto,
        feedVisibility: form.feedVisibility as "ALL" | "DIVISION",
      });

      if (res.success) {
        setToastData({
          title: "Pengaturan Tersimpan",
          description: "Konfigurasi aturan sistem berhasil diperbarui.",
        });
      } else {
        alert(res.message || "Gagal menyimpan perubahan pengaturan.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[28px]">
              tune
            </span>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Pengaturan Umum Sistem
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Konfigurasi parameter jadwal pelaporan, batasan clock-in, dan kebijakan sistem LAZ Persis.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">
            {saving ? "sync" : "save"}
          </span>
          <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
        </Button>
      </div>

      {/* Tabs Menu */}
      <Tabs value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
        <TabsList className="bg-surface-container-low/70 border border-outline-variant/60 p-1 rounded-xl w-full sm:w-fit h-auto grid grid-cols-2 sm:inline-flex gap-1">
          <TabsTrigger
            value="general"
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg data-[state=active]:bg-surface-container-lowest data-[state=active]:text-secondary data-[state=active]:shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              schedule
            </span>
            <span className="hidden sm:inline">Jadwal & Batas Pelaporan</span>
            <span className="sm:hidden">Batas Pelaporan</span>
          </TabsTrigger>

          <TabsTrigger
            value="clock-in"
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg data-[state=active]:bg-surface-container-lowest data-[state=active]:text-secondary data-[state=active]:shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              history_toggle_off
            </span>
            <span className="hidden sm:inline">Kebijakan Clock-In & Privasi</span>
            <span className="sm:hidden">Clock-In & Privasi</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <GeneralSettingsTab form={form} onChange={handleFieldChange} />
        </TabsContent>

        <TabsContent value="clock-in" className="pt-4">
          <ClockInSettingsTab form={form} onChange={handleFieldChange} />
        </TabsContent>
      </Tabs>

      {toastData && (
        <SuccessToast
          title={toastData.title}
          description={toastData.description}
          onClose={() => setToastData(null)}
        />
      )}
    </div>
  );
}
