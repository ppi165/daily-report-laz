"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/src/common/context/user-context";

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SideNavBar({ isOpen = false, onClose }: SideNavBarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminOrSuper = mounted
    ? (user?.role === "ADMIN" || user?.role === "SUPERADMIN")
    : pathname.startsWith("/admin");

  const allNavItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      isActive: pathname === "/dashboard" || pathname === "/",
      show: true,
    },
    {
      label: "Feed Laporan",
      href: "/feed",
      icon: "dynamic_feed",
      isActive: pathname === "/feed",
      show: true,
    },
    {
      label: "Daily Report",
      href: "/daily-report",
      icon: "edit_document",
      isActive: pathname === "/daily-report" || pathname.startsWith("/reports/new"),
      show: true,
    },
    {
      label: "Rekap Report",
      href: "/rekap-report",
      icon: "table_chart",
      isActive: pathname === "/rekap-report" || pathname === "/reports",
      show: true,
    },
    {
      label: "Verif Clock-in",
      href: "/verifikasi",
      icon: "fact_check",
      isActive: pathname === "/verifikasi",
      show: true,
    },
    {
      label: "Kelola Divisi",
      href: "/admin/divisi",
      icon: "account_tree",
      isActive: pathname.startsWith("/admin/divisi"),
      show: isAdminOrSuper,
    },
    {
      label: "Kelola Pengguna",
      href: "/admin/pengguna",
      icon: "manage_accounts",
      isActive: pathname.startsWith("/admin/pengguna"),
      show: isAdminOrSuper,
    },
    {
      label: "Pengaturan Umum",
      href: "/admin/pengaturan",
      icon: "tune",
      isActive: pathname.startsWith("/admin/pengaturan"),
      show: isAdminOrSuper,
    },
  ];

  const navItems = allNavItems.filter((item) => item.show);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 flex flex-col p-4 z-40 bg-surface-container-lowest border-r border-outline-variant shadow-sm transition-transform duration-200 lg:translate-x-0 ${
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden size-8 text-outline hover:text-on-surface"
              aria-label="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </Button>
          </div>

          <nav className="flex flex-col gap-1 px-1" aria-label="Menu Utama">
            {navItems.map((item) => {
              const active = item.isActive;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    active
                      ? "bg-secondary text-white font-semibold shadow-xs"
                      : "text-on-surface-variant font-medium hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
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
      </aside>
    </>
  );
}
