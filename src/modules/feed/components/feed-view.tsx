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

export default function FeedView() {
  const { user } = useUser();
  const [reports, setReports] = useState<ParsedFeedReport[]>([]);
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async (div = selectedDivision, search = searchQuery) => {
    try {
      const res = await getFeedReportsAction(
        div === "ALL" ? undefined : div,
        search.trim() ? search.trim() : undefined
      );

      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch {
      // Ignore network errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [reportsRes, divRes] = await Promise.all([
          getFeedReportsAction(),
          getDivisionsAction(),
        ]);

        if (!ignore) {
          if (reportsRes.success && reportsRes.data) {
            setReports(reportsRes.data);
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

  const handleDivisionChange = (val: string | null) => {
    if (!val) return;
    setSelectedDivision(val);
    setLoading(true);
    loadData(val, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Debounced search can be added or direct
    loadData(selectedDivision, val);
  };

  return (
    <AppShell headerTitle="Feed Laporan" headerBadge="Linimasa Amil">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {/* Header & Deskripsi */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Feed Laporan Amil
            </h1>
            <p className="text-sm text-on-surface-variant">
              Linimasa interaktif kegiatan harian amil LAZ Persis. Berikan apresiasi, komentar, dan balik kartu untuk melihat hasil kerja rekan amil.
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
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <FeedCard
                  key={report.id}
                  report={report}
                  currentUser={
                    user
                      ? {
                          id: user.id,
                          name: user.name,
                          division: user.division,
                        }
                      : null
                  }
                />
              ))
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
