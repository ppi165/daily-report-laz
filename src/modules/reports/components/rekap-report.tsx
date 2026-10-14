"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/v1/reports");
        const result = await res.json();
        if (result.success) {
          setReports(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <AppShell headerTitle="Rekap Daily Report LAZ Persis" headerBadge="Unit Humas">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="max-w-[1240px] w-full space-y-6">
          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Rekap Daily Report
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Lihat aktivitas, sinergi, dan kontribusi seluruh rekan kerja di
              berbagai bidang LAZ Persis.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant custom-shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-surface-container">
              <div className="relative pl-4 border-l-4 border-primary">
                <div className="text-3xl text-primary font-bold tracking-tight">
                  86
                </div>
                <div className="text-sm text-on-surface-variant mt-0.5 font-medium">
                  Total Report Periode Ini
                </div>
                <div className="text-xs text-secondary flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    trending_up
                  </span>
                  <span>+18% dari pekan lalu</span>
                </div>
              </div>

              <div className="relative pl-4 border-l-4 border-primary-container">
                <div className="text-3xl text-on-surface font-bold tracking-tight">
                  14
                </div>
                <div className="text-sm text-on-surface-variant mt-0.5 font-medium">
                  Pegawai Aktif Melapor
                </div>
                <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    group
                  </span>
                  <span>Total 15 staf terdaftar</span>
                </div>
              </div>

              <div className="relative pl-4 border-l-4 border-secondary">
                <div className="text-3xl text-secondary font-bold tracking-tight">
                  92%
                </div>
                <div className="text-sm text-on-surface-variant mt-0.5 font-medium">
                  Kelengkapan Pelaporan
                </div>
                <div className="text-xs text-secondary flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>
                  <span>Sangat Baik (Amanah)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h2 className="text-lg text-on-surface font-semibold">
                  Distribusi Laporan per Bidang
                </h2>
                <span className="text-xs text-on-surface-variant">
                  Update real-time pekan ini
                </span>
              </div>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#076437]"></span>
                      Humas
                    </span>
                    <span className="font-semibold text-primary">24 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#076437] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#09914F]"></span>
                      Program
                    </span>
                    <span className="font-semibold text-secondary">20 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "83.3%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                      Sekretariat
                    </span>
                    <span className="font-semibold text-on-surface">16 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary-container opacity-85 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "66.6%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      Keuangan
                    </span>
                    <span className="font-semibold text-on-surface">12 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-secondary opacity-75 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      SDM
                    </span>
                    <span className="font-semibold text-on-surface">10 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary opacity-70 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "41.6%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-outline"></span>
                      IT
                    </span>
                    <span className="font-semibold text-on-surface">4 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-outline h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "16.6%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant custom-shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  aria-label="Pilih Periode"
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-2 pr-9 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>Hari Ini</option>
                  <option>Mingguan</option>
                  <option>Bulanan</option>
                  <option>Custom</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-outline text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              <div className="relative">
                <select
                  aria-label="Pilih Rentang Tanggal"
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-2 pr-9 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>21 – 27 September 2026</option>
                  <option>14 – 20 September 2026</option>
                  <option>07 – 13 September 2026</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-outline text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              <div className="relative">
                <select
                  aria-label="Filter Bidang"
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-2 pr-9 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>Semua Bidang</option>
                  <option>Humas</option>
                  <option>Program</option>
                  <option>Sekretariat</option>
                  <option>Keuangan</option>
                  <option>SDM</option>
                  <option>IT</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-outline text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>

              <div className="relative min-w-[260px] w-full sm:w-auto mt-2 sm:mt-0">
                <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                  placeholder="Cari nama pegawai atau isi report..."
                  type="text"
                />
              </div>
            </div>

            <button className="w-full sm:w-auto bg-surface-container-lowest border border-primary-container text-primary-container hover:bg-[#F0FDF4] text-sm font-medium px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span>Export Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant custom-shadow-card custom-shadow-hover transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-surface-container">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-lg">
                          {report.author?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-base font-semibold text-on-surface leading-tight">
                              {report.author?.name || 'Anonim'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface-variant w-max">
                              {report.division}
                            </span>
                          </div>
                          <span className="text-xs text-on-surface-variant block mt-0.5">
                            {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(report.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(9,145,79,0.10)] text-secondary">
                        {report.status}
                      </span>
                    </div>

                    <div className="text-sm text-on-surface mb-4 leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {report.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF8F0] text-[#B45309] border border-[#FFEDD5] hover:bg-[#FFEDD5] transition-colors text-xs font-semibold cursor-pointer">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      <span>{report.appreciations} Apresiasi</span>
                    </button>
                    <a
                      className="text-sm font-medium text-primary hover:text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-surface-container-lowest rounded-2xl p-6 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
                  <span className="material-symbols-outlined text-[28px]">
                    description
                  </span>
                </div>
                <h3 className="text-base text-on-surface mb-1 font-semibold">
                  Belum Ada Daily Report
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs mb-5">
                  Belum ada laporan yang dipublikasikan pada periode yang dipilih.
                </p>
                <a href="/daily-report" className="px-4 py-2 bg-primary-container text-white rounded-xl text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Buat Daily Report</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
