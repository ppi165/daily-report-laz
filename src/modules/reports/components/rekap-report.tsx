"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary"></span>
                        Humas
                      </span>
                      <span className="font-semibold text-primary">24 report</span>
                    </div>
                    <Progress value={100} className="h-2.5 bg-surface-container" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        <span className="size-2 rounded-full bg-secondary"></span>
                        Program
                      </span>
                      <span className="font-semibold text-secondary">20 report</span>
                    </div>
                    <Progress value={83.3} className="h-2.5 bg-surface-container" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary-container"></span>
                        Sekretariat
                      </span>
                      <span className="font-semibold text-on-surface">16 report</span>
                    </div>
                    <Progress value={66.6} className="h-2.5 bg-surface-container" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        <span className="size-2 rounded-full bg-secondary"></span>
                        Keuangan
                      </span>
                      <span className="font-semibold text-on-surface">12 report</span>
                    </div>
                    <Progress value={50} className="h-2.5 bg-surface-container" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary"></span>
                        SDM
                      </span>
                      <span className="font-semibold text-on-surface">10 report</span>
                    </div>
                    <Progress value={41.6} className="h-2.5 bg-surface-container" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-on-surface flex items-center gap-2">
                        <span className="size-2 rounded-full bg-outline"></span>
                        IT
                      </span>
                      <span className="font-semibold text-on-surface">4 report</span>
                    </div>
                    <Progress value={16.6} className="h-2.5 bg-surface-container" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant custom-shadow-card flex flex-wrap items-center justify-between gap-4">
            <CardContent className="p-0 w-full flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Select defaultValue="Hari Ini">
                  <SelectTrigger className="w-[140px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
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
                  <SelectTrigger className="w-[210px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
                    <SelectValue placeholder="Pilih Rentang Tanggal" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="21 – 27 September 2026">21 – 27 September 2026</SelectItem>
                      <SelectItem value="14 – 20 September 2026">14 – 20 September 2026</SelectItem>
                      <SelectItem value="07 – 13 September 2026">07 – 13 September 2026</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={selectedDivision} onValueChange={(val) => { if (val) setSelectedDivision(val); }}>
                  <SelectTrigger className="w-[170px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
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

                <div className="relative min-w-[260px] w-full sm:w-auto mt-2 sm:mt-0">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px] pointer-events-none">
                    search
                  </span>
                  <Input
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline h-10"
                    placeholder="Cari nama pegawai atau isi report..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-primary-container text-primary-container hover:bg-primary-container/10 text-sm font-medium px-4 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              >
                Export Excel
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
                <Card key={report.id} className="bg-surface-container-lowest rounded-2xl p-6 border-outline-variant/60 shadow-none hover:shadow-xs hover:border-secondary/30 transition-all flex flex-col justify-between gap-4">
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
                          <Badge variant="secondary" className="px-2 py-0.5 text-[11px] font-semibold bg-surface-container-high text-on-surface-variant w-max border-transparent">
                            {report.division}
                          </Badge>
                        </div>
                        <span className="text-xs text-outline block mt-0.5 font-mono">
                          {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} • {new Date(report.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {Boolean(report.isClockIn) && (
                        <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                          Clock-in
                        </Badge>
                      )}
                      {report.status === "PENDING_APPROVAL" ? (
                        <Badge variant="secondary" className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent">
                          Menunggu Verifikasi
                        </Badge>
                      ) : report.status === "REJECTED" ? (
                        <Badge variant="secondary" className="px-2.5 py-0.5 text-[11px] font-semibold bg-error/15 text-error border-transparent">
                          Ditolak
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="px-2.5 py-0.5 text-[11px] font-semibold bg-secondary/10 text-secondary border-transparent">
                          PUBLISHED
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 text-sm text-on-surface leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {report.content}
                  </CardContent>

                  <Separator className="bg-surface-container" />

                  <CardFooter className="p-0 bg-transparent border-0 flex items-center justify-between">
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
