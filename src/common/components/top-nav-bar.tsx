"use client";

import { useUser } from "@/src/common/context/user-context";
import { NotificationDropdown } from "@/src/modules/notifications";
import ProfileDropdown from "./profile-dropdown";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface TopNavBarProps {
  onToggleSidebar?: () => void;
  title?: string;
  badge?: string;
}

export default function TopNavBar({
  title,
  badge,
}: TopNavBarProps) {
  const { user } = useUser();

  const displayBadge = badge ?? (user?.division ? `Unit ${user.division}` : undefined);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 px-4 lg:px-8 flex items-center justify-between z-30 bg-surface-container-lowest border-b border-outline-variant shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 min-w-0">
        {title ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm sm:text-base lg:text-lg text-primary font-bold truncate max-w-[200px] xs:max-w-[240px] sm:max-w-none">
              {title}
            </span>
            {displayBadge && (
              <span suppressHydrationWarning className="hidden sm:inline-flex text-xs font-bold text-secondary tracking-wide shrink-0">
                • {displayBadge}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Branding Logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqNxBBt8lEVd3Ce9kOSZon1iMtRWUTTuCqgFwhB2ayjB0pvKDvzKs5kqKER0d68f_ubAOmfJqfdhtdXNN9YIu95YOtY0j5wYcRI-5jGIYPjtshUOYK1I0ImaUw7FskDg3B9lS104B94FJIkqST_PFkK7vCy0l5cJfBhOjP8WFAxGGLqL7YxDKu9Hxb5xLcEGr1R31E3fc3ptO7H5yu9WokkbQNckuBcZbvkMX_zZ2-ZmBSWhND4q0ALbtkvd8kT5bN3zk"
                alt="Logo LAZ Persis"
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-bold text-primary tracking-tight">
                LAZ Persis
              </span>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block w-96 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                search
              </span>
              <Input
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-container-low/60 border border-outline-variant text-sm text-on-surface placeholder:text-outline focus-visible:ring-secondary/20"
                placeholder="Cari aktivitas..."
                type="text"
              />
            </div>
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
