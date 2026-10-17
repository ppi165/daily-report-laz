"use client";

import { useState, useRef, useEffect } from "react";

interface FeedImageMenuProps {
  imageUrl: string;
  authorName?: string;
  index: number;
}

export default function FeedImageMenu({
  imageUrl,
  authorName,
  index,
}: FeedImageMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const cleanAuthor = authorName ? authorName.toLowerCase().replace(/\s+/g, "-") : "laporan";
      a.download = `${cleanAuthor}-foto-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="absolute top-3 right-3 z-30" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
        aria-label="Opsi gambar"
        title="Opsi gambar"
        className="size-8 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-all backdrop-blur-md shadow-md border border-white/10 active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">
          more_vert
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-10 w-44 rounded-xl bg-neutral-900/95 border border-white/15 text-white shadow-2xl backdrop-blur-xl p-1.5 flex flex-col gap-1 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              window.open(imageUrl, "_blank");
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors text-left cursor-pointer w-full text-neutral-100"
          >
            <span className="material-symbols-outlined text-[18px] text-neutral-300">
              open_in_new
            </span>
            <span>Buka Gambar</span>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors text-left cursor-pointer w-full text-neutral-100 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px] text-neutral-300">
              {isDownloading ? "hourglass_empty" : "download"}
            </span>
            <span>{isDownloading ? "Mengunduh..." : "Download Gambar"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
