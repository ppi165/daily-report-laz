"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateScheduleRetentionAction } from "../actions/update-schedule-retention.action";

interface ScheduleRetentionConfigProps {
  initialType?: string;
  initialValue?: number;
  onUpdated?: () => void;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => i + 1);

export default function ScheduleRetentionConfig({
  initialType = "MONTH",
  initialValue = 3,
  onUpdated,
}: ScheduleRetentionConfigProps) {
  const [retentionType, setRetentionType] = useState<"MONTH" | "YEAR" | "NEVER">(
    (initialType as "MONTH" | "YEAR" | "NEVER") || "MONTH"
  );
  const [retentionValue, setRetentionValue] = useState<number>(initialValue || 3);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTypeChange = (newType: string | null) => {
    if (!newType) return;
    const type = newType as "MONTH" | "YEAR" | "NEVER";
    setRetentionType(type);
    if (type === "YEAR" && retentionValue > 5) {
      setRetentionValue(1);
    }
  };

  const handleValueChange = (newVal: string | null) => {
    if (!newVal) return;
    setRetentionValue(parseInt(newVal) || 1);
  };

  const handleSaveRetention = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await updateScheduleRetentionAction({
        retentionType,
        retentionValue,
      });
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        if (onUpdated) onUpdated();
      } else {
        alert(res.message || "Gagal menyimpan aturan retensi.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat memperbarui aturan retensi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-outline-variant/60 bg-surface-container-low/40">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">
            auto_delete
          </span>
          <h4 className="text-sm font-bold text-on-surface">
            Pembersihan Otomatis Jadwal Kedaluwarsa (Auto-Cleanup)
          </h4>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Atur batas waktu retensi penyimpanan agar riwayat jadwal yang telah lewat masa berlakunya terhapus otomatis dari database.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Selektor 1: Satuan Waktu */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-on-surface">
            Satuan Masa Retensi
          </Label>
          <Select value={retentionType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
              <SelectValue placeholder="Pilih Satuan Waktu" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border-outline-variant">
              <SelectItem value="MONTH">Hitungan Bulan</SelectItem>
              <SelectItem value="YEAR">Hitungan Tahun</SelectItem>
              <SelectItem value="NEVER">Simpan Selamanya (Tanpa Auto-Delete)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selektor 2: Nilai Angka Rentang */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-on-surface">
            Lama Masa Simpan
          </Label>
          {retentionType === "NEVER" ? (
            <div className="h-11 px-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 flex items-center text-xs text-outline font-medium">
              Tidak ada penghapusan otomatis
            </div>
          ) : (
            <Select
              value={String(retentionValue)}
              onValueChange={handleValueChange}
            >
              <SelectTrigger className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
                <SelectValue placeholder="Pilih Rentang" />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-lowest border-outline-variant">
                {retentionType === "MONTH"
                  ? MONTH_OPTIONS.map((val) => (
                      <SelectItem key={val} value={String(val)}>
                        {val} Bulan Setelah Berakhir
                      </SelectItem>
                    ))
                  : YEAR_OPTIONS.map((val) => (
                      <SelectItem key={val} value={String(val)}>
                        {val} Tahun Setelah Berakhir
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-outline-variant/40">
        <p className="text-[11px] text-outline leading-tight">
          {retentionType === "NEVER"
            ? "Semua arsip riwayat jadwal akan tetap disimpan permanen di database."
            : `Jadwal khusus yang telah berakhir lebih dari ${retentionValue} ${
                retentionType === "MONTH" ? "bulan" : "tahun"
              } akan dibersihkan otomatis.`}
        </p>

        <Button
          type="button"
          onClick={handleSaveRetention}
          disabled={saving}
          size="sm"
          className="h-9 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs transition-colors shrink-0 cursor-pointer"
        >
          {saving ? "Menyimpan..." : savedSuccess ? "Tersimpan!" : "Simpan Aturan Retensi"}
        </Button>
      </div>
    </div>
  );
}
