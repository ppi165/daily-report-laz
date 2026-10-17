"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/src/common/context/user-context";
import { useTheme } from "@/src/common/context/theme-context";

export default function ProfileDropdown() {
  const { user, logout } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || "Memuat...";
  const displayEmail = user?.email || "";
  const displayDivision = user?.division || "Lembaga";
  const displayRole = user?.role || "STAFF";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-surface-container text-on-surface-variant hover:text-on-surface">
        <div className="relative shrink-0">
          <Avatar className="size-9 sm:size-10 border border-outline-variant">
            <AvatarImage src={user?.avatar} alt={displayName} className="object-cover size-full" />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span
            className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest"
            title="Amil Aktif"
          />
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span suppressHydrationWarning className="text-sm font-semibold text-on-surface leading-tight max-w-[130px] truncate">
            {displayName}
          </span>
          <span suppressHydrationWarning className="text-[11px] font-semibold text-secondary leading-none mt-0.5">
            {displayDivision}
          </span>
        </div>

        <span className="material-symbols-outlined text-[20px] text-outline">
          keyboard_arrow_down
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-surface-container-lowest border-outline-variant p-0 overflow-hidden">
        <div className="p-4 bg-surface-container-low/50 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border border-outline-variant shrink-0">
              <AvatarImage src={user?.avatar} alt={displayName} className="object-cover size-full" />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 suppressHydrationWarning className="text-sm font-bold text-on-surface truncate">
                {displayName}
              </h4>
              <p suppressHydrationWarning className="text-xs text-on-surface-variant truncate">
                {displayEmail}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span suppressHydrationWarning className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                  <span className="size-1.5 rounded-full bg-emerald-500"></span>
                  {displayDivision}
                </span>
                <span className="text-[10px] text-outline">•</span>
                <span suppressHydrationWarning className="text-[11px] font-mono font-bold uppercase text-secondary">
                  {displayRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem
              render={<Link href="/profil" />}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Profil Pengguna</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={toggleTheme}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">
                  {isDarkMode ? "light_mode" : "dark_mode"}
                </span>
                <span>{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
              </div>
              <span className="text-[10px] text-outline font-mono uppercase">
                {isDarkMode ? "Gelap" : "Terang"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5 bg-surface-container" />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-error hover:bg-error/10 rounded-lg cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{isLoggingOut ? "Keluar..." : "Keluar Sesi"}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
