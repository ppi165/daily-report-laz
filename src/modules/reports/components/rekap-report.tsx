"use client";

import { useState, useEffect, useMemo } from "react";
import AppShell from "@/src/common/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportData {
  id: string;
  content: string;
  status: string;
  appreciations: number;
  division: string;
  createdAt: string | Date;
  author?: { name: string };
  [key: string]: unknown;
}

export default function RekapReport() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [divisionsList, setDivisionsList] = useState<string[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const [repRes, divRes] = await Promise.all([
          fetch("/api/v1/reports"),
          fetch("/api/v1/divisions"),
        ]);

        if (!ignore && repRes.ok) {
          const json = await repRes.json();
          if (json.data) setReports(json.data);
        }

        if (!ignore && divRes.ok) {
          const json = await divRes.json();
          if (json.data && Array.isArray(json.data)) {
            setDivisionsList(json.data.map((d: { name: string }) => d.name));
          }
        }
      } catch {
        // Fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchDivision =
      selectedDivision === "ALL" || r.division === selectedDivision;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.content.toLowerCase().includes(q) ||
      r.author?.name.toLowerCase().includes(q);
    return matchDivision && matchSearch;
  });

  const activeReportersCount = new Set(filteredReports.map((r) => r.author?.name || "anon")).size;

  const divisionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of reports) {
      const div = r.division || "Umum";
      counts[div] = (counts[div] || 0) + 1;
    }
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;
    return entries.map(([div, count]) => ({
      division: div,
      count,
      percentage: Math.max(10, Math.round((count / max) * 100)),
    }));
  }, [reports]);

  return (
    <AppShell headerTitle="Rekap Daily Report LAZ Persis" headerBadge={selectedDivision === "ALL" ? "Semua Bidang" : `Unit ${selectedDivision}`}>
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="max-w-[1240px] w-full flex flex-col gap-6">
          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
              Rekap Daily Report
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1.5">
              Lihat aktivitas, sinergi, dan kontribusi seluruh rekan kerja di
              berbagai bidang LAZ Persis.
            </p>
          </div>

          <Card className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-xs flex flex-col gap-6">
            <CardContent className="p-0 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative pl-4 border-l-4 border-primary">
                  <div className="text-3xl sm:text-4xl text-primary font-black tracking-tight tabular-nums">
                    {filteredReports.length}
                  </div>
                  <div className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
                    Total Report {selectedDivision === "ALL" ? "Seluruh Lembaga" : `Unit ${selectedDivision}`}
                  </div>
                  <div className="text-xs text-secondary mt-1 font-semibold">
                    <span>Tercatat di sistem</span>
                  </div>
                </div>

                <div className="relative pl-4 border-l-4 border-primary-container">
                  <div className="text-3xl sm:text-4xl text-on-surface font-black tracking-tight tabular-nums">
                    {activeReportersCount}
                  </div>
                  <div className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
                    Pegawai Aktif Melapor
                  </div>
                </div>

                <div className="relative pl-4 border-l-4 border-secondary">
                  <div className="text-3xl sm:text-4xl text-secondary font-black tracking-tight tabular-nums">
                    {filteredReports.length > 0 ? "100%" : "0%"}
                  </div>
                  <div className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
                    Kelengkapan Pelaporan
                  </div>
                  <div className="text-xs text-secondary mt-1 font-semibold">
                    <span>Sangat Baik</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-surface-container" />

              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-lg text-on-surface font-semibold">
                    Distribusi Laporan per Bidang
                  </h2>
                  <span className="text-xs text-on-surface-variant">
                    Update real-time pekan ini
                  </span>
                </div>
                <div className="flex flex-col gap-3.5">
                  {divisionStats.length === 0 ? (
                    <div className="py-4 text-center text-xs text-outline">
                      Belum ada data distribusi laporan dari tiap bidang.
                    </div>
                  ) : (
                    divisionStats.slice(0, 6).map((stat, idx) => {
                      const colors = [
                        "bg-primary",
                        "bg-secondary",
                        "bg-primary-container",
                        "bg-secondary",
                        "bg-primary",
                        "bg-outline",
                      ];
                      return (
                        <div key={stat.division} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-on-surface flex items-center gap-2">
                              <span className={`size-2 rounded-full ${colors[idx % colors.length]}`}></span>
                              {stat.division}
                            </span>
                            <span className="font-semibold text-primary">{stat.count} report</span>
                          </div>
                          <Progress value={stat.percentage} className="h-2.5 bg-surface-container" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/60 shadow-xs">
            <CardContent className="p-0 w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 flex-1">
                <Select defaultValue="Hari Ini">
                  <SelectTrigger className="w-full sm:w-[130px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="Hari Ini">Hari Ini</SelectItem>
                      <SelectItem value="Mingguan">Mingguan</SelectItem>
                      <SelectItem value="Bulanan">Bulanan</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select defaultValue="21 – 27 September 2026">
                  <SelectTrigger className="w-full sm:w-[190px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
                    <SelectValue placeholder="Pilih Rentang" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="21 – 27 September 2026">21 – 27 Sep 2026</SelectItem>
                      <SelectItem value="14 – 20 September 2026">14 – 20 Sep 2026</SelectItem>
                      <SelectItem value="07 – 13 September 2026">07 – 13 Sep 2026</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={selectedDivision} onValueChange={(val) => { if (val) setSelectedDivision(val); }}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
                    <SelectValue placeholder="Filter Bidang" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="ALL">Semua Bidang</SelectItem>
                      {divisionsList.map((divName) => (
                        <SelectItem key={divName} value={divName}>
                          {divName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="relative w-full sm:col-span-2 lg:col-span-1 lg:flex-1 lg:min-w-[220px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                    search
                  </span>
                  <Input
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline h-10 focus-visible:ring-secondary/20"
                    placeholder="Cari pegawai atau isi report..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full lg:w-auto border-secondary/40 text-secondary hover:bg-secondary/10 text-xs sm:text-sm font-semibold px-4 h-10 rounded-xl flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export Excel</span>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {loading ? (
              <>
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              </>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Card key={report.id} className="bg-surface-container-lowest rounded-2xl p-6 border-outline-variant/60 shadow-none hover:shadow-xs hover:border-secondary/30 transition-all flex flex-col gap-4">
                  <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                        {report.author?.name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <CardTitle className="text-base font-bold text-on-surface leading-tight">
                            {report.author?.name || "Anonim"}
                          </CardTitle>
                          <span className="text-xs font-semibold text-secondary">
                            • {report.division}
                          </span>
                        </div>
                        <span className="text-xs text-outline block mt-0.5 font-mono">
                          {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} • {new Date(report.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {Boolean(report.isClockIn) && (
                        <span className="text-xs font-bold font-mono text-amber-500">
                          [Clock-in]
                        </span>
                      )}
                      {report.status === "PENDING_APPROVAL" ? (
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1 font-mono uppercase">
                          <span className="size-1.5 rounded-full bg-amber-500"></span>
                          Menunggu Verifikasi
                        </span>
                      ) : report.status === "REJECTED" ? (
                        <span className="text-xs font-bold text-error flex items-center gap-1 font-mono uppercase">
                          <span className="size-1.5 rounded-full bg-error"></span>
                          Ditolak
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-secondary flex items-center gap-1 font-mono uppercase">
                          <span className="size-1.5 rounded-full bg-secondary"></span>
                          PUBLISHED
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 text-sm text-on-surface leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {report.content}
                  </CardContent>

                  <Separator className="bg-surface-container" />

                  <CardFooter className="p-0 pb-6 pt-1 bg-transparent border-0 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border-outline-variant/60 hover:bg-surface-container text-xs font-semibold h-auto cursor-pointer"
                    >
                      <span data-icon="inline-start" className="material-symbols-outlined text-[14px] text-secondary">thumb_up</span>
                      <span>{report.appreciations} Apresiasi</span>
                    </Button>
                    <a
                      className="text-sm font-medium text-primary hover:text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                    </a>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  description
                </span>
                <p className="text-on-surface font-semibold text-base">
                  Tidak Ada Laporan yang Ditemukan
                </p>
                <p className="text-on-surface-variant text-xs mt-1">
                  Coba sesuaikan filter bidang atau kata kunci pencarian Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
