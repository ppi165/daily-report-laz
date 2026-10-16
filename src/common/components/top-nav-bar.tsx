"use client";

import { useTheme } from "@/src/common/context/theme-context";
import NotificationDropdown from "./notification-dropdown";
import ProfileDropdown from "./profile-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TopNavBarProps {
  onToggleSidebar?: () => void;
  title?: string;
  badge?: string;
}

export default function TopNavBar({
  onToggleSidebar,
  title,
  badge = "Unit Humas",
}: TopNavBarProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 px-4 lg:px-8 flex items-center justify-between z-30 bg-surface-container-lowest border-b border-outline-variant shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          aria-label="Buka Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </Button>

        {title ? (
          <div className="flex items-center gap-2">
            <span className="text-base lg:text-lg text-primary font-semibold truncate">
              {title}
            </span>
            {badge && (
              <Badge variant="secondary" className="hidden sm:inline-flex bg-secondary-container text-on-secondary-container font-semibold">
                {badge}
              </Badge>
            )}
          </div>
        ) : (
          <div className="w-60 md:w-80 lg:w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              search
            </span>
            <Input
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant text-sm text-on-surface placeholder:text-outline focus-visible:ring-secondary"
              placeholder="Cari aktivitas atau rekan kerja..."
              type="text"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          aria-label="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
        </Button>

        <NotificationDropdown />

        <Separator orientation="vertical" className="h-6 bg-outline-variant" />

        <ProfileDropdown />
      </div>
    </header>
  );
}
