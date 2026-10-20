"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteReportAction } from "../actions/delete-report.action";
import { parseReportContent } from "../utils/export-excel.util";
import type { ReportItemData } from "./rekap-table";

export interface DeleteReportDialogProps {
  report: ReportItemData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (deletedReportId: string, message: string) => void;
}

export default function DeleteReportDialog({
  report,
  open,
  onOpenChange,
  onSuccess,
}: DeleteReportDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!report) return null;

  const { pekerjaan } = parseReportContent(report.content || "");
  const dateObj = new Date(report.createdAt);
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const handleDelete = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await deleteReportAction({ reportId: report.id });
      if (res.success) {
        onSuccess(
          report.id,
          res.message || `Laporan amil "${report.author?.name || "Amil"}" berhasil dihapus permanen.`
        );
        onOpenChange(false);
      } else {
        setError(res.message || "Gagal menghapus laporan.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus laporan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !submitting && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-6 rounded-2xl">
        <DialogHeader className="flex flex-col gap-1 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-error/10 border border-error/25 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-[20px]">
                delete_forever
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-on-surface">
              Hapus Laporan Permanen
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Konfirmasi hapus laporan amil
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert
            variant="destructive"
            className="my-1 border-error/20 bg-error/10 text-error text-xs rounded-xl"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Ringkasan Laporan */}
        <div className="bg-surface-container-low/70 border border-outline-variant/60 rounded-xl p-3.5 flex flex-col gap-2 my-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-outline font-medium">Pegawai:</span>
            <span className="font-semibold text-on-surface">{report.author?.name || "Anonim"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-outline font-medium">Divisi & Tanggal:</span>
            <span className="text-on-surface font-medium">
              {report.division || "-"} • {dateStr}
            </span>
          </div>
          <div className="flex flex-col gap-1 pt-1 border-t border-outline-variant/40">
            <span className="text-outline font-medium">Aktivitas Pekerjaan:</span>
            <p className="text-on-surface-variant line-clamp-2 leading-relaxed">{pekerjaan}</p>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-xl border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface text-xs cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={submitting}
            onClick={handleDelete}
            className="h-9 px-4 rounded-xl bg-error hover:bg-error/90 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Hapus Permanen</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
