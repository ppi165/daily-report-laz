"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/src/common/components/user-avatar";
import { getMentionUsersAction, MentionUserItem } from "@/src/modules/users";
import {
  addCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "../index";

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
    avatar?: string | null;
  };
}

interface FeedCommentSectionProps {
  reportId: string;
  initialComments: CommentItem[];
  currentUser?: {
    id: string;
    name: string;
    division: string;
    role?: string;
    avatar?: string | null;
  } | null;
  onCommentAdded?: () => void;
  onCommentDeleted?: (count?: number) => void;
}

// Module-level cache agar seluruh kartu feed tidak fetch ulang daftar amil
let cachedMentionUsers: MentionUserItem[] | null = null;
let mentionUsersPromise: Promise<MentionUserItem[]> | null = null;

async function fetchMentionUsers(): Promise<MentionUserItem[]> {
  if (cachedMentionUsers) return cachedMentionUsers;
  if (!mentionUsersPromise) {
    mentionUsersPromise = getMentionUsersAction().then((res) => {
      if (res.success && res.data) {
        cachedMentionUsers = res.data;
        return res.data;
      }
      return [];
    });
  }
  return mentionUsersPromise;
}

export default function FeedCommentSection({
  reportId,
  initialComments,
  currentUser,
  onCommentAdded,
  onCommentDeleted,
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

  // Inline Mention Autocomplete State
  const [mentionUsers, setMentionUsers] = useState<MentionUserItem[]>([]);
  const [mentionActive, setMentionActive] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Edit Comment State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);

  // Load daftar amil untuk fitur mention
  useEffect(() => {
    fetchMentionUsers().then((users) => {
      setMentionUsers(users);
    });
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setMentionActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pisahkan komentar utama (root) dan peta balasan (repliesMap)
  const rootComments: CommentItem[] = [];
  const repliesMap: Record<string, CommentItem[]> = {};

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

  // Filter daftar amil sesuai query inline mention
  const filteredMentionUsers = useMemo(() => {
    if (!mentionActive) return [];
    const q = mentionQuery.trim().toLowerCase();
    if (!q) return mentionUsers;
    return mentionUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.division.toLowerCase().includes(q)
    );
  }, [mentionActive, mentionQuery, mentionUsers]);

  // Cek pemicu karakter @ pada posisi kursor
  const checkMentionTrigger = (text: string, cursorPos: number) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf("@");

    if (atIndex !== -1) {
      const isPrecededByValidChar =
        atIndex === 0 || /\s|[.,!?;:(]/.test(textBeforeCursor[atIndex - 1]);

      if (isPrecededByValidChar) {
        const query = textBeforeCursor.slice(atIndex + 1);
        if (!/[\n\r\t]/.test(query) && query.length <= 30) {
          setMentionActive(true);
          setMentionQuery(query);
          setMentionStartIndex(atIndex);
          setHighlightedIndex(0);
          return;
        }
      }
    }

    setMentionActive(false);
    setMentionQuery("");
    setMentionStartIndex(-1);
  };

  // Pilih amil dari pop-up mention
  const handleSelectMentionUser = (user: MentionUserItem) => {
    const text = newText;
    const cursorPos = inputRef.current?.selectionStart ?? text.length;

    const textBeforeAt = text.slice(0, mentionStartIndex);
    const textAfterCursor = text.slice(cursorPos);
    const insertedTag = `@${user.name} `;
    const updated = `${textBeforeAt}${insertedTag}${textAfterCursor}`;

    setNewText(updated);
    setMentionActive(false);
    setMentionQuery("");

    const newPos = mentionStartIndex + insertedTag.length;
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 10);
  };

  // Navigasi keyboard pada pop-up mention
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mentionActive && filteredMentionUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredMentionUsers.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + filteredMentionUsers.length) % filteredMentionUsers.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selected = filteredMentionUsers[highlightedIndex];
        if (selected) {
          handleSelectMentionUser(selected);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionActive(false);
        return;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart ?? val.length;
    setNewText(val);
    checkMentionTrigger(val, pos);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const pos = e.currentTarget.selectionStart ?? newText.length;
    checkMentionTrigger(newText, pos);
  };

  const toggleReplies = (rootId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [rootId]: !prev[rootId],
    }));
  };

  const handleStartReply = (rootId: string, authorName: string) => {
    setReplyingTo({ rootId, authorName });
    const tag = `@${authorName.trim()} `;
    setNewText((prev) => (prev.includes(tag) ? prev : `${tag}${prev}`));
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleStartEdit = (comment: CommentItem) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (commentId: string) => {
    const content = editingText.trim();
    if (!content || isSavingEdit) return;

    setIsSavingEdit(true);

    // Optimistic update
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content } : c))
    );
    setEditingCommentId(null);

    try {
      const res = await updateCommentAction({
        commentId,
        content,
      });

      if (!res.success) {
        alert(res.message || "Gagal memperbarui komentar.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat mengedit komentar.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteComment = async (comment: CommentItem) => {
    const isRoot = !comment.parentId;
    const repliesCount = repliesMap[comment.id]?.length || 0;
    const confirmMsg =
      isRoot && repliesCount > 0
        ? `Hapus komentar ini beserta ${repliesCount} balasan di dalamnya?`
        : "Apakah Anda yakin ingin menghapus komentar ini?";

    if (!window.confirm(confirmMsg)) return;

    const previousComments = [...comments];
    const totalRemoved = 1 + (isRoot ? repliesCount : 0);

    // Optimistic remove
    setComments((prev) =>
      prev.filter((c) => c.id !== comment.id && c.parentId !== comment.id)
    );
    onCommentDeleted?.(totalRemoved);

    try {
      const res = await deleteCommentAction({ commentId: comment.id });
      if (!res.success) {
        setComments(previousComments);
        onCommentAdded?.();
        alert(res.message || "Gagal menghapus komentar.");
      }
    } catch {
      setComments(previousComments);
      onCommentAdded?.();
      alert("Terjadi kesalahan jaringan saat menghapus komentar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || submitting) return;

    const content = newText.trim();
    const parentId = replyingTo ? replyingTo.rootId : null;

    setNewText("");
    setReplyingTo(null);
    setMentionActive(false);
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
        role: currentUser?.role || "STAFF",
        position: null,
        avatar: currentUser?.avatar,
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

  // Render teks komentar dengan highlight pada mention @Nama atau @username
  const renderContentWithMentions = (content: string) => {
    const knownNames = mentionUsers
      .map((u) => u.name)
      .concat(mentionUsers.map((u) => u.username))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    let pattern: RegExp;
    if (knownNames.length > 0) {
      const escaped = knownNames.map((n) =>
        n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      );
      pattern = new RegExp(`(@(?:${escaped.join("|")})|@[a-zA-Z0-9_.-]+)`, "gi");
    } else {
      pattern = /(@[a-zA-Z0-9_.-]+)/g;
    }

    const parts = content.split(pattern);
    return parts.map((part, idx) => {
      if (part.startsWith("@") && part.length > 1) {
        return (
          <span
            key={idx}
            className="font-semibold text-secondary hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderCommentRow = (comment: CommentItem, isReply: boolean = false, rootId?: string) => {
    const isOwner = currentUser?.id === comment.user?.id;
    const isModerator =
      currentUser?.role === "SUPERADMIN" || currentUser?.role === "ADMIN";
    const isEditing = editingCommentId === comment.id;

    return (
      <div className="text-xs leading-relaxed flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <UserAvatar
            name={comment.user?.name}
            avatarUrl={comment.user?.avatar}
            size="xs"
            className="mt-0.5"
          />
          <div className="text-on-surface break-words flex-1 min-w-0">
            <span className="font-bold text-on-surface mr-1.5 inline-block">
              {comment.user?.name || "Amil"}
            </span>

            {isEditing ? (
              <div className="flex flex-col gap-1.5 w-full mt-1">
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="h-8 text-xs bg-surface-container-high border border-outline-variant/60 text-on-surface rounded-lg"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveEdit(comment.id);
                    } else if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-[11px] text-outline hover:text-on-surface cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(comment.id)}
                    disabled={!editingText.trim() || isSavingEdit}
                    className="text-[11px] font-bold text-secondary hover:text-primary cursor-pointer disabled:opacity-40"
                  >
                    {isSavingEdit ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-on-surface-variant whitespace-pre-wrap">
                {renderContentWithMentions(comment.content)}
              </span>
            )}
          </div>
        </div>

        {!isEditing && (
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
                handleStartReply(
                  rootId || comment.id,
                  comment.user?.name || "Amil"
                )
              }
              className="text-[11px] font-semibold text-secondary hover:text-primary cursor-pointer transition-colors"
            >
              Balas
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={() => handleStartEdit(comment)}
                className="text-[11px] font-medium text-outline hover:text-on-surface cursor-pointer transition-colors"
              >
                Edit
              </button>
            )}
            {(isOwner || isModerator) && (
              <button
                type="button"
                onClick={() => handleDeleteComment(comment)}
                className="text-[11px] font-medium text-outline hover:text-rose-500 cursor-pointer transition-colors"
              >
                Hapus
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const MAX_PREVIEW_COMMENTS = 4;
  const hasMoreComments = rootComments.length > MAX_PREVIEW_COMMENTS;
  const displayedRootComments = showAll
    ? rootComments
    : rootComments.slice(-MAX_PREVIEW_COMMENTS);

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      {/* Toggle lihat komentar lengkap jika komentar utama > 4 */}
      {hasMoreComments && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-outline hover:text-secondary font-semibold text-left cursor-pointer transition-colors py-0.5"
        >
          {showAll
            ? "Sembunyikan komentar tambahan"
            : `Lihat komentar lengkap (${rootComments.length})`}
        </button>
      )}

      {/* List Komentar Utama */}
      {rootComments.length > 0 && (
        <div
          className={`flex flex-col gap-3 ${
            showAll ? "max-h-80 overflow-y-auto pr-1" : ""
          }`}
        >
          {displayedRootComments.map((comment) => {
            const replies = repliesMap[comment.id] || [];
            const isRepliesExpanded = !!expandedReplies[comment.id];

            return (
              <div key={comment.id} className="flex flex-col gap-1.5">
                {/* Baris Komentar Induk */}
                {renderCommentRow(comment, false, comment.id)}

                {/* Toggle & Thread Balasan Komentar (Instagram Web Style) */}
                {replies.length > 0 && (
                  <div className="ml-8 sm:ml-9 flex flex-col gap-1.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleReplies(comment.id)}
                      className="text-[11px] text-outline hover:text-secondary font-medium flex items-center gap-2 text-left cursor-pointer transition-colors py-1 group select-none"
                    >
                      <span className="w-6 h-[1.5px] bg-outline-variant group-hover:bg-secondary/60 transition-colors" />
                      <span>
                        {isRepliesExpanded
                          ? "Sembunyikan balasan"
                          : `Tampilkan balasan (${replies.length})`}
                      </span>
                    </button>

                    {isRepliesExpanded && (
                      <div className="pl-3.5 border-l-2 border-outline-variant/60 flex flex-col gap-2.5 pt-1 animate-in fade-in-50 duration-150">
                        {replies.map((reply) => (
                          <div key={reply.id}>
                            {renderCommentRow(reply, true, comment.id)}
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
        className="relative flex items-center gap-2 pt-2 border-t border-outline-variant/50"
      >
        {/* Pop-up Autocomplete Inline Mention (@) */}
        {mentionActive && filteredMentionUsers.length > 0 && (
          <div
            ref={mentionDropdownRef}
            className="absolute bottom-full mb-2 left-0 right-0 sm:left-9 sm:right-auto sm:w-80 max-h-56 overflow-y-auto bg-surface-container-lowest border border-outline-variant/80 rounded-xl shadow-2xl z-50 flex flex-col p-1.5 animate-in fade-in-50 zoom-in-95 duration-100"
          >
            <div className="px-2.5 py-1 text-[10px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/40 flex items-center justify-between">
              <span>Pilih Rekan Amil</span>
              <span className="text-[9px] font-normal lowercase text-outline">
                ↑↓ navigasi • enter/klik pilih
              </span>
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              {filteredMentionUsers.map((user, idx) => {
                const isSelected = idx === highlightedIndex;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectMentionUser(user);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-secondary/15 text-secondary"
                        : "hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <UserAvatar
                      name={user.name}
                      avatarUrl={user.avatar}
                      size="xs"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-outline truncate font-mono">
                        {user.division} • @{user.username}
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant shrink-0 uppercase">
                      {user.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <UserAvatar
          name={currentUser?.name}
          avatarUrl={currentUser?.avatar}
          size="sm"
        />

        <Input
          ref={inputRef}
          placeholder={
            replyingTo
              ? `Balas komentar @${replyingTo.authorName}...`
              : "Tambahkan komentar... (ketik @ untuk tag)"
          }
          value={newText}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          disabled={submitting}
          className="h-9 text-xs sm:text-sm bg-transparent border-0 focus-visible:ring-0 shadow-none px-1 placeholder:text-outline text-on-surface flex-1"
        />

        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={!newText.trim() || submitting}
          className="h-8 px-2 text-xs font-bold text-secondary hover:text-primary hover:bg-transparent disabled:opacity-30 cursor-pointer"
        >
          Kirim
        </Button>
      </form>
    </div>
  );
}
