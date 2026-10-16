"use client";

import { useUser } from "@/src/common/context/user-context";
import NotificationDropdown from "./notification-dropdown";
import ProfileDropdown from "./profile-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface TopNavBarProps {
  onToggleSidebar?: () => void;
  title?: string;
  badge?: string;
}

export default function TopNavBar({
  onToggleSidebar,
  title,
  badge,
}: TopNavBarProps) {
  const { user } = useUser();

  const displayBadge = badge ?? (user?.division ? `Unit ${user.division}` : undefined);

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
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm sm:text-base lg:text-lg text-primary font-bold truncate max-w-[160px] xs:max-w-[200px] sm:max-w-none">
              {title}
            </span>
            {displayBadge && (
              <span suppressHydrationWarning className="hidden sm:inline-flex text-xs font-bold text-secondary tracking-wide shrink-0">
                • {displayBadge}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full max-w-[150px] xs:max-w-[190px] sm:max-w-xs md:max-w-sm lg:w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] sm:text-[20px] pointer-events-none">
              search
            </span>
            <Input
              className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl bg-surface-container-low/60 border border-outline-variant text-xs sm:text-sm text-on-surface placeholder:text-outline focus-visible:ring-secondary/20"
              placeholder="Cari aktivitas..."
              type="text"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <NotificationDropdown />

        <Separator orientation="vertical" className="h-6 bg-outline-variant" />

        <ProfileDropdown />
      </div>
    </header>
  );
}
