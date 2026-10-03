"use client";

import Link from "next/link";

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
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 px-4 lg:px-8 flex items-center justify-between z-30 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          aria-label="Buka Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {title ? (
          <div className="flex items-center gap-2">
            <span className="text-base lg:text-lg text-primary font-semibold truncate">
              {title}
            </span>
            {badge && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                {badge}
              </span>
            )}
          </div>
        ) : (
          /* Search Bar on Left */
          <div className="w-60 md:w-80 lg:w-96 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Cari aktivitas atau rekan kerja..."
              type="text"
            />
          </div>
        )}
      </div>

      {/* Right Actions: Notifications & User Profile */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Notification Button with Indicator Dot */}
        <button
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors duration-150"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-outline-variant"></div>

        {/* User Profile Cluster */}
        <Link
          href="/profil"
          className="flex items-center gap-2.5 sm:gap-3 p-1 rounded-xl hover:bg-surface-container transition-colors group cursor-pointer"
          title="Buka Profil Saya"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex-shrink-0 group-hover:border-secondary transition-colors">
            <img
              className="w-full h-full object-cover"
              alt="Ahmad Fauzi"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn247TIAs7R8-zDWHwoeN8RTOBPLUZpEDYAKTXE-Vu4gq5tXxYXQdTxuFBAPBag-pPXnjHgYLrwi82oUcux15TpBfGvZnnJHe1AImvH-i7JV2V8bttE4ljzZkgMjCE7UsAHz6ZfMVkE_E_DmOTmVKJtuXCppT5JglnvHtsGbNUmo0yWjE2uAgnFr5IsUYr43PyO_W0bAyRNy_4HhYAOd9DnIvss6qdA8lW2yjcyrrh7v8M9HksxdURgA"
            />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors">
              Ahmad Fauzi
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-semibold bg-primary-container/10 text-primary-container">
                Humas
              </span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
