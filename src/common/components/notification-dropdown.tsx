"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export interface NotificationItem {
  id: string;
  type: "deadline" | "appreciation" | "announcement" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "deadline",
    title: "Pengingat Batas Pengisian Laporan",
    message: "Batas pengisian Daily Report hari ini berakhir pukul 17:00 WIB. Segera kirimkan laporan Anda.",
    time: "25 menit yang lalu",
    read: false,
    link: "/daily-report",
    icon: "alarm",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
  },
  {
    id: "notif-2",
    type: "appreciation",
    title: "Apresiasi Baru Diterima",
    message: "Siti Rahma (Program) mengapresiasi laporan: 'Finalisasi Desain Booklet Zakat Produktif'.",
    time: "2 jam yang lalu",
    read: false,
    link: "/rekap-report",
    icon: "thumb_up",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
  },
  {
    id: "notif-3",
    type: "announcement",
    title: "Koordinasi Amil Zakat Wilayah",
    message: "Rapat koordinasi evaluasi program penyaluran qurban akan diadakan besok pukul 09:00 WIB di Aula Utama.",
    time: "5 jam yang lalu",
    read: false,
    icon: "campaign",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
  },
  {
    id: "notif-4",
    type: "system",
    title: "Laporan Terverifikasi",
    message: "Daily Report Anda untuk hari Jumat, 25 Sep 2026 telah diverifikasi oleh koordinator bidang.",
    time: "1 hari yang lalu",
    read: true,
    link: "/rekap-report",
    icon: "verified",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors duration-150 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
        title="Buka Notifikasi"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[340px] sm:w-[380px] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3.5 border-b border-surface-container flex items-center justify-between bg-surface-container-low/40">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-on-surface">Notifikasi</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                  {unreadCount} baru
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium text-outline">
                  Semua terbaca
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-primary hover:text-secondary transition-colors cursor-pointer"
              >
                Tandai dibaca
              </button>
            )}
          </div>

          <div className="px-3 pt-2 pb-1 border-b border-surface-container/60 flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === "unread"
                  ? "bg-primary text-white shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-surface-container/40">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <span className="material-symbols-outlined text-[36px] text-outline mb-1 block">
                  notifications_paused
                </span>
                <p className="text-sm font-semibold text-on-surface">Tidak ada notifikasi</p>
                <p className="text-xs text-outline mt-0.5">
                  {filter === "unread"
                    ? "Semua notifikasi telah Anda baca."
                    : "Belum ada notifikasi baru untuk saat ini."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const ItemWrapper = notif.link ? Link : "div";
                return (
                  <ItemWrapper
                    key={notif.id}
                    href={notif.link || "#"}
                    onClick={() => {
                      markAsRead(notif.id);
                      if (notif.link) setIsOpen(false);
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      notif.read
                        ? "hover:bg-surface-container/50 opacity-80"
                        : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{notif.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs font-bold truncate ${
                            notif.read ? "text-on-surface" : "text-primary"
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-outline mt-1.5 block font-medium">
                        {notif.time}
                      </span>
                    </div>
                  </ItemWrapper>
                );
              })
            )}
          </div>

          <div className="p-2.5 border-t border-surface-container bg-surface-container-low/40 flex items-center justify-between text-xs">
            <Link
              href="/daily-report"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Isi Daily Report</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface rounded-md hover:bg-surface-container transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
