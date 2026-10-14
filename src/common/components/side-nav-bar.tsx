"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SideNavBar({ isOpen = false, onClose }: SideNavBarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      label: "Daily Report",
      href: "/daily-report",
      icon: "edit_document",
      isActive: pathname === "/daily-report" || pathname.startsWith("/reports/new"),
    },
    {
      label: "Rekap Report",
      href: "/rekap-report",
      icon: "table_chart",
      isActive: pathname === "/rekap-report" || pathname === "/reports",
    },
    {
      label: "Profil",
      href: "/profil",
      icon: "person",
      isActive: pathname === "/profil",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 flex flex-col justify-between p-4 z-40 bg-surface-container-lowest border-r border-outline-variant shadow-sm transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqNxBBt8lEVd3Ce9kOSZon1iMtRWUTTuCqgFwhB2ayjB0pvKDvzKs5kqKER0d68f_ubAOmfJqfdhtdXNN9YIu95YOtY0j5wYcRI-5jGIYPjtshUOYK1I0ImaUw7FskDg3B9lS104B94FJIkqST_PFkK7vCy0l5cJfBhOjP8WFAxGGLqL7YxDKu9Hxb5xLcEGr1R31E3fc3ptO7H5yu9WokkbQNckuBcZbvkMX_zZ2-ZmBSWhND4q0ALbtkvd8kT5bN3zk"
                alt="Logo LAZ Persis"
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary tracking-tight">LAZ Persis</span>
                <span className="text-xs text-on-surface-variant">Sistem Pelaporan Harian</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-outline hover:text-on-surface"
              aria-label="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="px-1">
            <Link
              href="/daily-report"
              onClick={onClose}
              className="w-full bg-primary-container text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-secondary transition-colors duration-150"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Input Laporan</span>
            </Link>
          </div>

          <nav className="flex flex-col gap-1.5 px-1" aria-label="Menu Utama">
            {navItems.map((item) => {
              const active = item.isActive;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-150 ${
                    active
                      ? "bg-primary-container text-white font-medium shadow-sm"
                      : "text-on-surface-variant font-normal hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{
                      fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-outline-variant px-2">
          <div className="flex items-center justify-between text-xs text-outline">
            <span className="font-medium">LAZ Persis Daily</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container font-mono">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
