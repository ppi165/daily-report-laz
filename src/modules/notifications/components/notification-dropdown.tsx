"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/src/common/components/user-avatar";
import { toast } from "@/components/ui/toast";
import { scrollToAndHighlightElement } from "@/src/common/utils/scroll-to-element";
import { NotificationItem, NotificationType } from "../types/notification.types";
import { getNotificationsAction } from "../actions/get-notifications.action";
import { markNotificationAsReadAction } from "../actions/mark-as-read.action";
import { markAllNotificationsAsReadAction } from "../actions/mark-all-as-read.action";
import { clearReadNotificationsAction } from "../actions/clear-read-notifications.action";
import { deleteNotificationAction } from "../actions/delete-notification.action";

export default function NotificationDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, startTransition] = useTransition();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getNotificationsAction();
      if (res.success && res.data) {
        setNotifications(res.data.notifications as NotificationItem[]);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // 1. Muat notifikasi saat mount
    fetchNotifications();

    // 2. Polling efisien setiap 45 detik
    const interval = setInterval(() => {
      fetchNotifications();
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      fetchNotifications();
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Server update
      markNotificationAsReadAction({ notificationId: item.id }).catch(() => {});
    }

    setOpen(false);

    if (item.link) {
      // Smooth scroll dan highlight jika sudah berada di halaman target
      if (item.link.includes("#")) {
        const [targetPath, hash] = item.link.split("#");
        if (window.location.pathname === targetPath) {
          scrollToAndHighlightElement(hash);
          window.history.replaceState(null, "", item.link);
          return;
        }
      }

      startTransition(() => {
        router.push(item.link!);
      });
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const previousNotifications = [...notifications];
    const previousUnread = unreadCount;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      const res = await markAllNotificationsAsReadAction();
      if (!res.success) {
        setNotifications(previousNotifications);
        setUnreadCount(previousUnread);
        toast.error(res.message || "Gagal menandai semua telah dibaca");
      }
    } catch {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnread);
      toast.error("Terjadi kesalahan saat menandai semua telah dibaca");
    }
  };

  const handleClearRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const previousNotifications = [...notifications];
    // Optimistic update: hanya menghapus notifikasi yang isRead === true
    setNotifications((prev) => prev.filter((n) => !n.isRead));

    try {
      const res = await clearReadNotificationsAction();
      if (!res.success) {
        setNotifications(previousNotifications);
        toast.error(res.message || "Gagal membersihkan notifikasi");
      }
    } catch {
      setNotifications(previousNotifications);
      toast.error("Terjadi kesalahan jaringan saat membersihkan notifikasi");
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const previousNotifications = [...notifications];
    // Hanya berlaku untuk yang sudah dibaca
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      const res = await deleteNotificationAction({ notificationId: id });
      if (!res.success) {
        setNotifications(previousNotifications);
        toast.error(res.message || "Gagal menghapus notifikasi");
      }
    } catch {
      setNotifications(previousNotifications);
      toast.error("Terjadi kesalahan jaringan saat menghapus notifikasi");
    }
  };

  const readCount = notifications.filter((n) => n.isRead).length;
  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const getTypeIcon = (type: NotificationType, item?: NotificationItem) => {
    switch (type) {
      case "APPRECIATION":
        return {
          icon: "favorite",
          color: "text-rose-500",
          bg: "bg-rose-500/15 border-rose-500/30",
        };
      case "PEER_REPORT":
        return {
          icon: "article",
          color: "text-secondary",
          bg: "bg-secondary/15 border-secondary/30",
        };
      case "APPROVAL_REQUEST":
        return {
          icon: "verified_user",
          color: "text-amber-500",
          bg: "bg-amber-500/15 border-amber-500/30",
        };
      case "APPROVAL_RESULT": {
        const isRejected =
          (item?.metadata as { status?: string } | null)?.status === "REJECTED" ||
          item?.title?.toLowerCase().includes("ditolak");
        if (isRejected) {
          return {
            icon: "cancel",
            color: "text-rose-500",
            bg: "bg-rose-500/15 border-rose-500/30",
          };
        }
        return {
          icon: "assignment_turned_in",
          color: "text-emerald-500",
          bg: "bg-emerald-500/15 border-emerald-500/30",
        };
      }
      case "REMINDER":
        return {
          icon: "alarm",
          color: "text-amber-500",
          bg: "bg-amber-500/15 border-amber-500/30",
        };
      case "COMMENT":
        return {
          icon: "chat_bubble",
          color: "text-indigo-500",
          bg: "bg-indigo-500/15 border-indigo-500/30",
        };
      case "COMMENT_REPLY":
        return {
          icon: "reply",
          color: "text-purple-500",
          bg: "bg-purple-500/15 border-purple-500/30",
        };
      case "COMMENT_MENTION":
        return {
          icon: "alternate_email",
          color: "text-sky-500",
          bg: "bg-sky-500/15 border-sky-500/30",
        };
      default:
        return {
          icon: "notifications",
          color: "text-primary",
          bg: "bg-primary/15 border-primary/30",
        };
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffMin < 1) return "Baru saja";
      if (diffMin < 60) return `${diffMin} mnt lalu`;
      if (diffHour < 24) return `${diffHour} jam lalu`;
      if (diffDay < 7) return `${diffDay} hari lalu`;
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors duration-150 flex items-center justify-center cursor-pointer focus:outline-none"
        aria-label="Notifikasi"
      >
        <span className="material-symbols-outlined text-[22px]">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none animate-in zoom-in duration-150 shadow-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[calc(100vw-1.5rem)] max-w-[390px] sm:w-[400px] p-0 bg-surface border-outline-variant/60 rounded-2xl shadow-2xl text-on-surface overflow-hidden z-50"
      >
        {/* Header Dropdown */}
        <div className="p-3.5 pb-2.5 border-b border-outline-variant/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-on-surface tracking-tight">
              Notifikasi
            </span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {unreadCount} baru
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Tombol Tandai Semua Telah Dibaca */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-secondary hover:text-secondary-focus transition-colors flex items-center gap-1 cursor-pointer px-1.5 py-1 rounded hover:bg-secondary/10"
                title="Tandai semua notifikasi telah dibaca"
              >
                <span className="material-symbols-outlined text-[15px]">
                  done_all
                </span>
                <span>Tandai Dibaca</span>
              </button>
            )}

            {/* Tombol Bersihkan Hanya Yang Sudah Dibaca */}
            {readCount > 0 && (
              <button
                type="button"
                onClick={handleClearRead}
                className="text-[11px] font-semibold text-outline hover:text-error transition-colors flex items-center gap-1 cursor-pointer px-1.5 py-1 rounded hover:bg-error/10"
                title="Bersihkan hanya notifikasi yang sudah dibaca"
              >
                <span className="material-symbols-outlined text-[15px]">
                  cleaning_services
                </span>
                <span>Bersihkan ({readCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Filter */}
        <div className="px-3.5 pt-2 pb-1.5 flex items-center gap-2 border-b border-outline-variant/30 bg-surface-container-lowest/50">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-secondary text-white font-semibold shadow-xs"
                : "text-outline hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            Semua ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "unread"
                ? "bg-secondary text-white font-semibold shadow-xs"
                : "text-outline hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        {/* List Notifikasi */}
        <div className="max-h-[380px] overflow-y-auto overscroll-contain w-full">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2 text-outline">
              <span className="material-symbols-outlined text-[36px] opacity-40">
                notifications_paused
              </span>
              <p className="text-xs font-medium">
                {filter === "unread"
                  ? "Semua notifikasi penting telah dibaca"
                  : "Belum ada notifikasi untuk Anda"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/30">
              {filteredNotifications.map((item) => {
                const iconInfo = getTypeIcon(item.type, item);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 group relative ${
                      !item.isRead
                        ? "bg-secondary/5 hover:bg-secondary/10"
                        : "hover:bg-surface-container-highest/40 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Icon atau Avatar */}
                    <div className="relative shrink-0 mt-0.5">
                      {item.actor ? (
                        <UserAvatar
                          name={item.actor.name}
                          avatarUrl={item.actor.avatar}
                          size="sm"
                        />
                      ) : (
                        <div
                          className={`size-8 rounded-xl flex items-center justify-center border ${iconInfo.bg} ${iconInfo.color}`}
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            {iconInfo.icon}
                          </span>
                        </div>
                      )}

                      {/* Mini Badge Icon jika menggunakan Avatar */}
                      {item.actor && (
                        <div
                          className={`absolute -bottom-1 -right-1 size-4 rounded-full flex items-center justify-center bg-surface border border-outline-variant shadow-xs ${iconInfo.color} overflow-hidden`}
                        >
                          <span className="material-symbols-outlined text-[10px] leading-none shrink-0">
                            {iconInfo.icon}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Konten Notifikasi */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-bold text-on-surface">
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="size-1.5 rounded-full bg-secondary shrink-0"></span>
                        )}
                      </div>

                      <p
                        className={`text-xs leading-snug line-clamp-2 ${
                          !item.isRead
                            ? "text-on-surface font-medium"
                            : "text-outline"
                        }`}
                      >
                        {item.message}
                      </p>

                      <span className="text-[10px] text-outline mt-1 block font-mono">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    {/* Tombol Hapus Satuan (Hanya jika sudah dibaca) */}
                    {item.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="absolute right-2.5 top-3.5 size-7 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error/10 transition-opacity opacity-70 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer touch-manipulation"
                        title="Hapus notifikasi ini"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          close
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
