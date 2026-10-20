"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ReportSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isClockIn: boolean;
  division: string;
  witnessCount?: number;
}

export default function ReportSuccessDialog({
  open,
  onOpenChange,
  isClockIn,
  division,
  witnessCount = 2,
}: ReportSuccessDialogProps) {
  const currentTimeString = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-4">
        {/* Animated Success Badge Icon */}
        <div className="size-16 rounded-full bg-secondary/15 border border-secondary/30 text-secondary flex items-center justify-center shadow-lg shadow-secondary/10 mt-1">
          <span className="material-symbols-outlined text-[36px]">
            {isClockIn ? "assignment_turned_in" : "check_circle"}
          </span>
        </div>

        {/* Dialog Header */}
        <DialogHeader className="flex flex-col items-center gap-1.5 p-0">
          <DialogTitle className="text-lg font-bold text-on-surface tracking-tight">
            {isClockIn ? "Pengajuan Clock-in Berhasil!" : "Laporan Berhasil Terkirim!"}
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant leading-relaxed max-w-xs">
            {isClockIn
              ? `Laporan susulan Anda telah disimpan dengan status menunggu persetujuan ${witnessCount} saksi verifikator.`
              : "Laporan aktivitas kerja hari ini telah berhasil disimpan dan dipublikasikan ke linimasa Feed."}
          </DialogDescription>
        </DialogHeader>

        {/* Info Summary Box */}
        <div className="w-full bg-surface-container-low/70 border border-outline-variant/60 rounded-2xl p-3.5 flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-medium">Status</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 ${
                isClockIn
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-secondary/15 text-secondary border border-secondary/30"
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {isClockIn ? "schedule" : "verified"}
              </span>
              <span>{isClockIn ? "Menunggu Verifikasi" : "Terpublikasi"}</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-medium">Divisi / Unit</span>
            <span className="text-on-surface font-semibold">{division}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-medium">Waktu Kirim</span>
            <span className="text-on-surface font-medium">{currentTimeString}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <Link
            href="/feed"
            onClick={() => onOpenChange(false)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-container hover:bg-secondary text-white font-semibold text-xs sm:text-sm transition-all duration-150 shadow-md cursor-pointer active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">dynamic_feed</span>
            <span>Lihat Linimasa Feed</span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low text-xs font-medium cursor-pointer"
          >
            Tutup & Tetap di Halaman Ini
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
