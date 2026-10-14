"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  division: string;
  avatar?: string;
}

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>({
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@lazpersis.or.id",
    division: "Humas",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCn247TIAs7R8-zDWHwoeN8RTOBPLUZpEDYAKTXE-Vu4gq5tXxYXQdTxuFBAPBag-pPXnjHgYLrwi82oUcux15TpBfGvZnnJHe1AImvH-i7JV2V8bttE4ljzZkgMjCE7UsAHz6ZfMVkE_E_DmOTmVKJtuXCppT5JglnvHtsGbNUmo0yWjE2uAgnFr5IsUYr43PyO_W0bAyRNy_4HhYAOd9DnIvss6qdA8lW2yjcyrrh7v8M9HksxdURgA",
  });

  // Fetch data user aktif jika ada session
  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch("/api/v1/users/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser((prev) => ({
              ...prev,
              name: json.data.name || prev.name,
              email: json.data.email || prev.email,
              division: json.data.division || prev.division,
            }));
          }
        }
      } catch (err) {
        // Fallback ke default bila offline/tidak ada session endpoint
      }
    }
    loadUserData();
  }, []);

  // Handle outside click & escape key
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsOpen(false);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isOpen
            ? "bg-surface-container text-on-surface ring-1 ring-outline-variant"
            : "hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menu Profil Pengguna"
        title="Menu Profil"
      >
        {/* Avatar with status indicator */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high shrink-0 transition-colors">
          <img
            className="w-full h-full object-cover"
            alt={user.name}
            src={user.avatar}
          />
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest"
            title="Amil Aktif"
          />
        </div>

        {/* User Info (Hidden on mobile) */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-semibold text-on-surface leading-tight max-w-[130px] truncate">
            {user.name}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-semibold bg-primary-container/10 text-primary-container">
              {user.division || "Humas"}
            </span>
          </div>
        </div>

        {/* Caret Chevron Icon */}
        <span
          className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-outline"
          }`}
        >
          keyboard_arrow_down
        </span>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-2"
        >
          {/* Header Profile Summary */}
          <div className="p-4 bg-surface-container-low/50 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt={user.name}
                  src={user.avatar}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-on-surface truncate">
                    {user.name}
                  </h4>
                </div>
                <p className="text-xs text-on-surface-variant truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Unit {user.division || "Humas"}
                  </span>
                  <span className="text-[10px] font-medium text-outline">
                    Amil Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-1">
            <Link
              href="/profil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-150 group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Profil Saya</span>
                <span className="text-[11px] text-outline font-normal">
                  Lihat biodata dan info kepegawaian
                </span>
              </div>
            </Link>

            <Link
              href="/daily-report"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-150 group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Input Daily Report</span>
                <span className="text-[11px] text-outline font-normal">
                  Kirim pelaporan aktivitas kerja
                </span>
              </div>
            </Link>

            <Link
              href="/rekap-report"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-150 group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">table_chart</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Rekap Riwayat Laporan</span>
                <span className="text-[11px] text-outline font-normal">
                  Evaluasi dan histori kinerja Anda
                </span>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-surface-container"></div>

          {/* Logout Action */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-error hover:bg-error/10 transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group text-left"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-colors">
                {isLoggingOut ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                )}
              </div>
              <div className="flex flex-col">
                <span>{isLoggingOut ? "Sedang Keluar..." : "Keluar (Logout)"}</span>
                <span className="text-[10px] text-outline font-normal group-hover:text-error/80">
                  Akhiri sesi amil di perangkat ini
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
