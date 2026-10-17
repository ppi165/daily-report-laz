"use client";

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
    <div className="w-full rounded-xl bg-surface-container-low/50 border border-outline-variant/60 p-4 sm:p-5 flex flex-col gap-3 transition-all">
      {/* Header Panel Hasil Kerja (Tanpa Ikon / Ceklis) */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/40">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-on-surface leading-tight">
            Hasil &amp; Capaian Pekerjaan
          </h4>
          {title && (
            <span className="text-[11px] text-secondary font-medium block mt-0.5">
              {title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-secondary hover:underline cursor-pointer transition-colors p-1"
        >
          Tutup
        </button>
      </div>

      {/* Konten Rincian Hasil Kerja Normal */}
      <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans bg-surface-container-lowest/70 rounded-lg p-3.5 border border-outline-variant/40">
        {results || "Tidak ada rincian hasil kerja yang dilampirkan."}
      </div>

      {/* Footer Tombol Teks */}
      <div className="flex justify-end pt-0.5">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-secondary hover:underline cursor-pointer transition-colors"
        >
          Lihat Foto Dokumentasi
        </button>
      </div>
    </div>
  );
}
