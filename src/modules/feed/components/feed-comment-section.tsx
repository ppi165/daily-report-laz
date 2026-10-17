"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCommentAction } from "../index";

export interface CommentItem {
  id: string;
  content: string;
  createdAt: Date | string;
  user: {
    id: string;
    name: string;
    division: string;
    role: string;
    position: string | null;
  };
}

interface FeedCommentSectionProps {
  reportId: string;
  initialComments: CommentItem[];
  currentUser?: {
    id: string;
    name: string;
    division: string;
  } | null;
  onCommentAdded?: () => void;
}

export default function FeedCommentSection({
  reportId,
  initialComments,
  currentUser,
  onCommentAdded,
}: FeedCommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || submitting) return;

    const content = newText.trim();
    setNewText("");
    setSubmitting(true);

    // Optimistic comment
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentItem = {
      id: tempId,
      content,
      createdAt: new Date(),
      user: {
        id: currentUser?.id || "me",
        name: currentUser?.name || "Saya",
        division: currentUser?.division || "Amil",
        role: "STAFF",
        position: null,
      },
    };

    setComments((prev) => [...prev, optimisticComment]);

    try {
      const res = await addCommentAction({
        reportId,
        content,
      });

      if (res.success && res.data) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? (res.data as CommentItem) : c))
        );
        onCommentAdded?.();
      } else {
        // Rollback on failure
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        alert(res.message || "Gagal mengirim komentar.");
      }
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayedComments = showAll ? comments : comments.slice(-2);
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S";

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      {/* Daftar Komentar ala Instagram Web */}
      {comments.length > 2 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-outline hover:text-on-surface-variant font-medium text-left cursor-pointer transition-colors"
        >
          {showAll
            ? "Sembunyikan sebagian komentar"
            : `Lihat semua ${comments.length} komentar`}
        </button>
      )}

      {comments.length > 0 && (
        <div className={`flex flex-col gap-1.5 ${showAll ? "max-h-64 overflow-y-auto pr-1" : ""}`}>
          {displayedComments.map((comment) => (
            <div key={comment.id} className="text-xs leading-relaxed flex items-start justify-between gap-2">
              <div className="text-on-surface break-words">
                <span className="font-bold text-on-surface mr-1.5 inline-block">
                  {comment.user?.name || "Amil"}
                </span>
                <span className="text-on-surface-variant whitespace-pre-wrap">
                  {comment.content}
                </span>
              </div>
              <span className="text-[10px] text-outline font-mono shrink-0 whitespace-nowrap pt-0.5">
                {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Form Input Komentar Inline (Instagram Web Style) */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-2.5 mt-1 border-t border-outline-variant/50"
      >
        <div className="size-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-[11px] shrink-0 border border-outline-variant/60">
          {userInitial}
        </div>

        <Input
          placeholder="Tambahkan komentar..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          disabled={submitting}
          className="h-9 text-xs sm:text-sm bg-transparent border-0 focus-visible:ring-0 shadow-none px-1 placeholder:text-outline text-on-surface flex-1"
        />

        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={!newText.trim() || submitting}
          className="text-xs font-bold text-secondary hover:text-primary hover:bg-secondary/10 px-2.5 h-8 rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          Kirim
        </Button>
      </form>
    </div>
  );
}
