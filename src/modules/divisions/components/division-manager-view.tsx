"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import SuccessToast from "@/src/common/components/success-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDivisionsAction,
  createDivisionAction,
  updateDivisionAction,
  deleteDivisionAction,
} from "../index";

interface DivisionItem {
  id: string;
  name: string;
  description: string | null;
  leaderName: string | null;
  memberCount: number;
}

export default function DivisionManagerView() {
  const [divisions, setDivisions] = useState<DivisionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State: Tambah / Edit Divisi
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<DivisionItem | null>(null);
  const [formName, setFormName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Search State
  const [searchDivision, setSearchDivision] = useState("");

  const filteredDivisions = divisions.filter((div) =>
    div.name.toLowerCase().includes(searchDivision.toLowerCase())
  );

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const loadData = async () => {
    try {
      const divRes = await getDivisionsAction();
      if (divRes.success && divRes.data) {
        setDivisions(divRes.data as DivisionItem[]);
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
        const divRes = await getDivisionsAction();
        if (!ignore && divRes.success && divRes.data) {
          setDivisions(divRes.data as DivisionItem[]);
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

  // Handler: Tambah / Edit Divisi
  const openCreateDialog = () => {
    setEditingDivision(null);
    setFormName("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (div: DivisionItem) => {
    setEditingDivision(div);
    setFormName(div.name);
    setIsDialogOpen(true);
  };

  const handleSaveDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSubmitting(true);
    try {
      if (editingDivision) {
        const res = await updateDivisionAction({
          id: editingDivision.id,
          name: formName.trim(),
        });
        if (res.success) {
          setToastMessage({ title: "Berhasil", desc: "Nama divisi berhasil diperbarui." });
          setIsDialogOpen(false);
          await loadData();
        } else {
          alert(res.message || "Gagal memperbarui divisi.");
        }
      } else {
        const res = await createDivisionAction({
          name: formName.trim(),
        });
        if (res.success) {
          setToastMessage({ title: "Berhasil", desc: "Divisi baru berhasil ditambahkan." });
          setIsDialogOpen(false);
          await loadData();
        } else {
          alert(res.message || "Gagal membuat divisi baru.");
        }
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDivision = async (div: DivisionItem) => {
    if (!confirm(`Yakin ingin menghapus divisi "${div.name}"?`)) return;

    setSubmitting(true);
    try {
      const res = await deleteDivisionAction(div.id);
      if (res.success) {
        setToastMessage({ title: "Divisi Dihapus", desc: `Divisi ${div.name} telah dihapus.` });
        await loadData();
      } else {
        alert(res.message || "Gagal menghapus divisi.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell headerTitle="Master Bidang & Divisi" headerBadge="Akses Administrator">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                Master Bidang &amp; Divisi
              </h1>
              <p className="text-sm text-on-surface-variant">
                Pengelolaan struktur bidang kerja dan unit operasional lembaga amil LAZ Persis.
              </p>
            </div>

            <Button
              onClick={openCreateDialog}
              className="bg-primary-container hover:bg-secondary text-white font-semibold rounded-xl text-sm px-5 h-11 flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px] mr-1.5">add</span>
              <span>Tambah Bidang Baru</span>
            </Button>
          </div>

          {/* Banner Otoritas */}
          <Alert className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs">
            <AlertDescription className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Pemisahan Hak Akses:</span> Halaman ini khusus untuk mengatur master struktur divisi. Untuk mutasi amil, perubahan hak akses, identitas, atau reset kata sandi, silakan akses panel terpusat di menu <strong className="text-secondary font-semibold">Kelola Pengguna</strong>.
            </AlertDescription>
          </Alert>

          {/* Search & Counter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                search
              </span>
              <Input
                placeholder="Cari nama bidang atau divisi..."
                value={searchDivision}
                onChange={(e) => setSearchDivision(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant"
              />
            </div>
            <span className="text-xs text-outline self-center sm:self-auto font-medium">
              Total {filteredDivisions.length} bidang kerja terdata
            </span>
          </div>

          {/* Tabel Master Divisi */}
          {loading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface-container-low/50 border-b border-surface-container text-outline text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6 w-14 text-center">No</th>
                      <th className="py-3.5 px-4 sm:px-6">Nama Bidang &amp; Divisi</th>
                      <th className="py-3.5 px-4 sm:px-6">Total Personil</th>
                      <th className="py-3.5 px-4 sm:px-6">Status Operasional</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/60">
                    {filteredDivisions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-outline text-xs">
                          Tidak ada data bidang / divisi yang ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredDivisions.map((div, idx) => {
                        const count = div.memberCount ?? 0;
                        return (
                          <tr key={div.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="py-3.5 px-4 sm:px-6 text-center text-outline font-mono text-xs">
                              {idx + 1}
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <div className="font-bold text-on-surface text-sm sm:text-base">
                                {div.name}
                              </div>
                              <div className="text-[11px] text-outline font-mono">
                                Unit Kerja Resmi LAZ Persis
                              </div>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <span className="font-bold text-on-surface text-sm">
                                {count}
                              </span>{" "}
                              <span className="text-outline text-xs">Amil</span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              {count > 0 ? (
                                <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full bg-secondary"></span>
                                  Aktif Beroperasi
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-outline flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full bg-outline/40"></span>
                                  Belum Ada Amil
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(div)}
                                  className="h-8 px-2.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 border-outline-variant hover:border-secondary hover:text-secondary cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[15px]">edit</span>
                                  <span className="hidden sm:inline">Edit Nama</span>
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={submitting}
                                  onClick={() => handleDeleteDivision(div)}
                                  className="h-8 px-2.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 border-outline-variant hover:border-error/50 hover:bg-error/10 hover:text-error text-on-surface-variant cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[15px]">delete</span>
                                  <span className="hidden sm:inline">Hapus</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dialog Tambah / Edit Divisi */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
              <form onSubmit={handleSaveDivision}>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      account_tree
                    </span>
                    <span>{editingDivision ? "Edit Nama Bidang" : "Tambah Bidang Baru"}</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-on-surface-variant">
                    Tentukan nama bidang atau divisi untuk pengelompokan pelaporan amil.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-on-surface">Nama Bidang / Divisi</Label>
                  <Input
                    placeholder="cth: Humas, Program, Logistik, Keuangan..."
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    autoFocus
                    className="text-xs sm:text-sm h-11 bg-surface-container-lowest border-outline-variant"
                  />
                </div>

                <DialogFooter className="flex sm:justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                    className="text-xs h-9 cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-container hover:bg-secondary text-white text-xs h-9 font-semibold cursor-pointer"
                  >
                    {submitting ? "Menyimpan..." : editingDivision ? "Simpan Perubahan" : "Tambah Bidang"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Toast Notification */}
          {toastMessage && (
            <SuccessToast
              title={toastMessage.title}
              description={toastMessage.desc}
              onClose={() => setToastMessage(null)}
            />
          )}
        </div>
      </main>
    </AppShell>
  );
}
