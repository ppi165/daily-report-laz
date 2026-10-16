"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FeedCommentSection from "./feed-comment-section";
import { toggleAppreciationAction } from "../index";
import { ParsedFeedReport } from "../use-cases/get-feed-reports.use-case";

interface CardFrontFaceProps {
  report: ParsedFeedReport;
  currentUser?: {
    id: string;
    name: string;
    division: string;
  } | null;
  onFlipToBack: () => void;
}

export default function CardFrontFace({
  report,
  currentUser,
  onFlipToBack,
}: CardFrontFaceProps) {
  const [hasLiked, setHasLiked] = useState(report.hasLiked);
  const [likesCount, setLikesCount] = useState(report.appreciationsCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(report.commentsCount);

  const handleToggleLike = async () => {
    if (isLiking) return;

    // Optimistic UI update
    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setHasLiked(nextLiked);
    setLikesCount(nextCount);
    setIsLiking(true);

    try {
      const res = await toggleAppreciationAction({ reportId: report.id });
      if (!res.success) {
        // Rollback
        setHasLiked(hasLiked);
        setLikesCount(likesCount);
      }
    } catch {
      // Rollback
      setHasLiked(hasLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const initialLetter = report.author?.name ? report.author.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/60 shadow-xs flex flex-col gap-4">
      {/* Header: Profil Amil & Waktu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 sm:size-12 rounded-full bg-primary-container/15 text-primary flex items-center justify-center font-bold text-base sm:text-lg shrink-0 border border-primary/20 shadow-xs">
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
            <div className="flex items-center gap-2 mt-0.5">
              {report.author?.position && (
                <span className="text-[11px] text-outline font-medium">
                  {report.author.position} •
                </span>
              )}
              <span className="text-[11px] text-outline font-mono">
                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                •{" "}
                {new Date(report.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold font-mono text-secondary px-2 py-0.5 rounded-md bg-secondary/10">
            Aktivitas
          </span>
        </div>
      </div>

      {/* Title jika ada */}
      {report.title && (
        <h3 className="text-sm sm:text-base font-bold text-on-surface">
          {report.title}
        </h3>
      )}

      {/* Konten: Apa yang Dikerjakan (Dynamic Height) */}
      <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
        {report.tasks}
      </div>

      {/* Lampiran Foto Kegiatan jika ada */}
      {report.attachments && report.attachments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {report.attachments.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-video rounded-xl overflow-hidden border border-outline-variant/60 group block bg-surface-container"
            >
              <Image
                src={url}
                alt={`Dokumentasi ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </a>
          ))}
        </div>
      )}

      <Separator className="bg-surface-container" />

      {/* Footer Bar: Interaksi Sosial & Tombol Balik Kartu */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Tombol Like / Apresiasi ala IG */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
              hasLiked
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-outline-variant/60"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[17px] ${
                hasLiked ? "text-rose-500" : "text-outline"
              }`}
              style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            <span>{likesCount}</span>
            <span className="hidden sm:inline">Apresiasi</span>
          </button>

          {/* Tombol Toggle Komentar */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
              showComments
                ? "bg-secondary/10 text-secondary border border-secondary/30"
                : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-outline-variant/60"
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-outline">
              chat_bubble
            </span>
            <span>{commentsCount}</span>
            <span className="hidden sm:inline">Komentar</span>
          </button>
        </div>

        {/* Tombol Balik Kartu: Lihat Hasil */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onFlipToBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-secondary/40 text-secondary hover:bg-secondary/10 hover:text-secondary text-xs font-semibold h-auto cursor-pointer shrink-0 transition-transform active:scale-95 shadow-2xs"
        >
          <span>Lihat Hasil</span>
          <span className="material-symbols-outlined text-[16px]">sync_alt</span>
        </Button>
      </div>

      {/* Bagian Komentar Terbuka */}
      {showComments && (
        <FeedCommentSection
          reportId={report.id}
          initialComments={report.comments}
          currentUser={currentUser}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
