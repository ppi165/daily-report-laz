"use client";

import { Button } from "@/components/ui/button";

interface FeedResultPanelProps {
  results: string;
  title?: string | null;
  authorName?: string;
  onClose: () => void;
}

export default function FeedResultPanel({
  results,
  title,
  authorName,
  onClose,
}: FeedResultPanelProps) {
  return (
    <div className="w-full rounded-xl bg-surface-container-low/80 border border-secondary/40 p-4 sm:p-5 flex flex-col gap-3 shadow-xs transition-all animate-in fade-in-50 duration-200">
      {/* Header Panel Hasil Kerja */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">
              task_alt
            </span>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface leading-tight">
              Hasil &amp; Capaian Pekerjaan
            </h4>
            <span className="text-[11px] text-secondary font-medium">
              Output resmi {authorName ? `oleh ${authorName}` : ""}
            </span>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="h-8 px-2.5 rounded-lg text-xs font-semibold text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
          <span className="hidden sm:inline">Tutup</span>
        </Button>
      </div>

      {/* Konten Output Hasil Kerja */}
      {title && (
        <span className="text-xs font-semibold text-on-surface-variant">
          Perihal: {title}
        </span>
      )}

      <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans bg-surface-container-lowest/60 rounded-lg p-3.5 border border-outline-variant/40">
        {results || "Tidak ada rincian hasil kerja yang dilampirkan."}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-outline font-mono">
          Status: Tercatat Terverifikasi
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">photo</span>
          <span>Lihat Foto Dokumentasi</span>
        </button>
      </div>
    </div>
  );
}
