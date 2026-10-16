"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import SuccessToast from "@/src/common/components/success-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getClockInReportsAction } from "../actions/get-clock-in-reports.action";
import { respondApprovalAction } from "../actions/respond-approval.action";
import { ClockInReport } from "../types/approval.types";

export default function ApprovalView() {
  const [reports, setReports] = useState<ClockInReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [rejectingApprovalId, setRejectingApprovalId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const loadData = async () => {
    try {
      const res = await getClockInReportsAction();
      if (res.success && res.data) {
        setReports(res.data as unknown as ClockInReport[]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await getClockInReportsAction();
        if (!ignore && res.success && res.data) {
          setReports(res.data as unknown as ClockInReport[]);
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

  const handleApprove = async (approvalId: string) => {
    setSubmitting(true);
    try {
      const res = await respondApprovalAction({
        approvalId,
        action: "APPROVE",
      });

      if (res.success) {
        setToastMessage({
          title: "Persetujuan Dicatat",
          desc: res.message || "Persetujuan verifikator telah disimpan.",
        });
        await loadData();
      } else {
        alert(res.message || "Gagal menyetujui pengajuan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingApprovalId) return;
    setSubmitting(true);
    try {
      const res = await respondApprovalAction({
        approvalId: rejectingApprovalId,
        action: "REJECT",
        note: rejectionNote.trim() || "Ditolak oleh verifikator",
      });

      if (res.success) {
        setToastMessage({
          title: "Pengajuan Ditolak",
          desc: res.message || "Pengajuan telah ditolak.",
        });
        setRejectingApprovalId(null);
        setRejectionNote("");
        await loadData();
      } else {
        alert(res.message || "Gagal menolak pengajuan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((rep) => {
    if (activeTab === "pending") return rep.status === "PENDING_APPROVAL";
    if (activeTab === "published") return rep.status === "PUBLISHED";
    if (activeTab === "rejected") return rep.status === "REJECTED";
    return true;
  });

  const pendingCount = reports.filter((r) => r.status === "PENDING_APPROVAL").length;

  return (
    <AppShell headerTitle="Persetujuan Clock-in" headerBadge="Verifikasi Tim">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                Verifikasi Clock-in Daily Report
              </h1>
              <p className="text-sm text-on-surface-variant">
                Alur persetujuan laporan susulan oleh 2 orang rekan kerja / atasan sebagai saksi akuntabilitas amil.
              </p>
            </div>

            {pendingCount > 0 && (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 px-3 py-1.5 text-xs font-semibold self-start sm:self-auto">
                <span>{pendingCount} Menunggu Persetujuan</span>
              </Badge>
            )}
          </div>

          {/* Banner Konsensus Menggunakan shadcn Alert */}
          <Alert className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs">
            <AlertDescription className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Aturan Konsensus (Opsi 1):</span> Laporan Clock-in hanya resmi diterbitkan (<span className="font-semibold text-secondary">PUBLISHED</span>) jika kedua verifikator (2 dari 2) telah memberikan persetujuan. Jika salah satu menolak, status laporan otomatis menjadi <span className="font-semibold text-error">REJECTED</span>.
            </AlertDescription>
          </Alert>

          {/* Filter Tab */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-surface-container rounded-xl p-1 h-auto flex flex-wrap gap-1">
              <TabsTrigger value="all" className="rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Semua ({reports.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Menunggu ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="published" className="rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Disetujui ({reports.filter((r) => r.status === "PUBLISHED").length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Ditolak ({reports.filter((r) => r.status === "REJECTED").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-5 flex flex-col gap-5">
              {loading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-44 w-full rounded-2xl" />
                  <Skeleton className="h-44 w-full rounded-2xl" />
                </div>
              ) : filteredReports.length === 0 ? (
                <Card className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-10 text-center">
                  <CardContent className="p-0 flex flex-col items-center justify-center gap-1">
                    <h3 className="text-base font-bold text-on-surface">Tidak Ada Pengajuan</h3>
                    <p className="text-xs sm:text-sm text-outline max-w-sm">
                      Belum ada laporan clock-in susulan pada kategori ini.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => {
                  const approvedCount = report.approvals.filter((a) => a.status === "APPROVED").length;

                  return (
                    <Card
                      key={report.id}
                      className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4"
                    >
                      {/* Kartu Header Semantik */}
                      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0">
                            {report.author?.name ? report.author.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-sm sm:text-base font-bold text-on-surface">
                                {report.author?.name || "Pegawai"}
                              </CardTitle>
                              <Badge variant="secondary" className="bg-surface-container text-on-surface-variant text-[11px] font-semibold border-transparent">
                                {report.division}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-outline mt-0.5">
                              <span className="font-mono">
                                Tanggal Tugas: {new Date(report.createdAt).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {report.status === "PUBLISHED" ? (
                            <Badge className="bg-secondary/15 text-secondary border-secondary/30 px-3 py-1 text-xs font-semibold">
                              <span>Disetujui (2/2) • PUBLISHED</span>
                            </Badge>
                          ) : report.status === "REJECTED" ? (
                            <Badge className="bg-error/15 text-error border-error/30 px-3 py-1 text-xs font-semibold">
                              <span>Ditolak • REJECTED</span>
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 px-3 py-1 text-xs font-semibold">
                              <span>Menunggu Verifikasi ({approvedCount}/2)</span>
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <Separator className="bg-surface-container" />

                      {/* Isi Konten */}
                      <CardContent className="p-0 flex flex-col gap-4">
                        <div className="text-xs sm:text-sm text-on-surface-variant whitespace-pre-line leading-relaxed bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/40">
                          {report.content}
                        </div>

                        {/* Foto Dokumentasi jika ada */}
                        {report.attachments && report.attachments.length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-on-surface block">
                              Lampiran Dokumentasi
                            </span>
                            <div className="size-24 sm:size-28 rounded-xl overflow-hidden border border-outline-variant bg-surface-variant">
                              <img
                                src={report.attachments[0]}
                                alt="Dokumentasi Pekerjaan"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>

                      {/* Status Persetujuan Kedua Verifikator di CardFooter */}
                      <CardFooter className="p-0 border-t-0 bg-transparent flex flex-col items-stretch gap-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                          Status Persetujuan 2 Verifikator:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                          {report.approvals.map((approval, idx) => (
                            <div
                              key={approval.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                approval.status === "APPROVED"
                                  ? "bg-secondary/5 border-secondary/30"
                                  : approval.status === "REJECTED"
                                  ? "bg-error/5 border-error/30"
                                  : "bg-surface-container-lowest border-outline-variant"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-on-surface">
                                      Verifikator {idx + 1}: {approval.approverName}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-outline">
                                    {approval.approverDivision ? `Divisi ${approval.approverDivision}` : "Rekan Kerja"}
                                  </p>
                                </div>

                                {/* Status Pill */}
                                <div>
                                  {approval.status === "APPROVED" ? (
                                    <span className="inline-flex items-center text-[11px] font-semibold text-secondary px-2 py-0.5 rounded bg-secondary/15">
                                      Disetujui
                                    </span>
                                  ) : approval.status === "REJECTED" ? (
                                    <span className="inline-flex items-center text-[11px] font-semibold text-error px-2 py-0.5 rounded bg-error/15">
                                      Ditolak
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-500/15">
                                      Menunggu
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Alasan jika ditolak */}
                              {approval.status === "REJECTED" && approval.note && (
                                <p className="text-[11px] text-error mt-2 italic">
                                  Alasan: &quot;{approval.note}&quot;
                                </p>
                              )}

                              {/* Tombol Simulasi Persetujuan jika PENDING */}
                              {approval.status === "PENDING" && report.status === "PENDING_APPROVAL" && (
                                <div className="flex flex-col gap-2 pt-3 mt-2">
                                  <Separator className="bg-surface-container" />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      disabled={submitting}
                                      onClick={() => handleApprove(approval.id)}
                                      className="h-8 px-3 text-xs bg-secondary hover:bg-secondary/90 text-white rounded-lg flex items-center cursor-pointer font-semibold"
                                    >
                                      <span data-icon="inline-start" className="material-symbols-outlined text-[15px]">check</span>
                                      <span>Setujui</span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={submitting}
                                      onClick={() => {
                                        setRejectingApprovalId(approval.id);
                                        setRejectionNote("");
                                      }}
                                      className="h-8 px-3 text-xs border-error/40 text-error hover:bg-error/10 rounded-lg flex items-center cursor-pointer font-semibold"
                                    >
                                      <span data-icon="inline-start" className="material-symbols-outlined text-[15px]">close</span>
                                      <span>Tolak</span>
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>

          {toastMessage && (
            <SuccessToast
              title={toastMessage.title}
              description={toastMessage.desc}
              onClose={() => setToastMessage(null)}
            />
          )}

          {/* Dialog Input Alasan Penolakan */}
          <Dialog
            open={Boolean(rejectingApprovalId)}
            onOpenChange={(open) => {
              if (!open) setRejectingApprovalId(null);
            }}
          >
            <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-on-surface">
                  Tolak Pengajuan Laporan Clock-in
                </DialogTitle>
                <DialogDescription className="text-xs text-on-surface-variant">
                  Penolakan ini akan langsung membatalkan pengajuan laporan susulan. Berikan catatan atau alasan penolakan.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 py-2">
                <Input
                  placeholder="Misal: Bukti dokumentasi tidak sesuai atau tanggal keliru..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="text-xs sm:text-sm h-11 bg-surface-container-lowest border-outline-variant"
                />
              </div>

              <DialogFooter className="flex sm:justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setRejectingApprovalId(null)}
                  disabled={submitting}
                  className="text-xs h-9 cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  disabled={submitting}
                  className="bg-error hover:bg-error/90 text-white text-xs h-9 font-semibold cursor-pointer"
                >
                  {submitting ? "Memproses..." : "Konfirmasi Tolak"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </AppShell>
  );
}
