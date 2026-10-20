"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { parseReportContent } from "../utils/export-excel.util";
import UserAvatar from "@/src/common/components/user-avatar";
import { useUser } from "@/src/common/context/user-context";
import DeleteReportDialog from "./delete-report-dialog";

export interface ReportItemData {
  id: string;
  content: string;
  status: string;
  appreciations: number;
  division: string;
  isClockIn?: boolean;
  isLate?: boolean;
  createdAt: string | Date;
  author?: { name: string; avatar?: string | null };
  attachments?: string[];
  [key: string]: unknown;
}

interface RekapTableProps {
  reports: ReportItemData[];
  loading: boolean;
  onReportDeleted?: (reportId: string, message: string) => void;
}

export default function RekapTable({ reports, loading, onReportDeleted }: RekapTableProps) {
  const { user } = useUser();
  const isSuperadmin = user?.role === "SUPERADMIN" || user?.role === "SUPER_ADMIN";
  const [selectedReport, setSelectedReport] = useState<ReportItemData | null>(null);
  const [reportToDelete, setReportToDelete] = useState<ReportItemData | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-surface-container-low/60 border-b border-surface-container text-outline text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 text-center w-12">No</th>
              <th className="py-3.5 px-4 w-36">Waktu</th>
              <th className="py-3.5 px-4 w-44">Pegawai</th>
              <th className="py-3.5 px-4 w-32">Divisi</th>
              <th className="py-3.5 px-4 min-w-[220px]">Pekerjaan</th>
              <th className="py-3.5 px-4 min-w-[220px]">Hasil / Output</th>
              <th className="py-3.5 px-4 w-32 text-center">Status</th>
              <th className="py-3.5 px-4 text-right w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-outline text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-6 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
                    <span className="text-xs font-medium">Memuat data rekap laporan...</span>
                  </div>
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-outline text-xs">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[32px] text-outline">
                      description
                    </span>
                    <p className="font-semibold text-on-surface text-sm">
                      Tidak Ada Laporan yang Ditemukan
                    </p>
                    <p className="text-[11px] text-outline max-w-sm">
                      Coba sesuaikan filter bidang, rentang tanggal, atau kata kunci pencarian Anda.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((report, idx) => {
                const { pekerjaan, hasil } = parseReportContent(report.content || "");
                const dateObj = new Date(report.createdAt);
                const dateStr = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-";
                const timeStr = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " WIB"
                  : "";

                return (
                  <tr
                    key={report.id}
                    className="hover:bg-surface-container-low/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-outline text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface text-xs leading-tight">
                          {dateStr}
                        </span>
                        <span className="text-[11px] text-outline font-mono mt-0.5">
                          {timeStr}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={report.author?.name}
                          avatarUrl={report.author?.avatar}
                          size="xs"
                        />
                        <span className="font-bold text-on-surface text-xs sm:text-sm block">
                          {report.author?.name || "Anonim"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container text-xs font-semibold text-secondary">
                        {report.division || "-"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-on-surface-variant leading-relaxed max-w-xs">
                      <p className="line-clamp-2">{pekerjaan}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-on-surface-variant leading-relaxed max-w-xs">
                      <p className="line-clamp-2">{hasil}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {Boolean(report.isClockIn) ? (
                          <span className="text-[11px] font-bold font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            Clock-in
                          </span>
                        ) : report.isLate ? (
                          <span className="text-[11px] font-bold font-mono text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                            Terlambat
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/20">
                            Tepat Waktu
                          </span>
                        )}
                        {report.status === "PENDING_APPROVAL" && (
                          <span className="text-[10px] text-amber-500 font-medium">
                            Menunggu Verifikasi
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold text-secondary hover:bg-secondary/10 cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px] text-amber-500">lightbulb</span>
                          <span>Detail</span>
                        </Button>

                        {isSuperadmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReportToDelete(report)}
                            className="h-8 px-2 rounded-lg text-xs font-semibold text-error hover:bg-error/10 cursor-pointer flex items-center gap-0.5"
                            title="Hapus Laporan Testing (Khusus Superadmin)"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span className="hidden sm:inline">Hapus</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Laporan */}
      <Dialog
        open={Boolean(selectedReport)}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      >
        <DialogContent className="sm:max-w-lg bg-surface-container-lowest border-outline-variant p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (() => {
            const { pekerjaan, hasil } = parseReportContent(selectedReport.content || "");
            const dateObj = new Date(selectedReport.createdAt);
            const dateFormatted = !isNaN(dateObj.getTime())
              ? `${dateObj.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} • ${dateObj.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} WIB`
              : "-";

            return (
              <div className="flex flex-col gap-5">
                <DialogHeader className="p-0 flex flex-col gap-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                      Unit {selectedReport.division}
                    </span>
                    {Boolean(selectedReport.isClockIn) ? (
                      <span className="text-xs font-bold font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        Clock-in
                      </span>
                    ) : selectedReport.isLate ? (
                      <span className="text-xs font-bold font-mono text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        Terlambat
                      </span>
                    ) : (
                      <span className="text-xs font-bold font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/20">
                        Tepat Waktu
                      </span>
                    )}
                  </div>

                  <DialogTitle className="text-lg font-bold text-on-surface">
                    {selectedReport.author?.name || "Pegawai"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-outline font-mono">
                    {dateFormatted}
                  </DialogDescription>
                </DialogHeader>

                <Separator className="bg-surface-container" />

                <div className="flex flex-col gap-4 text-xs sm:text-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-outline uppercase tracking-wider">
                      Aktivitas / Pekerjaan:
                    </span>
                    <div className="p-3.5 rounded-xl bg-surface-container-low/50 border border-outline-variant/40 text-on-surface whitespace-pre-wrap leading-relaxed">
                      {pekerjaan}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-outline uppercase tracking-wider">
                      Hasil / Capaian Output:
                    </span>
                    <div className="p-3.5 rounded-xl bg-surface-container-low/50 border border-outline-variant/40 text-on-surface whitespace-pre-wrap leading-relaxed">
                      {hasil}
                    </div>
                  </div>

                  {selectedReport.attachments &&
                    Array.isArray(selectedReport.attachments) &&
                    selectedReport.attachments.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider">
                          Foto Dokumentasi:
                        </span>
                        <div className="rounded-xl overflow-hidden border border-outline-variant max-h-64 bg-surface-variant">
                          <img
                            src={selectedReport.attachments[0] as string}
                            alt="Dokumentasi Kerja"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                  {isSuperadmin && (
                    <div className="pt-2 border-t border-outline-variant/40 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const current = selectedReport;
                          setSelectedReport(null);
                          setReportToDelete(current);
                        }}
                        className="text-error hover:bg-error/10 text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Hapus Laporan Testing Ini</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus Laporan oleh Superadmin */}
      <DeleteReportDialog
        open={Boolean(reportToDelete)}
        report={reportToDelete}
        onOpenChange={(open) => !open && setReportToDelete(null)}
        onSuccess={(deletedId, message) => {
          setReportToDelete(null);
          if (selectedReport?.id === deletedId) {
            setSelectedReport(null);
          }
          if (onReportDeleted) {
            onReportDeleted(deletedId, message);
          }
        }}
      />
    </>
  );
}
