"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import SuccessToast from "@/src/common/components/success-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  getUsersForMutationAction,
  moveUserDivisionAction,
} from "../index";

interface DivisionItem {
  id: string;
  name: string;
  description: string | null;
  leaderName: string | null;
  memberCount: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  division: string;
  role: string;
  position: string | null;
}

export default function DivisionManagerView() {
  const [divisions, setDivisions] = useState<DivisionItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("divisions");

  // Dialog State: Tambah / Edit Divisi
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<DivisionItem | null>(null);
  const [formName, setFormName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Dialog State: Mutasi Pegawai
  const [mutatingUser, setMutatingUser] = useState<UserItem | null>(null);
  const [targetDivision, setTargetDivision] = useState("");
  const [targetPosition, setTargetPosition] = useState("");

  // Search User
  const [searchUser, setSearchUser] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const loadData = async () => {
    try {
      const [divRes, userRes] = await Promise.all([
        getDivisionsAction(),
        getUsersForMutationAction(),
      ]);

      if (divRes.success && divRes.data) {
        setDivisions(divRes.data as DivisionItem[]);
      }
      if (userRes.success && userRes.data) {
        setUsers(userRes.data as UserItem[]);
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
        const [divRes, userRes] = await Promise.all([
          getDivisionsAction(),
          getUsersForMutationAction(),
        ]);
        if (!ignore) {
          if (divRes.success && divRes.data) setDivisions(divRes.data as DivisionItem[]);
          if (userRes.success && userRes.data) setUsers(userRes.data as UserItem[]);
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

  // Handler: Mutasi Pegawai
  const openMutationDialog = (user: UserItem) => {
    setMutatingUser(user);
    setTargetDivision(user.division);
    setTargetPosition(user.position || "");
  };

  const handleConfirmMutation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutatingUser || !targetDivision) return;

    if (targetDivision === mutatingUser.division && targetPosition === (mutatingUser.position || "")) {
      alert("Pegawai sudah berada di divisi dan jabatan yang sama.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await moveUserDivisionAction({
        userId: mutatingUser.id,
        newDivision: targetDivision,
        newPosition: targetPosition.trim() || undefined,
      });

      if (res.success) {
        setToastMessage({
          title: "Mutasi Berhasil",
          desc: `${mutatingUser.name} kini ditugaskan pada unit ${targetDivision}.`,
        });
        setMutatingUser(null);
        await loadData();
      } else {
        alert(res.message || "Gagal memutasikan pegawai.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat mutasi.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchUser.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.division.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell headerTitle="Kelola Divisi & Pegawai" headerBadge="Akses Administrator">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                Manajemen Bidang &amp; Mutasi Pegawai
              </h1>
              <p className="text-sm text-on-surface-variant">
                Otoritas khusus administrator untuk mengelola struktur bidang, koordinator, dan penugasan divisi amil LAZ Persis.
              </p>
            </div>

            <Button
              onClick={openCreateDialog}
              className="bg-primary-container hover:bg-secondary text-white font-semibold rounded-xl text-sm px-5 h-11 flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
            >
              <span>Tambah Bidang Baru</span>
            </Button>
          </div>

          {/* Banner Otoritas Menggunakan shadcn Alert */}
          <Alert className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs">
            <AlertDescription className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Hak Akses Lembaga:</span> Pegawai biasa tidak dapat mengubah divisinya sendiri di halaman profil. Seluruh perubahan penugasan divisi dilakukan secara terpusat oleh Admin pada halaman ini untuk menjamin akurasi rekapitulasi pelaporan.
            </AlertDescription>
          </Alert>

          {/* Tabs Menu */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-surface-container rounded-xl p-1 h-auto flex flex-wrap gap-1">
              <TabsTrigger value="divisions" className="rounded-lg text-xs font-semibold py-2 px-4 cursor-pointer">
                <span>Master Bidang &amp; Divisi ({divisions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="mutation" className="rounded-lg text-xs font-semibold py-2 px-4 cursor-pointer">
                <span>Penugasan &amp; Mutasi Pegawai ({users.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Tab 1: Master Divisi */}
            <TabsContent value="divisions" className="mt-5 flex flex-col gap-4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Skeleton className="h-44 rounded-2xl" />
                  <Skeleton className="h-44 rounded-2xl" />
                  <Skeleton className="h-44 rounded-2xl" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {divisions.map((div) => (
                    <Card
                      key={div.id}
                      className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-secondary/30 transition-colors gap-3"
                    >
                      <CardHeader className="p-0 flex flex-row items-center justify-between gap-2">
                        <CardTitle className="text-base font-bold text-on-surface">{div.name}</CardTitle>
                        <Badge variant="secondary" className="bg-surface-container text-on-surface font-semibold text-[11px] border-transparent">
                          {div.memberCount} Amil
                        </Badge>
                      </CardHeader>

                      <Separator className="bg-surface-container" />

                      <CardFooter className="p-0 bg-transparent border-0 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(div)}
                          className="h-8 px-2.5 text-xs text-primary hover:text-secondary hover:bg-surface-container font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span data-icon="inline-start" className="material-symbols-outlined text-[15px]">edit</span>
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={submitting}
                          onClick={() => handleDeleteDivision(div)}
                          className="h-8 px-2.5 text-xs text-error hover:bg-error/10 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span data-icon="inline-start" className="material-symbols-outlined text-[15px]">delete</span>
                          <span>Hapus</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Content Tab 2: Mutasi Pegawai */}
            <TabsContent value="mutation" className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                    search
                  </span>
                  <Input
                    placeholder="Cari nama pegawai atau divisi..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="pl-9 h-10 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant"
                  />
                </div>
                <span className="text-xs text-outline self-center">
                  Total {filteredUsers.length} pegawai terdaftar
                </span>
              </div>

              {loading ? (
                <Skeleton className="h-64 rounded-2xl" />
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-surface-container-low/50 border-b border-surface-container text-outline text-[11px] font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4 sm:px-6">Nama Pegawai</th>
                          <th className="py-3.5 px-4 sm:px-6">Divisi Saat Ini</th>
                          <th className="py-3.5 px-4 sm:px-6">Jabatan / Role</th>
                          <th className="py-3.5 px-4 sm:px-6 text-right">Aksi Mutasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container/60">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="py-3.5 px-4 sm:px-6">
                              <div className="font-bold text-on-surface">{user.name}</div>
                              <div className="text-[11px] text-outline font-mono">{user.email}</div>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <Badge className="bg-secondary/15 text-secondary border-secondary/30 text-xs font-semibold">
                                {user.division}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-on-surface-variant font-medium">
                              <div>{user.position || "Staf Pelaksana"}</div>
                              <span className="text-[10px] text-outline uppercase font-mono">{user.role}</span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openMutationDialog(user)}
                                className="h-8 px-3 text-xs border-outline-variant hover:border-secondary hover:text-secondary rounded-lg font-semibold flex items-center gap-1.5 ml-auto cursor-pointer"
                              >
                                <span data-icon="inline-start" className="material-symbols-outlined text-[15px]">swap_horiz</span>
                                <span>Pindahkan</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Dialog Tambah / Edit Divisi */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
              <form onSubmit={handleSaveDivision}>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-on-surface">
                    {editingDivision ? "Edit Nama Bidang" : "Tambah Bidang Baru"}
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

          {/* Dialog Mutasi Pegawai */}
          <Dialog open={Boolean(mutatingUser)} onOpenChange={(open) => !open && setMutatingUser(null)}>
            <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
              <form onSubmit={handleConfirmMutation}>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-on-surface">
                    Mutasikan Penugasan Pegawai
                  </DialogTitle>
                  <DialogDescription className="text-xs text-on-surface-variant">
                    Pindahkan unit penugasan amil. Perubahan ini akan segera berlaku pada filter pelaporan harian.
                  </DialogDescription>
                </DialogHeader>

                {mutatingUser && (
                  <div className="flex flex-col gap-4 py-4">
                    <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-col gap-1">
                      <div className="text-xs text-outline font-medium">Pegawai yang dimutasikan:</div>
                      <div className="text-sm font-bold text-on-surface">{mutatingUser.name}</div>
                      <div className="text-xs text-on-surface-variant">
                        Divisi Saat Ini: <span className="font-semibold text-secondary">{mutatingUser.division}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-on-surface">Pilih Divisi Tujuan Baru</Label>
                      <Select value={targetDivision} onValueChange={(val) => { if (val) setTargetDivision(val); }}>
                        <SelectTrigger className="w-full h-11 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant">
                          <SelectValue placeholder="Pilih Divisi Baru" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-container-lowest border-outline-variant">
                          <SelectGroup>
                            {divisions.map((d) => (
                              <SelectItem key={d.id} value={d.name}>
                                {d.name} {d.leaderName ? `(PJ: ${d.leaderName})` : ""}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-on-surface">Jabatan / Posisi Penugasan</Label>
                      <Input
                        placeholder="cth: Staf Pelaksana, Koordinator Lapangan..."
                        value={targetPosition}
                        onChange={(e) => setTargetPosition(e.target.value)}
                        className="text-xs sm:text-sm h-11 bg-surface-container-lowest border-outline-variant"
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="flex sm:justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setMutatingUser(null)}
                    disabled={submitting}
                    className="text-xs h-9 cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || targetDivision === mutatingUser?.division}
                    className="bg-primary-container hover:bg-secondary text-white text-xs h-9 font-semibold cursor-pointer"
                  >
                    {submitting ? "Memproses..." : "Konfirmasi Mutasi"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

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
