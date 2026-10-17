"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import FeedImageMenu from "./feed-image-menu";

interface FeedMediaCarouselProps {
  attachments: string[];
  authorName?: string;
  onDoubleTapLike?: () => void;
  isAuthor?: boolean;
}

export default function FeedMediaCarousel({
  attachments,
  authorName,
  onDoubleTapLike,
}: FeedMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const lastTapRef = useRef<number>(0);
  const heartTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const hasMultiple = attachments.length > 1;
  const currentUrl = attachments[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));
  };

  // Triger animasi hati & like
  const triggerDoubleTapLike = () => {
    setShowHeart(true);
    if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
    heartTimerRef.current = setTimeout(() => setShowHeart(false), 700);
    onDoubleTapLike?.();
  };

  // Double tap untuk mobile touch
  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.preventDefault();
      triggerDoubleTapLike();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container rounded-xl overflow-hidden border border-outline-variant/60 group select-none cursor-pointer"
      onDoubleClick={triggerDoubleTapLike}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gambar Utama */}
      <div className="relative w-full h-full">
        <Image
          src={currentUrl}
          alt={`Dokumentasi ${authorName ? `oleh ${authorName}` : ""} ${currentIndex + 1}`}
          fill
          unoptimized
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>

      {/* Animasi Heart Pop-up ala Instagram saat Klik 2x */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="size-24 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center animate-in zoom-in-50 fade-in duration-200">
            <span
              className="material-symbols-outlined text-rose-500 text-[64px] drop-shadow-[0_4px_16px_rgba(244,63,94,0.7)] animate-bounce"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
        </div>
      )}

      {/* Counter Badge di Pojok Kiri Atas */}
      {hasMultiple && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-inverse-surface/75 text-inverse-on-surface text-[11px] font-mono font-medium backdrop-blur-md shadow-xs pointer-events-none z-20">
          {currentIndex + 1} / {attachments.length}
        </div>
      )}

      {/* Menu Titik 3 di Pojok Kanan Atas */}
      <FeedImageMenu
        imageUrl={currentUrl}
        authorName={authorName}
        index={currentIndex}
      />

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
