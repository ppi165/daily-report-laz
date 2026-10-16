"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    division?: string;
  };
}

export default function ProfileDropdown({ user: initialUser }: ProfileDropdownProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(
    initialUser || {
      name: "Pegawai",
      email: "pegawai@lazpersis.or.id",
      division: "Humas",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCn247TIAs7R8-zDWHwoeN8RTOBPLUZpEDYAKTXE-Vu4gq5tXxYXQdTxuFBAPBag-pPXnjHgYLrwi82oUcux15TpBfGvZnnJHe1AImvH-i7JV2V8bttE4ljzZkgMjCE7UsAHz6ZfMVkE_E_DmOTmVKJtuXCppT5JglnvHtsGbNUmo0yWjE2uAgnFr5IsUYr43PyO_W0bAyRNy_4HhYAOd9DnIvss6qdA8lW2yjcyrrh7v8M9HksxdURgA",
    }
  );

  useEffect(() => {
    let ignore = false;
    async function fetchMe() {
      try {
        const res = await fetch("/api/v1/users/me");
        const json = await res.json();
        if (!ignore && json.success && json.data) {
          setUser((prev) => ({
            ...prev,
            name: json.data.name || prev.name,
            email: json.data.email || prev.email,
            division: json.data.division || prev.division,
          }));
        }
      } catch (e) {
        console.error("Gagal load user:", e);
      }
    }
    fetchMe();
    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-surface-container text-on-surface-variant hover:text-on-surface">
        <div className="relative shrink-0">
          <Avatar className="size-9 sm:size-10 border border-outline-variant">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span
            className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest"
            title="Amil Aktif"
          />
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-semibold text-on-surface leading-tight max-w-[130px] truncate">
            {user.name}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-semibold bg-secondary/15 text-secondary border-transparent">
              {user.division || "Humas"}
            </Badge>
          </div>
        </div>

        <span className="material-symbols-outlined text-[20px] text-outline">
          keyboard_arrow_down
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-surface-container-lowest border-outline-variant p-0 overflow-hidden">
        <div className="p-4 bg-surface-container-low/50 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border border-outline-variant shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-on-surface truncate">
                {user.name}
              </h4>
              <p className="text-xs text-on-surface-variant truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                  <span className="size-1.5 rounded-full bg-emerald-500"></span>
                  Unit {user.division || "Humas"}
                </span>
                <span className="text-[10px] font-medium text-outline">
                  Amil Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem
              render={<Link href="/profil" />}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-150 group w-full cursor-pointer"
            >
              <div className="size-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Profil Saya</span>
                <span className="text-[11px] text-outline font-normal">
                  Lihat biodata dan info kepegawaian
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              render={<Link href="/daily-report" />}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-150 group w-full cursor-pointer"
            >
              <div className="size-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined text-[18px]">edit_document</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Input Daily Report</span>
                <span className="text-[11px] text-outline font-normal">
                  Kirim pelaporan aktivitas kerja
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              render={<Link href="/rekap-report" />}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-150 group w-full cursor-pointer"
            >
              <div className="size-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined text-[18px]">table_chart</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Rekap Riwayat Laporan</span>
                <span className="text-[11px] text-outline font-normal">
                  Evaluasi dan histori kinerja Anda
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>

        <DropdownMenuSeparator className="my-0 border-surface-container" />

        <div className="p-2">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-error hover:bg-error/10 focus:bg-error/10 focus:text-error transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group text-left"
            >
              <div className="size-8 rounded-lg bg-error/10 flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-colors shrink-0">
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
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
