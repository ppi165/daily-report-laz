"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClockInReport } from "../types/approval.types";
import { reviseClockInAction } from "../actions/revise-clock-in.action";

interface ReviseClockInDialogProps {
  report: ClockInReport | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function ReviseClockInDialog({
  report,
  onClose,
  onSuccess,
}: ReviseClockInDialogProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (report) {
      setContent(report.content || "");
      setError(null);
    }
  }, [report]);

  if (!report) return null;

  const rejectedApprovals = (report.approvals || []).filter(
    (a) => a.status === "REJECTED"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await reviseClockInAction({
        reportId: report.id,
        content: content.trim(),
      });

      if (res.success) {
        onSuccess(res.message || "Laporan berhasil diajukan ulang.");
        onClose();
      } else {
        setError(res.message || "Gagal mengajukan ulang laporan.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(report)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-surface-container-lowest border-outline-variant p-6 rounded-2xl">
        <DialogHeader className="flex flex-col gap-1 pb-2">
          <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              edit_note
            </span>
            Revisi & Ajukan Ulang Laporan Clock-In
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant leading-relaxed">
            Perbaiki isi rincian tugas atau hasil pekerjaan Anda sesuai catatan saksi verifikator, lalu ajukan kembali.
          </DialogDescription>
        </DialogHeader>

        {/* Catatan Penolakan dari Saksi */}
        {rejectedApprovals.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-error/10 border border-error/20">
            <span className="text-[11px] font-bold text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">info</span>
              Catatan Penolakan Verifikator:
            </span>
            {rejectedApprovals.map((app) => (
              <p key={app.id} className="text-xs text-on-surface italic pl-5">
                • <strong>{app.approverName}:</strong> &quot;{app.note || "Tidak memenuhi kriteria"}&quot;
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Isi Laporan / Rincian Pekerjaan (Revisi)
            </label>
            <Textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Perbarui rincian pekerjaan Anda..."
              className="rounded-xl bg-surface-container-low/50 border-outline-variant text-xs text-on-surface leading-relaxed p-3 focus-visible:ring-1 focus-visible:ring-secondary"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-error font-medium">{error}</p>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={onClose}
              className="h-9 px-4 rounded-xl border-outline-variant text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!content.trim() || submitting}
              className="h-9 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              {submitting ? "Mengajukan Ulang..." : "Ajukan Ulang ke Verifikator"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
