"use client";

import { useState } from "react";
import FeedMediaCarousel from "./feed-media-carousel";
import FeedResultPanel from "./feed-result-panel";
import FeedCommentSection from "./feed-comment-section";
import UserAvatar from "@/src/common/components/user-avatar";
import { toast } from "@/components/ui/toast";
import { toggleAppreciationAction } from "../index";
import { ParsedFeedReport } from "../use-cases/get-feed-reports.use-case";

interface FeedCardProps {
  report: ParsedFeedReport;
  currentUser?: {
    id: string;
    name: string;
    division: string;
    role?: string;
    avatar?: string | null;
  } | null;
}

export default function FeedCard({ report, currentUser }: FeedCardProps) {
  const [hasLiked, setHasLiked] = useState(report.hasLiked);
  const [likesCount, setLikesCount] = useState(report.appreciationsCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [commentsCount, setCommentsCount] = useState(report.commentsCount);

  // Akses informasi audit verifikasi Clock-in (Khusus Superadmin, Admin, dan Pengaju sendiri)
  const isAdminOrSuperadmin =
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN" ||
    currentUser?.role === "SUPER_ADMIN";
  const isAuthor = Boolean(
    currentUser?.id && report.author?.id && currentUser.id === report.author.id
  );
  const canSeeClockInAudit =
    (isAdminOrSuperadmin || isAuthor) && Boolean(report.isClockIn);

  const approvedVerifiers = (report.approvals || [])
    .filter((a) => a.status === "APPROVED")
    .map((a) => a.approverName);

  const handleToggleLike = async () => {
    if (isAuthor) {
      toast.warning("Anda tidak dapat menyukai laporan Anda sendiri.");
      return;
    }

    if (isLiking) return;

    const previousLiked = hasLiked;
    const previousCount = likesCount;

    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setHasLiked(nextLiked);
    setLikesCount(nextCount);
    setIsLiking(true);

    try {
      const res = await toggleAppreciationAction({ reportId: report.id });
      if (res.success) {
        if (typeof res.likesCount === "number") {
          setLikesCount(res.likesCount);
        }
      } else {
        setHasLiked(previousLiked);
        setLikesCount(previousCount);
        toast.error(res.message || "Gagal memproses apresiasi");
      }
    } catch {
      setHasLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Terjadi gangguan jaringan saat memproses apresiasi.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDoubleTapLike = () => {
    if (isAuthor) {
      toast.warning("Anda tidak dapat menyukai laporan Anda sendiri.");
      return;
    }
    if (!hasLiked) {
      handleToggleLike();
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
    <article
      id={`report-${report.id}`}
      className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-xs overflow-hidden flex flex-col gap-3.5 p-4 sm:p-5 transition-shadow hover:shadow-sm scroll-mt-20"
    >
      {/* 1. Header Postingan: Profil Amil + Tombol Lihat Hasil */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar
            name={report.author?.name}
            avatarUrl={report.author?.avatar}
            size="lg"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-on-surface truncate leading-tight">
              {report.author?.name || "Amil LAZ Persis"}
            </span>
            <span className="text-[11px] text-on-surface-variant truncate">
              {report.division || "LAZ Persis"} • {formattedDate}, {formattedTime} WIB
            </span>
          </div>
        </div>

        {/* Tombol Lihat Hasil: Hanya teks berwarna tanpa border kapsul & tanpa ikon */}
        <button
          type="button"
          onClick={() => setShowResult(!showResult)}
          className="text-xs font-semibold text-secondary hover:text-primary hover:underline cursor-pointer transition-colors px-1 py-0.5 shrink-0"
        >
          {showResult ? "Lihat Foto" : "Lihat Hasil"}
        </button>
      </div>

      {/* Banner Informasi Clock-in Disetujui (Transparan untuk Admin, Superadmin, dan Pengaju) */}
      {canSeeClockInAudit && approvedVerifiers.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500">
          <span className="material-symbols-outlined text-[17px] text-amber-500 shrink-0">
            verified
          </span>
          <div className="flex items-center gap-1.5 flex-wrap leading-tight">
            <span className="font-bold text-amber-400">Clock-in Disetujui</span>
            <span className="text-outline/60">•</span>
            <span className="text-on-surface-variant">
              Saksi: <strong className="text-on-surface font-semibold">{approvedVerifiers.join(", ")}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 2. Isi Tugas & Aktivitas Pelaporan */}
      <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans m-0">
        {report.tasks}
      </p>

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
            onDoubleTapLike={handleDoubleTapLike}
            isAuthor={isAuthor}
          />
        )}
      </div>

      {/* 4. Action Bar (Like Apresiasi & Total Komentar) */}
      <div className="flex items-center gap-4 pt-1">
        {/* Tombol Like ala Instagram */}
        <button
          type="button"
          onClick={handleToggleLike}
          aria-label={
            isAuthor
              ? "Laporan Anda sendiri"
              : hasLiked
              ? "Batal suka"
              : "Beri suka"
          }
          title={
            isAuthor
              ? "Anda tidak dapat menyukai laporan Anda sendiri"
              : hasLiked
              ? "Batal suka"
              : "Beri suka"
          }
          className={`flex items-center gap-1.5 text-xs font-semibold select-none group transition-transform ${
            isAuthor
              ? "opacity-75 cursor-default"
              : "cursor-pointer active:scale-90"
          }`}
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
        onCommentDeleted={(count = 1) => setCommentsCount((prev) => Math.max(0, prev - count))}
      />
    </article>
  );
}
