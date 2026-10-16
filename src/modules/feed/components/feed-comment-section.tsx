"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCommentAction } from "../index";

interface CommentItem {
  id: string;
  content: string;
  createdAt: Date;
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

  return (
    <div className="pt-3 border-t border-surface-container flex flex-col gap-3">
      {/* Daftar Komentar */}
      <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-outline italic py-2 text-center">
            Belum ada komentar. Berikan apresiasi atau catatan positif pertama!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-surface-container-low/60 rounded-xl p-2.5 sm:p-3 text-xs flex flex-col gap-1 border border-outline-variant/30"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-on-surface">
                    {comment.user?.name || "Amil"}
                  </span>
                  <span className="text-[11px] font-semibold text-secondary">
                    • {comment.user?.division || "LAZ Persis"}
                  </span>
                </div>
                <span className="text-[10px] text-outline font-mono">
                  {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Komentar Baru */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Tulis apresiasi atau tanggapan..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          disabled={submitting}
          className="text-xs sm:text-sm h-9 bg-surface-container-low/50 border-outline-variant focus-visible:ring-secondary/20"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!newText.trim() || submitting}
          className="h-9 px-3 bg-primary-container hover:bg-secondary text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
        </Button>
      </form>
    </div>
  );
}
