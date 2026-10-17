"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FeedMediaCarousel from "./feed-media-carousel";
import FeedResultPanel from "./feed-result-panel";
import FeedCommentSection from "./feed-comment-section";
import { toggleAppreciationAction } from "../index";
import { ParsedFeedReport } from "../use-cases/get-feed-reports.use-case";

interface FeedCardProps {
  report: ParsedFeedReport;
  currentUser?: {
    id: string;
    name: string;
    division: string;
  } | null;
}

export default function FeedCard({ report, currentUser }: FeedCardProps) {
  const [hasLiked, setHasLiked] = useState(report.hasLiked);
  const [likesCount, setLikesCount] = useState(report.appreciationsCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [commentsCount, setCommentsCount] = useState(report.commentsCount);

  const handleToggleLike = async () => {
    if (isLiking) return;

    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setHasLiked(nextLiked);
    setLikesCount(nextCount);
    setIsLiking(true);

    try {
      const res = await toggleAppreciationAction({ reportId: report.id });
      if (!res.success) {
        setHasLiked(hasLiked);
        setLikesCount(likesCount);
      }
    } catch {
      setHasLiked(hasLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const initialLetter = report.author?.name
    ? report.author.name.charAt(0).toUpperCase()
    : "A";

  const formattedDate = new Date(report.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = new Date(report.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden flex flex-col gap-3.5 p-4 sm:p-5 transition-shadow hover:shadow-sm">
      {/* 1. Header Postingan: Profil Amil + Tombol Lihat Hasil */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/25 shadow-2xs">
            {initialLetter}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-on-surface truncate leading-tight">
              {report.author?.name || "Amil LAZ Persis"}
            </span>
            <span className="text-[11px] text-on-surface-variant truncate">
              {report.division || "LAZ Persis"} • {formattedDate}, {formattedTime} WIB
            </span>
          </div>
        </div>

        {/* Tombol Lihat Hasil / Capaian Output */}
        <Button
          type="button"
          size="sm"
          variant={showResult ? "secondary" : "outline"}
          onClick={() => setShowResult(!showResult)}
          className={`h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
            showResult
              ? "bg-secondary text-white hover:bg-secondary/90 shadow-2xs"
              : "border-secondary/40 text-secondary hover:bg-secondary/10"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {showResult ? "photo" : "assignment_turned_in"}
          </span>
          <span>{showResult ? "Lihat Foto" : "Lihat Hasil"}</span>
        </Button>
      </div>

      {/* 2. Isi Tugas & Aktivitas Pelaporan */}
      <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
        {report.title && (
          <span className="font-semibold text-secondary mr-1.5">
            [{report.title}]
          </span>
        )}
        <span>{report.tasks}</span>
      </div>

      {/* 3. Media Foto / Panel Rincian Hasil */}
      <div className="w-full">
        {showResult ? (
          <FeedResultPanel
            results={report.results}
            title={report.title}
            authorName={report.author?.name}
            onClose={() => setShowResult(false)}
          />
        ) : (
          <FeedMediaCarousel
            attachments={report.attachments || []}
            authorName={report.author?.name}
          />
        )}
      </div>

      {/* 4. Action Bar (Like Apresiasi & Total Komentar) */}
      <div className="flex items-center gap-4 pt-1">
        {/* Tombol Like ala Instagram */}
        <button
          type="button"
          onClick={handleToggleLike}
          aria-label={hasLiked ? "Batal suka" : "Beri suka"}
          className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none group transition-transform active:scale-90"
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-colors ${
              hasLiked
                ? "text-rose-500"
                : "text-outline group-hover:text-rose-500"
            }`}
            style={{
              fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
          <span
            className={`font-semibold ${
              hasLiked ? "text-rose-500" : "text-on-surface"
            }`}
          >
            {likesCount} suka
          </span>
        </button>

        {/* Counter Komentar */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface select-none">
          <span className="material-symbols-outlined text-[22px] text-outline">
            chat_bubble
          </span>
          <span>{commentsCount} komentar</span>
        </div>
      </div>

      {/* 5. Bagian Komentar Inline & Form Input (Instagram Web) */}
      <FeedCommentSection
        reportId={report.id}
        initialComments={report.comments}
        currentUser={currentUser}
        onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
      />
    </article>
  );
}
