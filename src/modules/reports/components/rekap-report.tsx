"use client";

import { useState, useEffect, useMemo } from "react";
import AppShell from "@/src/common/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportReportsToExcel } from "../utils/export-excel.util";
import { toast } from "@/components/ui/toast";
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

function getWIBDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

export default function RekapReport() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [divisionsList, setDivisionsList] = useState<string[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Filter Tanggal State
  const [period, setPeriod] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [exporting, setExporting] = useState<boolean>(false);

  // Muat daftar divisi satu kali saat mount
  useEffect(() => {
    let ignore = false;
    async function loadDivisions() {
      try {
        const divRes = await fetch("/api/v1/divisions");
        if (!ignore && divRes.ok) {
          const json = await divRes.json();
          if (json.data && Array.isArray(json.data)) {
            setDivisionsList(json.data.map((d: { name: string }) => d.name));
          }
        }
      } catch {
        // Fallback hening
      }
    }
    loadDivisions();
    return () => {
      ignore = true;
    };
  }, []);

  // Ambil laporan dari database dengan parameter filter & batas kuota hingga 1000 data
  useEffect(() => {
    let ignore = false;
    async function fetchReports() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "1000");
        if (selectedDivision && selectedDivision !== "ALL") {
          params.set("division", selectedDivision);
        }
        if (startDate) {
          params.set("startDate", startDate);
        }
        if (endDate) {
          params.set("endDate", endDate);
        }

        const repRes = await fetch(`/api/v1/reports?${params.toString()}`);
        if (!ignore && repRes.ok) {
          const json = await repRes.json();
          if (json.data) setReports(json.data);
        }
      } catch {
        // Fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchReports();
    return () => {
      ignore = true;
    };
  }, [selectedDivision, startDate, endDate]);

  const handleReportDeleted = (deletedReportId: string, message: string) => {
    setReports((prev) => prev.filter((r) => r.id !== deletedReportId));
    toast.success(message, "Laporan Dihapus");
  };

  const handlePeriodChange = (val: string | null) => {
    if (!val) return;
    setPeriod(val);
    const now = new Date();

    if (val === "ALL") {
      setStartDate("");
      setEndDate("");
    } else if (val === "TODAY") {
      const todayStr = getWIBDateString(now);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (val === "7DAYS") {
      const past = new Date(now);
      past.setDate(now.getDate() - 6);
      setStartDate(getWIBDateString(past));
      setEndDate(getWIBDateString(now));
    } else if (val === "THIS_MONTH") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(getWIBDateString(firstDay));
      setEndDate(getWIBDateString(lastDay));
    } else if (val === "CUSTOM") {
      if (!startDate) setStartDate(getWIBDateString(now));
      if (!endDate) setEndDate(getWIBDateString(now));
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchDivision =
        selectedDivision === "ALL" || r.division === selectedDivision;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.content.toLowerCase().includes(q) ||
        r.author?.name.toLowerCase().includes(q);

      let matchDate = true;
      if (startDate || endDate) {
        const reportDateStr = getWIBDateString(new Date(r.createdAt));
        if (startDate && reportDateStr < startDate) matchDate = false;
        if (endDate && reportDateStr > endDate) matchDate = false;
      }

      return matchDivision && matchSearch && matchDate;
    });
  }, [reports, selectedDivision, searchQuery, startDate, endDate]);

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

  const dateRangeLabel = useMemo(() => {
    if (period === "ALL" && !startDate && !endDate) return "Semua_Waktu";
    if (startDate && endDate) {
      if (startDate === endDate) return startDate;
      return `${startDate}_sd_${endDate}`;
    }
    if (startDate) return `sejak_${startDate}`;
    if (endDate) return `sd_${endDate}`;
    return "Periode";
  }, [period, startDate, endDate]);

  const handleExportExcel = async () => {
    if (exporting || filteredReports.length === 0) return;
    try {
      setExporting(true);
      await exportReportsToExcel(filteredReports, selectedDivision, dateRangeLabel);
    } catch (err) {
      console.error("Gagal export excel:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell headerTitle="Rekap Daily Report LAZ Persis" headerBadge={selectedDivision === "ALL" ? "Semua Bidang" : `Unit ${selectedDivision}`}>
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="max-w-[1240px] w-full flex flex-col gap-6">
          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight">
              Rekap Daily Report
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1.5">
              Lihat aktivitas, sinergi, dan kontribusi seluruh rekan kerja di berbagai bidang LAZ Persis.
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
                    Update real-time lembaga
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

          {/* Filter Bar: Periode, Tanggal Kustom, Divisi, Search, & Export */}
          <Card className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/60 shadow-xs">
            <CardContent className="p-0 w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 flex-1">
                {/* Preset Periode */}
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-surface-container-lowest border-outline-variant text-on-surface rounded-xl text-sm h-10">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="ALL">Semua Waktu</SelectItem>
                      <SelectItem value="TODAY">Hari Ini</SelectItem>
                      <SelectItem value="7DAYS">7 Hari Terakhir</SelectItem>
                      <SelectItem value="THIS_MONTH">Bulan Ini</SelectItem>
                      <SelectItem value="CUSTOM">Rentang Kustom</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Input Tanggal Kustom */}
                {period === "CUSTOM" && (
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant rounded-xl w-full sm:w-[140px]"
                      title="Tanggal Mulai"
                    />
                    <span className="text-xs text-outline font-medium px-0.5">s.d.</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant rounded-xl w-full sm:w-[140px]"
                      title="Tanggal Selesai"
                    />
                  </div>
                )}

                {/* Filter Divisi */}
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

                {/* Pencarian */}
                <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
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

              {/* Tombol Export Excel */}
              <Button
                variant="outline"
                type="button"
                onClick={handleExportExcel}
                disabled={loading || exporting || filteredReports.length === 0}
                className="w-full lg:w-auto border-secondary/40 text-secondary hover:bg-secondary/10 text-xs sm:text-sm font-semibold px-4 h-10 rounded-xl flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${exporting ? "animate-spin" : ""}`}>
                  {exporting ? "progress_activity" : "download"}
                </span>
                <span>{exporting ? "Mengekspor..." : "Export Excel"}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Tabel Rekap Data */}
          <RekapTable
            reports={filteredReports}
            loading={loading}
            onReportDeleted={handleReportDeleted}
          />
        </div>
      </main>
    </AppShell>
  );
}
