"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import SuccessToast from "@/src/common/components/success-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
import { getCurrentUserAction } from "@/src/modules/users/actions/get-current-user.action";
import { ClockInReport } from "../types/approval.types";

export default function ApprovalView() {
  const [reports, setReports] = useState<ClockInReport[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: string;
    division?: string;
  } | null>(null);
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
        const [repRes, userRes] = await Promise.all([
          getClockInReportsAction(),
          getCurrentUserAction(),
        ]);
        if (!ignore) {
          if (repRes.success && repRes.data) {
            const data = repRes.data as unknown as ClockInReport[];
            setReports(data);

            if (userRes.success && userRes.data) {
              const u = userRes.data as { id: string; name: string; role: string; division?: string };
              setCurrentUser(u);

              const hasAction = data.some(
                (r) =>
                  r.status === "PENDING_APPROVAL" &&
                  r.approvals.some(
                    (a) => a.status === "PENDING" && (a.approverId === u.id || a.approverMockId === u.id)
                  )
              );
              if (hasAction) {
                setActiveTab("my-action");
              }
            }
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

  const myActionReports = reports.filter(
    (rep) =>
      rep.status === "PENDING_APPROVAL" &&
      rep.approvals.some(
        (a) =>
          a.status === "PENDING" &&
          (a.approverId === currentUser?.id || a.approverMockId === currentUser?.id)
      )
  );

  const filteredReports = reports.filter((rep) => {
    if (activeTab === "my-action") {
      return (
        rep.status === "PENDING_APPROVAL" &&
        rep.approvals.some(
          (a) =>
            a.status === "PENDING" &&
            (a.approverId === currentUser?.id || a.approverMockId === currentUser?.id)
        )
      );
    }
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

            {myActionReports.length > 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{myActionReports.length} Menunggu Persetujuan Anda</span>
              </div>
            ) : pendingCount > 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-outline self-start sm:self-auto">
                <span className="size-2 rounded-full bg-outline/50"></span>
                <span>{pendingCount} Total Menunggu Verifikasi</span>
              </div>
            ) : null}
          </div>

          {/* Banner Konsensus Menggunakan shadcn Alert */}
          <Alert className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs">
            <AlertDescription className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Aturan Konsensus:</span> Laporan Clock-in hanya resmi diterbitkan (<span className="font-semibold text-secondary">PUBLISHED</span>) jika kedua verifikator (2 dari 2) telah memberikan persetujuan. Jika salah satu menolak, status laporan otomatis menjadi <span className="font-semibold text-error">REJECTED</span>.
            </AlertDescription>
          </Alert>

          {/* Filter Tab */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-surface-container-low/80 border border-outline-variant/60 rounded-xl p-1 h-auto flex flex-wrap sm:inline-flex items-center w-full sm:w-fit gap-1">
              <TabsTrigger value="my-action" className="flex-1 sm:flex-initial rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Perlu Tindakan Saya ({myActionReports.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex-1 sm:flex-initial rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Semua ({reports.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 sm:flex-initial rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Menunggu ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="published" className="flex-1 sm:flex-initial rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
                Disetujui ({reports.filter((r) => r.status === "PUBLISHED").length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex-1 sm:flex-initial rounded-lg text-xs font-semibold py-2 px-3.5 cursor-pointer">
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
                    <span className="material-symbols-outlined text-[32px] text-outline mb-1">
                      verified_user
                    </span>
                    <h3 className="text-base font-bold text-on-surface">Tidak Ada Pengajuan</h3>
                    <p className="text-xs sm:text-sm text-outline max-w-sm">
                      {activeTab === "my-action"
                        ? "Tidak ada pengajuan clock-in yang membutuhkan persetujuan Anda saat ini."
                        : "Belum ada laporan clock-in susulan pada kategori ini."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => {
                  const approvedCount = report.approvals.filter((a) => a.status === "APPROVED").length;
                  const isMyReport = Boolean(
                    currentUser &&
                      (report.authorId === currentUser.id || report.author?.id === currentUser.id)
                  );

                  return (
                    <Card
                      key={report.id}
                      className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5 hover:border-outline-variant transition-colors"
                    >
                      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0">
                            {report.author?.name ? report.author.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-sm sm:text-base font-bold text-on-surface">
                                {report.author?.name || "Pegawai"}
                              </CardTitle>
                              <span className="text-xs font-semibold text-secondary tracking-wide">
                                • {report.division}
                              </span>
                              {isMyReport && (
                                <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/20">
                                  Pengajuan Anda
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-outline mt-0.5">
                              <span className="font-mono">
                                Tanggal Tugas: {new Date(report.createdAt).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Label */}
                        <div className="flex items-center">
                          {report.status === "PUBLISHED" ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-secondary font-mono tracking-wide">
                              <span className="size-1.5 rounded-full bg-secondary"></span>
                              Disetujui ({approvedCount}/2) • PUBLISHED
                            </span>
                          ) : report.status === "REJECTED" ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-error font-mono tracking-wide">
                              <span className="size-1.5 rounded-full bg-error"></span>
                              Ditolak • REJECTED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 font-mono tracking-wide">
                              <span className="size-1.5 rounded-full bg-amber-500"></span>
                              Menunggu Verifikasi ({approvedCount}/2)
                            </span>
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
                      <CardFooter className="p-0 pb-1 border-t-0 bg-transparent flex flex-col items-stretch gap-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                          Status Persetujuan 2 Verifikator:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                          {report.approvals.map((approval, idx) => {
                            const isDesignatedApprover = Boolean(
                              currentUser &&
                                (approval.approverId === currentUser.id ||
                                  approval.approverMockId === currentUser.id)
                            );
                            const isPrivileged = Boolean(
                              currentUser &&
                                (currentUser.role === "ADMIN" ||
                                  currentUser.role === "SUPER_ADMIN" ||
                                  currentUser.role === "SUPERVISOR")
                            );
                            const canRespond = isDesignatedApprover || isPrivileged;

                            return (
                              <div
                                key={approval.id}
                                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                  approval.status === "APPROVED"
                                    ? "bg-secondary/5 border-secondary/30"
                                    : approval.status === "REJECTED"
                                    ? "bg-error/5 border-error/30"
                                    : isDesignatedApprover
                                    ? "bg-amber-500/5 border-amber-500/30"
                                    : "bg-surface-container-lowest border-outline-variant"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-on-surface">
                                        Verifikator {idx + 1}: {approval.approverName}
                                      </span>
                                      {isDesignatedApprover && (
                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                          Anda
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-outline">
                                      {approval.approverDivision ? `Divisi ${approval.approverDivision}` : "Rekan Kerja"}
                                    </p>
                                  </div>

                                  {/* Status Label */}
                                  <div>
                                    {approval.status === "APPROVED" ? (
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary">
                                          <span className="size-1.5 rounded-full bg-secondary"></span>
                                          Disetujui
                                        </span>
                                        {approval.isOverridden && (
                                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-mono">
                                            Disetujui oleh Admin: {approval.respondedByName || "Admin"}
                                          </span>
                                        )}
                                      </div>
                                    ) : approval.status === "REJECTED" ? (
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-error">
                                          <span className="size-1.5 rounded-full bg-error"></span>
                                          Ditolak
                                        </span>
                                        {approval.isOverridden && (
                                          <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded-md border border-error/20 font-mono">
                                            Ditolak oleh Admin: {approval.respondedByName || "Admin"}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                        <span className="size-1.5 rounded-full bg-amber-500"></span>
                                        Menunggu
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Alasan jika ditolak */}
                                {approval.status === "REJECTED" && approval.note && (
                                  <p className="text-[11px] text-error italic">
                                    Alasan: &quot;{approval.note}&quot;
                                  </p>
                                )}

                                {/* Tombol Aksi Persetujuan jika status PENDING */}
                                {approval.status === "PENDING" && report.status === "PENDING_APPROVAL" && (
                                  <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/40">
                                    {canRespond ? (
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                          size="sm"
                                          disabled={submitting}
                                          onClick={() => handleApprove(approval.id)}
                                          className="h-9 px-3.5 text-xs bg-secondary hover:bg-secondary/90 text-white rounded-xl flex items-center cursor-pointer font-semibold shadow-xs"
                                        >
                                          <span data-icon="inline-start" className="material-symbols-outlined text-[16px]">check</span>
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
                                          className="h-9 px-3.5 text-xs border-error/40 text-error hover:bg-error/10 rounded-xl flex items-center cursor-pointer font-semibold"
                                        >
                                          <span data-icon="inline-start" className="material-symbols-outlined text-[16px]">close</span>
                                          <span>Tolak</span>
                                        </Button>
                                        {isPrivileged && !isDesignatedApprover && (
                                          <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 font-mono">
                                            Akses Admin Override
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-[11px] text-outline italic">
                                        Menunggu respon verifikasi dari {approval.approverName}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
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

          {/* Modal Konfirmasi Penolakan Menggunakan shadcn Dialog */}
          <Dialog
            open={Boolean(rejectingApprovalId)}
            onOpenChange={(open) => {
              if (!open) {
                setRejectingApprovalId(null);
                setRejectionNote("");
              }
            }}
          >
            <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-6 rounded-2xl">
              <DialogHeader className="flex flex-col gap-1 pb-2">
                <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[20px]">
                    warning
                  </span>
                  Tolak Pengajuan Clock-In
                </DialogTitle>
                <DialogDescription className="text-xs text-on-surface-variant leading-relaxed">
                  Harap masukkan catatan atau alasan penolakan. Penolakan dari salah satu verifikator akan langsung menggugurkan penerbitan laporan ini.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 py-2">
                <Input
                  placeholder="Contoh: Bukti foto tidak sesuai / kegiatan tidak terverifikasi..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="h-10 rounded-xl bg-surface-container-lowest border-outline-variant text-xs text-on-surface"
                />
              </div>

              <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRejectingApprovalId(null);
                    setRejectionNote("");
                  }}
                  className="h-9 px-4 rounded-xl border-outline-variant text-xs cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={submitting}
                  onClick={handleConfirmReject}
                  className="h-9 px-4 rounded-xl bg-error hover:bg-error/90 text-white font-semibold text-xs transition-colors cursor-pointer"
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
