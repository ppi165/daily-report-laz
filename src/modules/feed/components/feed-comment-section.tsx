"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCommentAction } from "../index";

export interface CommentItem {
  id: string;
  content: string;
  parentId?: string | null;
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
  const [replyingTo, setReplyingTo] = useState<{
    rootId: string;
    authorName: string;
  } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const inputRef = useRef<HTMLInputElement>(null);

  // Pisahkan komentar utama (root) dan peta balasan (repliesMap)
  const rootComments: CommentItem[] = [];
  const repliesMap: Record<string, CommentItem[]> = {};

  // Build index untuk mencari root parent
  for (const c of comments) {
    if (!c.parentId) {
      rootComments.push(c);
    } else {
      if (!repliesMap[c.parentId]) {
        repliesMap[c.parentId] = [];
      }
      repliesMap[c.parentId].push(c);
    }
  }

  const toggleReplies = (rootId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [rootId]: !prev[rootId],
    }));
  };

  const handleStartReply = (rootId: string, authorName: string) => {
    setReplyingTo({ rootId, authorName });
    // Buka balasan dari thread ini otomatis jika belum terbuka
    setExpandedReplies((prev) => ({ ...prev, [rootId]: true }));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || submitting) return;

    const content = newText.trim();
    const parentId = replyingTo ? replyingTo.rootId : null;

    setNewText("");
    setReplyingTo(null);
    setSubmitting(true);

    // Optimistic comment
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentItem = {
      id: tempId,
      content,
      parentId,
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
    if (parentId) {
      setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
    }

    try {
      const res = await addCommentAction({
        reportId,
        content,
        parentId,
      });

      if (res.success && res.data) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? (res.data as CommentItem) : c))
        );
        onCommentAdded?.();
      } else {
        // Rollback
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

  const displayedRootComments = showAll ? rootComments : rootComments.slice(-2);
  const userInitial = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : "S";

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      {/* Toggle lihat semua komentar jika komentar utama > 2 */}
      {rootComments.length > 2 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-outline hover:text-on-surface font-medium text-left cursor-pointer transition-colors"
        >
          {showAll
            ? "Sembunyikan sebagian komentar"
            : `Lihat semua ${rootComments.length} diskusi komentar`}
        </button>
      )}

      {/* List Komentar Utama */}
      {rootComments.length > 0 && (
        <div
          className={`flex flex-col gap-3 ${
            showAll ? "max-h-72 overflow-y-auto pr-1" : ""
          }`}
        >
          {displayedRootComments.map((comment) => {
            const replies = repliesMap[comment.id] || [];
            const isRepliesExpanded = !!expandedReplies[comment.id];

            return (
              <div key={comment.id} className="flex flex-col gap-1.5">
                {/* Baris Komentar Induk */}
                <div className="text-xs leading-relaxed flex items-start justify-between gap-2">
                  <div className="text-on-surface break-words">
                    <span className="font-bold text-on-surface mr-1.5 inline-block">
                      {comment.user?.name || "Amil"}
                    </span>
                    <span className="text-on-surface-variant whitespace-pre-wrap">
                      {comment.content}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-[10px] text-outline font-mono">
                      {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleStartReply(comment.id, comment.user?.name || "Amil")
                      }
                      className="text-[11px] font-semibold text-secondary hover:text-primary cursor-pointer transition-colors"
                    >
                      Balas
                    </button>
                  </div>
                </div>

                {/* Toggle & Thread Balasan Komentar (Instagram Web Style) */}
                {replies.length > 0 && (
                  <div className="ml-5 sm:ml-6 flex flex-col gap-1.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleReplies(comment.id)}
                      className="text-[11px] text-outline hover:text-secondary font-semibold flex items-center gap-1.5 text-left cursor-pointer transition-colors py-0.5"
                    >
                      <span className="w-5 h-[1px] bg-outline-variant" />
                      <span>
                        {isRepliesExpanded
                          ? "Sembunyikan balasan"
                          : `Lihat ${replies.length} balasan`}
                      </span>
                    </button>

                    {isRepliesExpanded && (
                      <div className="pl-3 border-l-2 border-outline-variant/50 flex flex-col gap-2 pt-1 animate-in fade-in-50 duration-150">
                        {replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="text-xs leading-relaxed flex items-start justify-between gap-2"
                          >
                            <div className="text-on-surface break-words">
                              <span className="font-bold text-on-surface mr-1.5 inline-block">
                                {reply.user?.name || "Amil"}
                              </span>
                              <span className="text-on-surface-variant whitespace-pre-wrap">
                                {reply.content}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                              <span className="text-[10px] text-outline font-mono">
                                {new Date(reply.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartReply(
                                    comment.id,
                                    reply.user?.name || "Amil"
                                  )
                                }
                                className="text-[11px] font-semibold text-secondary hover:text-primary cursor-pointer transition-colors"
                              >
                                Balas
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Banner Membalas Komentar */}
      {replyingTo && (
        <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-secondary/10 border border-secondary/20 text-xs text-secondary mt-1">
          <span className="font-medium">
            Membalas @{replyingTo.authorName}
          </span>
          <button
            type="button"
            onClick={handleCancelReply}
            className="text-xs font-semibold text-secondary hover:text-primary cursor-pointer p-0.5 hover:underline"
            aria-label="Batalkan balasan"
          >
            Batal
          </button>
        </div>
      )}

      {/* Form Input Komentar Inline (Instagram Web Style) */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-2 border-t border-outline-variant/50"
      >
        <div className="size-7 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-[11px] shrink-0 border border-outline-variant/60">
          {userInitial}
        </div>

        <Input
          ref={inputRef}
          placeholder={
            replyingTo
              ? `Balas komentar @${replyingTo.authorName}...`
              : "Tambahkan komentar..."
          }
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
