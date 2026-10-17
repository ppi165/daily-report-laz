"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUser } from "@/src/common/context/user-context";
import UserAvatar from "@/src/common/components/user-avatar";
import { getClockInReportsAction } from "@/src/modules/approvals/actions/get-clock-in-reports.action";
import { ClockInReport } from "@/src/modules/approvals/types/approval.types";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ambil data verifikasi pending saksi untuk notifikasi amber badge
  useEffect(() => {
    let isMounted = true;

    async function fetchPendingVerifications() {
      if (!user) return;
      try {
        const res = await getClockInReportsAction();
        if (isMounted && res.success && res.data) {
          const list = res.data as ClockInReport[];
          const pending = list.filter(
            (r) =>
              r.status === "PENDING_APPROVAL" &&
              r.approvals?.some(
                (a) =>
                  a.status === "PENDING" &&
                  (a.approverId === user.id || a.approverMockId === user.id)
              )
          ).length;
          setPendingCount(pending);
        }
      } catch {
        // Fallback hening jika jaringan/sesi belum siap
      }
    }

    // Muat satu kali saat mount (login / refresh browser)
    fetchPendingVerifications();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isAdminOrSuper = mounted
    ? user?.role === "ADMIN" ||
      user?.role === "SUPERADMIN" ||
      user?.role === "SUPER_ADMIN"
    : pathname.startsWith("/admin");

  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const isFeed = pathname === "/feed";
  const isVerifikasi = pathname === "/verifikasi";
  const isDrawerActive =
    pathname === "/rekap-report" ||
    pathname === "/profil" ||
    pathname.startsWith("/admin");

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)] pb-safe pt-2 px-3 flex items-center justify-around"
      aria-label="Navigasi Bawah Mobile"
    >
      {/* Tab 1: Beranda */}
      <Link
        href="/dashboard"
        prefetch={true}
        className={cn(
          "flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-1 px-1.5 transition-colors touch-manipulation",
          isDashboard
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="relative flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: isDashboard ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            dashboard
          </span>
        </div>
        <span className="text-[11px] leading-tight transition-colors">
          Beranda
        </span>
        <span
          className={cn(
            "size-1 rounded-full transition-all duration-200 mt-0.5",
            isDashboard ? "bg-primary opacity-100 scale-100" : "opacity-0 scale-0"
          )}
        />
      </Link>

      {/* Tab 2: Feed / Linimasa */}
      <Link
        href="/feed"
        prefetch={true}
        className={cn(
          "flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-1 px-1.5 transition-colors touch-manipulation",
          isFeed
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="relative flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: isFeed ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            dynamic_feed
          </span>
        </div>
        <span className="text-[11px] leading-tight transition-colors">Feed</span>
        <span
          className={cn(
            "size-1 rounded-full transition-all duration-200 mt-0.5",
            isFeed ? "bg-primary opacity-100 scale-100" : "opacity-0 scale-0"
          )}
        />
      </Link>

      {/* Tab 3: Center Elevated FAB (Buat Laporan) */}
      <div className="flex flex-col items-center justify-center -mt-6">
        <Button
          render={<Link href="/daily-report" prefetch={true} />}
          size="icon"
          className="size-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/30 ring-4 ring-background hover:from-emerald-500 hover:to-teal-400 active:scale-95 transition-all flex items-center justify-center p-0 cursor-pointer"
          aria-label="Buat Laporan Harian"
        >
          <span className="material-symbols-outlined text-white text-[26px]">
            edit_document
          </span>
        </Button>
        <span className="text-[10px] font-medium text-muted-foreground mt-1">
          Lapor
        </span>
      </div>

      {/* Tab 4: Verifikasi */}
      <Link
        href="/verifikasi"
        prefetch={true}
        className={cn(
          "flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-1 px-1.5 transition-colors touch-manipulation",
          isVerifikasi
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="relative flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: isVerifikasi ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            fact_check
          </span>
          {pendingCount > 0 && (
            <Badge
              variant="outline"
              className="absolute -top-1.5 -right-3 px-1 py-0 h-4 min-w-4 text-[10px] font-bold bg-amber-500 text-white border-card rounded-full flex items-center justify-center shadow-xs"
            >
              {pendingCount > 9 ? "9+" : pendingCount}
            </Badge>
          )}
        </div>
        <span className="text-[11px] leading-tight transition-colors">
          Verifikasi
        </span>
        <span
          className={cn(
            "size-1 rounded-full transition-all duration-200 mt-0.5",
            isVerifikasi
              ? "bg-primary opacity-100 scale-100"
              : "opacity-0 scale-0"
          )}
        />
      </Link>

      {/* Tab 5: Menu Lainnya / Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger
          className={cn(
            "flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-1 px-1.5 transition-colors cursor-pointer outline-none touch-manipulation",
            isDrawerActive
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Menu Lainnya"
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings: isDrawerActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              more_horiz
            </span>
          </div>
          <span className="text-[11px] leading-tight transition-colors">
            Lainnya
          </span>
          <span
            className={cn(
              "size-1 rounded-full transition-all duration-200 mt-0.5",
              isDrawerActive
                ? "bg-primary opacity-100 scale-100"
                : "opacity-0 scale-0"
            )}
          />
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-3xl border-t border-border bg-card text-card-foreground p-0 overflow-hidden flex flex-col"
        >
          <SheetHeader className="p-4 pb-3 border-b border-border/50">
            <div className="mx-auto w-10 h-1 rounded-full bg-muted-foreground/30 mb-2" />
            <div className="flex items-center gap-3">
              <UserAvatar
                name={user?.name || "Pengguna"}
                avatarUrl={user?.avatar}
                className="size-10 border border-border"
              />
              <div className="flex flex-col text-left">
                <SheetTitle className="text-sm font-bold text-foreground">
                  {user?.name || "Pengguna"}
                </SheetTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>
                    {user?.division ? `Unit ${user.division}` : "LAZ Persis"}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-primary">
                    {user?.role || "STAFF"}
                  </span>
                </div>
              </div>
            </div>
            <SheetDescription className="sr-only">
              Daftar navigasi cepat dan menu administrasi LAZ Persis
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-safe">
            {/* Shortcut Laporan & Profil */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Menu Utama
              </span>
              <Link
                href="/rekap-report"
                prefetch={true}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all touch-manipulation",
                  pathname === "/rekap-report"
                    ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                    : "bg-surface-container-low/50 border-border hover:bg-muted text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      table_chart
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Rekap Laporan</span>
                    <span className="text-xs text-muted-foreground">
                      Tinjau seluruh arsip & rekapitulasi kerja
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                  chevron_right
                </span>
              </Link>

              <Link
                href="/profil"
                prefetch={true}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all touch-manipulation",
                  pathname === "/profil"
                    ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                    : "bg-surface-container-low/50 border-border hover:bg-muted text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      account_circle
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Profil & Kinerja</span>
                    <span className="text-xs text-muted-foreground">
                      Pengaturan akun amil & ganti kata sandi
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                  chevron_right
                </span>
              </Link>
            </div>

            {/* Menu Admin Khusus Administrator */}
            {isAdminOrSuper && (
              <>
                <Separator className="bg-border" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Administrasi Sistem
                  </span>
                  <Link
                    href="/admin/pengguna"
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all touch-manipulation",
                      pathname.startsWith("/admin/pengguna")
                        ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                        : "bg-surface-container-low/50 border-border hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          manage_accounts
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Kelola Pengguna
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Manajemen amil, hak akses & akun
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                      chevron_right
                    </span>
                  </Link>

                  <Link
                    href="/admin/divisi"
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all touch-manipulation",
                      pathname.startsWith("/admin/divisi")
                        ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                        : "bg-surface-container-low/50 border-border hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          account_tree
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Kelola Divisi
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Struktur unit dan bidang kerja
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                      chevron_right
                    </span>
                  </Link>

                  <Link
                    href="/admin/pengaturan"
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all touch-manipulation",
                      pathname.startsWith("/admin/pengaturan")
                        ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                        : "bg-surface-container-low/50 border-border hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          tune
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Pengaturan Umum
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Batas waktu laporan & jadwal jam kerja
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                      chevron_right
                    </span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
