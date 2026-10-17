"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/src/common/components/app-shell";
import SuccessToast from "@/src/common/components/success-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/src/common/context/user-context";
import { getDivisionsAction } from "@/src/modules/divisions";
import { getAllUsersAction } from "../actions/get-all-users.action";
import { resetPasswordAction } from "../actions/reset-password.action";
import UserStatsOverview from "./user-stats-overview";
import CreateUserDialog from "./create-user-dialog";
import EditRoleDialog, { ManagedUserItem } from "./edit-role-dialog";

export default function UserManagerView() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<ManagedUserItem[]>([]);
  const [divisions, setDivisions] = useState<Array<{ id: string; name: string }>>([]);
  const [stats, setStats] = useState({
    total: 0,
    superadmin: 0,
    admin: 0,
    supervisor: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("ALL");
  const [selectedRole, setSelectedRole] = useState("ALL");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoleUser, setEditingRoleUser] = useState<ManagedUserItem | null>(null);

  // Reset Password Dialog State
  const [resettingUser, setResettingUser] = useState<ManagedUserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [userRes, divRes] = await Promise.all([
        getAllUsersAction({
          division: selectedDivision,
          role: selectedRole,
          search,
        }),
        getDivisionsAction(),
      ]);

      if (userRes.success && userRes.data) {
        setUsers(userRes.data.users as ManagedUserItem[]);
        setStats(userRes.data.stats);
      }
      if (divRes.success && divRes.data) {
        setDivisions(divRes.data as Array<{ id: string; name: string }>);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [selectedDivision, selectedRole, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Permission Checks
  const getRoleTextStyle = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "text-purple-400 font-bold";
      case "ADMIN":
        return "text-amber-500 font-bold";
      case "SUPERVISOR":
        return "text-secondary font-bold";
      default:
        return "text-on-surface-variant font-medium";
    }
  };

  const canEditUser = (target: ManagedUserItem) => {
    if (!currentUser) return false;
    if (currentUser.role === "SUPERADMIN") return true;
    if (currentUser.role === "ADMIN") {
      if (target.role === "SUPERADMIN") return false;
      return true;
    }
    return false;
  };

  const canResetUser = (target: ManagedUserItem) => {
    if (!currentUser) return false;
    if (currentUser.role === "SUPERADMIN") return true;
    if (currentUser.role === "ADMIN") {
      if (target.role === "SUPERADMIN") return false;
      if (target.role === "ADMIN" && target.id !== currentUser.id) return false;
      return true;
    }
    return false;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;

    if (newPassword.length < 6) {
      setResetError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Konfirmasi password tidak cocok.");
      return;
    }

    setResetSubmitting(true);
    setResetError(null);
    try {
      const res = await resetPasswordAction({
        targetUserId: resettingUser.id,
        newPassword,
      });

      if (res.success) {
        setToastMessage({
          title: "Password Berhasil Direset",
          desc: `Kata sandi akun ${resettingUser.name} telah berhasil diperbarui.`,
        });
        setResettingUser(null);
      } else {
        setResetError(res.message || "Gagal mereset kata sandi.");
      }
    } catch {
      setResetError("Terjadi gangguan jaringan saat memproses reset password.");
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <AppShell headerTitle="Manajemen Pengguna" headerBadge="Hak Akses">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="max-w-[1240px] w-full flex flex-col gap-6">
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Kelola Pengguna & Hak Akses
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Daftarkan amil baru, atur hierarki wewenang (Admin, Supervisor, Staff), dan kelola kata sandi akun.
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary-container hover:bg-secondary text-white font-semibold text-xs sm:text-sm h-10 px-4 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>Tambah Amil Baru</span>
            </Button>
          </div>

          {/* Stats Overview */}
          <UserStatsOverview stats={stats} />

          {/* Filter Bar */}
          <Card className="bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-4 shadow-xs">
            <CardContent className="p-0 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <Input
                  placeholder="Cari nama, username, email, atau jabatan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 text-xs sm:text-sm bg-surface-container-low/50 border-outline-variant"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <Select value={selectedDivision} onValueChange={(val) => { if (val) setSelectedDivision(val); }}>
                  <SelectTrigger className="w-full sm:w-[170px] h-10 text-xs sm:text-sm bg-surface-container-low/50 border-outline-variant">
                    <SelectValue placeholder="Semua Divisi" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="ALL">Semua Divisi</SelectItem>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={selectedRole} onValueChange={(val) => { if (val) setSelectedRole(val); }}>
                  <SelectTrigger className="w-full sm:w-[150px] h-10 text-xs sm:text-sm bg-surface-container-low/50 border-outline-variant">
                    <SelectValue placeholder="Semua Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      <SelectItem value="ALL">Semua Role</SelectItem>
                      <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="SUPERVISOR">SUPERVISOR</SelectItem>
                      <SelectItem value="STAFF">STAFF</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {(search || selectedDivision !== "ALL" || selectedRole !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setSelectedDivision("ALL");
                      setSelectedRole("ALL");
                    }}
                    className="text-xs h-10 px-2 text-outline hover:text-on-surface cursor-pointer"
                    title="Reset Filter"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Table */}
          {loading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface-container-low/50 border-b border-surface-container text-outline text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Amil</th>
                      <th className="py-3.5 px-4 sm:px-6">Divisi</th>
                      <th className="py-3.5 px-4 sm:px-6">Jabatan / Posisi</th>
                      <th className="py-3.5 px-4 sm:px-6">Tingkat Hak Akses</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/60">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-outline text-xs">
                          Tidak ada amil yang sesuai dengan kriteria filter.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const canEdit = canEditUser(u);
                        const canReset = canResetUser(u);

                        return (
                          <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="py-3.5 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <Avatar className="size-8 border border-outline-variant shrink-0">
                                  <AvatarFallback className="text-[11px] font-bold bg-secondary/15 text-secondary">
                                    {u.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-bold text-on-surface leading-tight">
                                    {u.name}
                                  </span>
                                  <span className="text-[11px] text-outline font-mono">
                                    @{u.username} • {u.email}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <span className="text-xs font-semibold text-secondary">
                                {u.division}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-on-surface-variant font-medium">
                              {u.position || "Staf Pelaksana"}
                            </td>
                            <td className="py-3.5 px-4 sm:px-6">
                              <span className={`text-xs uppercase tracking-wider font-mono ${getRoleTextStyle(u.role)}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={!canEdit}
                                  title={canEdit ? "Edit Identitas & Hak Akses" : "Akun Superadmin dilindungi"}
                                  onClick={() => setEditingRoleUser(u)}
                                  className={`h-8 px-2.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 ${
                                    canEdit
                                      ? "border-outline-variant hover:border-secondary hover:text-secondary cursor-pointer"
                                      : "opacity-40 cursor-not-allowed border-outline-variant/30 text-outline"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[15px]">edit</span>
                                  <span className="hidden sm:inline">Edit Data</span>
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={!canReset}
                                  title={canReset ? "Reset Kata Sandi" : "Tidak memiliki hak akses mereset akun ini"}
                                  onClick={() => {
                                    setResettingUser(u);
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setResetError(null);
                                  }}
                                  className={`h-8 px-2.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 ${
                                    canReset
                                      ? "border-outline-variant hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-500 text-on-surface-variant cursor-pointer"
                                      : "opacity-40 cursor-not-allowed border-outline-variant/30 text-outline"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[15px]">lock_reset</span>
                                  <span className="hidden sm:inline">Reset Password</span>
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

          {/* Dialog Tambah Amil */}
          <CreateUserDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            divisions={divisions}
            onSuccess={(msg) => {
              setToastMessage({ title: "Amil Berhasil Didaftarkan", desc: msg });
              loadData();
            }}
          />

          {/* Dialog Ubah Role & Identitas */}
          <EditRoleDialog
            user={editingRoleUser}
            divisions={divisions}
            onClose={() => setEditingRoleUser(null)}
            actorRole={currentUser?.role}
            onSuccess={(msg) => {
              setToastMessage({ title: "Data Amil Diperbarui", desc: msg });
              loadData();
            }}
          />

          {/* Dialog Reset Password */}
          <Dialog open={Boolean(resettingUser)} onOpenChange={(open) => !open && setResettingUser(null)}>
            <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
              <form onSubmit={handleResetPassword}>
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">lock_reset</span>
                    <span>Reset Password Amil</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-on-surface-variant">
                    Perbarui kata sandi akun amil. Password baru akan langsung aktif.
                  </DialogDescription>
                </DialogHeader>

                {resettingUser && (
                  <div className="flex flex-col gap-3.5 py-4">
                    <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-outline font-medium">Akun Sasaran:</span>
                        <span className="text-xs font-bold uppercase text-secondary font-mono">
                          {resettingUser.role}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-on-surface">{resettingUser.name}</div>
                      <div className="text-xs text-on-surface-variant">
                        Divisi: <span className="font-semibold text-secondary">{resettingUser.division}</span>
                        {" • "}
                        <span className="font-mono text-outline">@{resettingUser.username}</span>
                      </div>
                    </div>

                    {resetError && (
                      <Alert variant="destructive" className="py-2.5 rounded-xl border-error/25 bg-error/10 text-error">
                        <AlertDescription className="text-xs font-medium">{resetError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-on-surface">Password Baru</Label>
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(!showResetPassword)}
                          className="flex items-center gap-1 text-[11px] text-outline hover:text-amber-500 transition-colors cursor-pointer"
                          title={showResetPassword ? "Sembunyikan Password (Lampu Mati)" : "Lihat Password (Lampu Bersinar)"}
                        >
                          <span className={`material-symbols-outlined text-[16px] ${showResetPassword ? "text-amber-500" : "text-outline"}`}>
                            {showResetPassword ? "lightbulb" : "light_off"}
                          </span>
                          <span>{showResetPassword ? "Sembunyikan" : "Tampilkan"}</span>
                        </button>
                      </div>
                      <Input
                        type={showResetPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-on-surface">Konfirmasi Password Baru</Label>
                      <Input
                        type={showResetPassword ? "text" : "password"}
                        placeholder="Ketik ulang password baru..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-outline">Bantuan cepat:</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const base = resettingUser.username.trim() || "amil";
                          setNewPassword(`${base}123`);
                          setConfirmPassword(`${base}123`);
                        }}
                        className="text-[11px] h-6 px-1.5 text-secondary hover:text-secondary hover:bg-secondary/10 cursor-pointer"
                      >
                        Gunakan Default ({resettingUser.username}123)
                      </Button>
                    </div>
                  </div>
                )}

                <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-surface-container">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setResettingUser(null)}
                    disabled={resetSubmitting}
                    className="text-xs h-9 cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={resetSubmitting}
                    className="bg-primary-container hover:bg-secondary text-white text-xs h-9 font-semibold cursor-pointer"
                  >
                    {resetSubmitting ? "Menyimpan..." : "Reset Kata Sandi"}
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
