"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemSettingData } from "../types/setting.types";

interface ClockInSettingsTabProps {
  form: Partial<SystemSettingData>;
  onChange: <K extends keyof SystemSettingData>(key: K, value: SystemSettingData[K]) => void;
}

export default function ClockInSettingsTab({ form, onChange }: ClockInSettingsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Kebijakan Clock-In */}
      <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              history_toggle_off
            </span>
            Kebijakan Laporan Susulan (Clock-In)
          </CardTitle>
          <CardDescription className="text-xs text-on-surface-variant">
            Aturan batas toleransi hari keterlambatan dan ketentuan verifikasi oleh rekan kerja.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clockInMaxDays" className="text-xs font-semibold text-on-surface">
                Batas Maksimal Keterlambatan (Hari)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="clockInMaxDays"
                  type="number"
                  min={1}
                  max={14}
                  value={form.clockInMaxDays ?? 3}
                  onChange={(e) => onChange("clockInMaxDays", parseInt(e.target.value) || 1)}
                  className="h-11 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm font-medium"
                />
                <span className="text-xs font-semibold text-on-surface-variant shrink-0">
                  Hari (H-{form.clockInMaxDays ?? 3})
                </span>
              </div>
              <span className="text-[11px] text-outline">
                Laporan sebelum H-{form.clockInMaxDays ?? 3} otomatis dikunci dan tidak bisa diajukan.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clockInWitness" className="text-xs font-semibold text-on-surface">
                Jumlah Saksi Verifikator
              </Label>
              <Select
                value={String(form.clockInRequiredWitness ?? 2)}
                onValueChange={(val) => {
                  if (val) onChange("clockInRequiredWitness", parseInt(val) || 2);
                }}
              >
                <SelectTrigger id="clockInWitness" className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
                  <SelectValue placeholder="Pilih Jumlah Verifikator" />
                </SelectTrigger>
                <SelectContent className="bg-surface-container-lowest border-outline-variant">
                  <SelectItem value="1">1 Orang Rekan / Atasan</SelectItem>
                  <SelectItem value="2">2 Orang Rekan / Atasan (Konsensus)</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-[11px] text-outline">
                Berapa banyak persetujuan saksi yang dibutuhkan agar laporan clock-in disetujui.
              </span>
            </div>
          </div>

          <Separator className="bg-surface-container" />

          {/* Toggle Wajib Alasan */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low/40">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-on-surface">
                Wajib Isi Alasan Keterlambatan
              </span>
              <p className="text-xs text-on-surface-variant">
                Amil wajib menyertakan alasan mengapa terlambat mengisi laporan tepat waktu.
              </p>
            </div>
            <Switch
              checked={form.clockInRequireReason ?? true}
              onCheckedChange={(val) => onChange("clockInRequireReason", val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Kebijakan Dokumentasi & Privasi */}
      <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              policy
            </span>
            Kebijakan Media & Privasi Feed
          </CardTitle>
          <CardDescription className="text-xs text-on-surface-variant">
            Pengaturan kewajiban dokumentasi foto dan jangkauan tayangan feed aktivitas kerja.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex flex-col gap-5">
          {/* Toggle Wajib Foto */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low/40">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-on-surface">
                Wajib Lampirkan Foto Dokumentasi
              </span>
              <p className="text-xs text-on-surface-variant">
                Jika diaktifkan, amil tidak dapat mengirim laporan harian tanpa mengunggah minimal 1 foto bukti kerja.
              </p>
            </div>
            <Switch
              checked={Boolean(form.requirePhoto)}
              onCheckedChange={(val) => onChange("requirePhoto", val)}
            />
          </div>

          {/* Visibilitas Feed */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feedVisibility" className="text-xs font-semibold text-on-surface">
              Jangkauan Tayangan Feed Publikasi
            </Label>
            <Select
              value={form.feedVisibility || "ALL"}
              onValueChange={(val) => {
                if (val) onChange("feedVisibility", val);
              }}
            >
              <SelectTrigger id="feedVisibility" className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
                <SelectValue placeholder="Pilih Jangkauan Feed" />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-lowest border-outline-variant">
                <SelectItem value="ALL">Seluruh Lembaga (Semua Divisi)</SelectItem>
                <SelectItem value="DIVISION">Internal Anggota Satu Divisi Saja</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[11px] text-outline">
              Menentukan apakah feed laporan harian tampil untuk seluruh amil atau dibatasi per divisi.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
