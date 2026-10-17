"use client";

import { useState } from "react";
import Image from "next/image";

interface FeedMediaCarouselProps {
  attachments: string[];
  authorName?: string;
}

export default function FeedMediaCarousel({
  attachments,
  authorName,
}: FeedMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const hasMultiple = attachments.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));
  };

  const currentUrl = attachments[currentIndex];

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container rounded-xl overflow-hidden border border-outline-variant/60 group select-none">
      {/* Gambar Utama */}
      <a
        href={currentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full relative cursor-zoom-in"
        title="Klik untuk melihat foto ukuran penuh"
      >
        <Image
          src={currentUrl}
          alt={`Dokumentasi ${authorName ? `oleh ${authorName}` : ""} ${currentIndex + 1}`}
          fill
          unoptimized
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </a>

      {/* Counter Badge jika foto > 1 */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-inverse-surface/75 text-inverse-on-surface text-[11px] font-mono font-medium backdrop-blur-md shadow-xs pointer-events-none">
          {currentIndex + 1} / {attachments.length}
        </div>
      )}

      {/* Tombol Navigasi Panah Kiri */}
      {hasMultiple && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Foto sebelumnya"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-inverse-surface/70 hover:bg-inverse-surface/90 text-inverse-on-surface flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md backdrop-blur-sm cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
      )}

      {/* Tombol Navigasi Panah Kanan */}
      {hasMultiple && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Foto berikutnya"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 size-8 rounded-full bg-inverse-surface/70 hover:bg-inverse-surface/90 text-inverse-on-surface flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md backdrop-blur-sm cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      )}

      {/* Bullet Dot Indicator jika foto > 1 */}
      {hasMultiple && (
        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
          {attachments.map((_, idx) => (
            <span
              key={idx}
              className={`transition-all duration-200 rounded-full ${
                idx === currentIndex
                  ? "w-4 h-1.5 bg-white shadow-xs"
                  : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
