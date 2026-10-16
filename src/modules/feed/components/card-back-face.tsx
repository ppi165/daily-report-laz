"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ParsedFeedReport } from "../use-cases/get-feed-reports.use-case";

interface CardBackFaceProps {
  report: ParsedFeedReport;
  onFlipToFront: () => void;
}

export default function CardBackFace({
  report,
  onFlipToFront,
}: CardBackFaceProps) {
  const initialLetter = report.author?.name ? report.author.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border-2 border-secondary/50 shadow-sm flex flex-col gap-4">
      {/* Header: Sisi Belakang (Hasil Kerja) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 sm:size-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-base sm:text-lg shrink-0 border border-secondary/30 shadow-xs">
            {initialLetter}
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-sm sm:text-base font-bold text-on-surface leading-tight">
                {report.author?.name || "Amil LAZ Persis"}
              </span>
              <span className="text-xs font-semibold text-secondary">
                • {report.division}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">task_alt</span>
                Hasil &amp; Capaian Pengerjaan
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold font-mono text-primary px-2 py-0.5 rounded-md bg-primary/10">
            Output
          </span>
        </div>
      </div>

      <Separator className="bg-surface-container" />

      {/* Konten: Hasil / Output Pekerjaan (Dynamic Height) */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-outline font-mono">
          Rincian Hasil / Capaian:
        </span>
        <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans bg-surface-container-low/40 rounded-xl p-3.5 border border-outline-variant/30">
          {report.results}
        </div>
      </div>

      <Separator className="bg-surface-container" />

      {/* Footer: Tombol Balik Kembali ke Depan */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-xs text-outline italic">
          Klik tombol untuk membalik kembali ke aktivitas utama
        </span>

        <Button
          type="button"
          size="sm"
          onClick={onFlipToFront}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-semibold h-auto cursor-pointer shrink-0 transition-transform active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">replay</span>
          <span>Kembali ke Depan</span>
        </Button>
      </div>
    </div>
  );
}
