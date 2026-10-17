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
import { exportReportsToExcel } from "../utils/export-excel.util";
import RekapTable from "./rekap-table";

interface ReportData {
  id: string;
  content: string;
  status: string;
  appreciations: number;
  division: string;
  isClockIn?: boolean;
  isLate?: boolean;
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
                type="button"
                onClick={() => exportReportsToExcel(filteredReports, selectedDivision)}
                disabled={loading || filteredReports.length === 0}
                className="w-full lg:w-auto border-secondary/40 text-secondary hover:bg-secondary/10 text-xs sm:text-sm font-semibold px-4 h-10 rounded-xl flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export Excel</span>
              </Button>
            </CardContent>
          </Card>

          <RekapTable reports={filteredReports} loading={loading} />
        </div>
      </main>
    </AppShell>
  );
}
