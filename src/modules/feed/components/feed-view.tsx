"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/src/common/context/user-context";
import { getFeedReportsAction } from "../actions/get-feed-reports.action";
import { ParsedFeedReport } from "../use-cases/get-feed-reports.use-case";
import { getDivisionsAction } from "@/src/modules/divisions";
import FeedCard from "./feed-card";
import { scrollToAndHighlightElement } from "@/src/common/utils/scroll-to-element";

export default function FeedView() {
  const { user } = useUser();
  const [reports, setReports] = useState<ParsedFeedReport[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = async (div = selectedDivision, search = searchQuery) => {
    try {
      const res = await getFeedReportsAction({
        limit: 10,
        division: div === "ALL" ? undefined : div,
        search: search.trim() ? search.trim() : undefined,
      });

      if (res.success && res.data) {
        setReports(res.data.reports);
        setNextCursor(res.data.nextCursor);
      }
    } catch {
      // Ignore network errors
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getFeedReportsAction({
        cursor: nextCursor,
        limit: 10,
        division: selectedDivision === "ALL" ? undefined : selectedDivision,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
      });

      if (res.success && res.data) {
        setReports((prev) => [...prev, ...res.data.reports]);
        setNextCursor(res.data.nextCursor);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingMore(false);
    }
  };

  // Muat data divisi awal dan feed awal
  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [reportsRes, divRes] = await Promise.all([
          getFeedReportsAction({ limit: 10 }),
          getDivisionsAction(),
        ]);

        if (!ignore) {
          if (reportsRes.success && reportsRes.data) {
            setReports(reportsRes.data.reports);
            setNextCursor(reportsRes.data.nextCursor);
          }
          if (divRes.success && divRes.data) {
            setDivisions(divRes.data as { id: string; name: string }[]);
          }
        }
      } catch {
        // Fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Debounced search (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(selectedDivision, searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDivision]);

  // Auto-scroll dan highlight laporan jika terdapat hash target di URL
  useEffect(() => {
    if (!loading && reports.length > 0 && typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        scrollToAndHighlightElement(hash);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [loading, reports]);

  const handleDivisionChange = (val: string | null) => {
    if (!val) return;
    setSelectedDivision(val);
    setLoading(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AppShell headerTitle="Feed Laporan" headerBadge="Linimasa Amil">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Header & Deskripsi */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Feed Laporan Amil
            </h1>
            <p className="text-sm text-on-surface-variant">
              Linimasa interaktif kegiatan harian amil LAZ Persis. Berikan apresiasi, komentar, serta tinjau capaian dan hasil kerja rekan amil.
            </p>
          </div>

          {/* Filter Bar (Search & Divisi) */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                search
              </span>
              <Input
                placeholder="Cari amil atau aktivitas pekerjaan..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 h-10 text-xs sm:text-sm bg-surface-container-low/50 border-outline-variant focus-visible:ring-secondary/20"
              />
            </div>

            <div className="w-full sm:w-56 shrink-0">
              <Select value={selectedDivision} onValueChange={handleDivisionChange}>
                <SelectTrigger className="w-full h-10 text-xs sm:text-sm bg-surface-container-low/50 border-outline-variant">
                  <SelectValue placeholder="Pilih Bidang" />
                </SelectTrigger>
                <SelectContent className="bg-surface-container-lowest border-outline-variant">
                  <SelectGroup>
                    <SelectItem value="ALL">Semua Bidang / Divisi</SelectItem>
                    {divisions.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feed Content List */}
          <div className="flex flex-col gap-6">
            {loading ? (
              <>
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-xl" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                  <div className="flex items-center gap-4 pt-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-xl" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                  <div className="flex items-center gap-4 pt-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </>
            ) : reports.length > 0 ? (
              <>
                {reports.map((report) => (
                  <FeedCard
                    key={report.id}
                    report={report}
                    currentUser={
                      user
                        ? {
                            id: user.id,
                            name: user.name,
                            division: user.division,
                            role: user.role,
                            avatar: user.avatar,
                          }
                        : null
                    }
                  />
                ))}

                {/* Tombol Muat Lebih Banyak / Indikator Akhir Feed */}
                {nextCursor ? (
                  <div className="pt-2 pb-6 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-6 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/80 text-xs sm:text-sm font-semibold text-on-surface hover:text-primary transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                      {loadingMore ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">
                            progress_activity
                          </span>
                          <span>Memuat Laporan...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">
                            expand_more
                          </span>
                          <span>Muat Laporan Lainnya</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-outline font-medium flex items-center justify-center gap-2">
                    <span className="size-1.5 rounded-full bg-outline-variant"></span>
                    <span>Semua laporan telah ditampilkan</span>
                    <span className="size-1.5 rounded-full bg-outline-variant"></span>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant flex flex-col items-center justify-center p-6">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  dynamic_feed
                </span>
                <p className="text-on-surface font-semibold text-base">
                  Belum Ada Laporan di Feed
                </p>
                <p className="text-on-surface-variant text-xs mt-1 max-w-sm">
                  Tidak ada laporan yang cocok dengan kriteria filter saat ini. Coba sesuaikan kata kunci atau bidang pilihan.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
