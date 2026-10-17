"use client";

import { useState, useEffect, useRef } from "react";
import AppShell from "@/src/common/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useUser } from "@/src/common/context/user-context";
import { toast } from "@/components/ui/toast";
import { changePasswordAction } from "../actions/change-password.action";
import { updateAvatarAction } from "../actions/update-avatar.action";
import { updateProfileNameAction } from "../actions/update-profile-name.action";
import { getUserPerformanceAction } from "../actions/get-user-performance.action";

interface PerformanceReport {
  id: string;
  content: string;
  division: string;
  status: string;
  isLate: boolean;
  attachmentsCount: number;
  createdAt: string;
  appreciations: number;
}

interface PerformanceData {
  totalReports: number;
  disciplineRate: number;
  totalAppreciations: number;
  recentReports: PerformanceReport[];
}

function cleanReportContent(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\[PEKERJAAN\]/gi, "")
    .replace(/\[HASIL\s*\/?\s*OUTPUT\]/gi, " • Hasil: ")
    .replace(/\n+/g, " ")
    .trim();
}

function formatReportDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} • ${timePart} WIB`;
  } catch {
    return isoString;
  }
}

export default function ProfileView() {
  const { user, refreshUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar Upload State
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Kinerja Data State
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(true);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    let ignore = false;
    async function loadPerformance() {
      setPerformanceLoading(true);
      try {
        const res = await getUserPerformanceAction();
        if (!ignore && res.success && res.data) {
          setPerformance(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat kinerja amil:", err);
      } finally {
        if (!ignore) {
          setPerformanceLoading(false);
        }
      }
    }
    loadPerformance();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Hanya berkas gambar (JPG, PNG, WEBP) yang diizinkan.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5MB.");
      return;
    }

    setAvatarLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "avatars");

      const uploadRes = await fetch("/api/v1/upload", {
        method: "POST",
        body: fd,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.message || "Gagal mengunggah foto profil.");
      }

      const updateRes = await updateAvatarAction({ avatarUrl: uploadData.url });
      if (!updateRes.success) {
        throw new Error(updateRes.message || "Gagal menyimpan pembaruan foto profil.");
      }

      await refreshUser();
      toast.success("Foto profil berhasil diperbarui!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah foto profil.");
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Nama lengkap tidak boleh kosong.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateProfileNameAction({ name });
      if (res.success) {
        await refreshUser();
        toast.success("Data diri berhasil diperbarui!");
      } else {
        toast.error(res.message || "Gagal memperbarui data diri.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan saat menyimpan profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      toast.error("Password baru minimal 6 karakter.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Password baru dan konfirmasi password tidak cocok!");
      toast.error("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changePasswordAction({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (res.success) {
        toast.success("Kata sandi akun Anda berhasil diperbarui!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const errMsg = res.message || "Gagal memperbarui kata sandi.";
        setPasswordError(errMsg);
        toast.error(errMsg);
      }
    } catch {
      const errMsg = "Terjadi kesalahan jaringan saat memperbarui kata sandi.";
      setPasswordError(errMsg);
      toast.error(errMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const joinDateText = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "Januari 2026";

  return (
    <AppShell headerTitle="Profil Pegawai" headerBadge="Manajemen Akun">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Profil Amil
            </h1>
            <p className="text-sm text-on-surface-variant">
              Kelola informasi identitas, bidang penugasan, kinerja pelaporan, dan sistem keamanan akun Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel Kiri: Avatar & Sistem Keamanan Akun */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <CardContent className="p-0 flex flex-col items-center w-full">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary to-secondary opacity-90"></div>

                  <div className="relative mt-8 mb-4">
                    <Avatar className="size-28 border-4 border-surface-container-lowest shadow-md bg-surface-container-high relative overflow-hidden">
                      {user?.avatar && (
                        <AvatarImage
                          src={user.avatar}
                          alt={user?.name || "Foto Profil"}
                          className="object-cover size-full"
                        />
                      )}
                      <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                        {(user?.name || "A").charAt(0).toUpperCase()}
                      </AvatarFallback>
                      {avatarLoading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="material-symbols-outlined animate-spin text-white text-2xl">
                            progress_activity
                          </span>
                        </div>
                      )}
                    </Avatar>

                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 size-8 rounded-full bg-primary-container hover:bg-secondary text-white flex items-center justify-center cursor-pointer shadow-sm transition-transform active:scale-95"
                      title="Ganti Foto Profil"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </label>

                    <input
                      id="avatar-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarChange}
                      disabled={avatarLoading}
                      className="hidden"
                    />
                  </div>

                  <h2 className="text-lg font-bold text-on-surface">
                    {user?.name || "Amil LAZ Persis"}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {user?.email || ""}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className="text-xs font-semibold text-secondary">
                      Unit {user?.division || "Lembaga"}
                    </span>
                  </div>

                  <div className="w-full mt-6 flex flex-col gap-3 text-left">
                    <Separator className="bg-surface-container mb-1" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline">Bergabung Sejak</span>
                      <span className="font-semibold text-on-surface">{joinDateText}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline">Peran Akun</span>
                      <span className="font-semibold text-on-surface uppercase font-mono">{user?.role || "STAFF"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline">Tipe Hak Akses</span>
                      <span className="font-semibold text-secondary">
                        {user?.role === "SUPERADMIN"
                          ? "Root IT Owner"
                          : user?.role === "ADMIN"
                          ? "Pimpinan Pusat"
                          : user?.role === "SUPERVISOR"
                          ? "Koordinator Bidang"
                          : "Amil Pelaksana"}
                      </span>
                    </div>
                  </div>

                  <div className="w-full mt-5">
                    <Separator className="bg-surface-container mb-4" />
                    <label
                      htmlFor="avatar-upload"
                      className="w-full py-2 rounded-xl border border-outline-variant bg-surface-container-low/50 hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <span>{avatarLoading ? "Mengunggah..." : "Upload Foto Baru"}</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel Kanan: Tabs Navigasi */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Tabs defaultValue="biodata" className="w-full">
                <TabsList className="bg-surface-container-low/70 border border-outline-variant/60 p-1 rounded-xl h-auto grid grid-cols-3 w-full">
                  <TabsTrigger
                    value="biodata"
                    className="flex items-center justify-center py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer data-[state=active]:bg-surface-container-lowest data-[state=active]:text-secondary data-[state=active]:shadow-xs text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="hidden sm:inline">Data Diri &amp; Kepegawaian</span>
                    <span className="sm:hidden">Data Diri</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="kinerja"
                    className="flex items-center justify-center py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer data-[state=active]:bg-surface-container-lowest data-[state=active]:text-secondary data-[state=active]:shadow-xs text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="hidden sm:inline">Kinerja &amp; Riwayat</span>
                    <span className="sm:hidden">Kinerja</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="keamanan"
                    className="flex items-center justify-center py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer data-[state=active]:bg-surface-container-lowest data-[state=active]:text-secondary data-[state=active]:shadow-xs text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="hidden sm:inline">Keamanan Akun</span>
                    <span className="sm:hidden">Keamanan</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Biodata: Formulir Identitas & Kepegawaian */}
                <TabsContent value="biodata" className="mt-6">
                  <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                    <CardHeader className="p-0 flex flex-col gap-1">
                      <CardTitle className="text-lg font-bold text-on-surface">
                        Formulir Identitas &amp; Kepegawaian
                      </CardTitle>
                      <Separator className="bg-surface-container mt-4" />
                    </CardHeader>

                    <CardContent className="p-0">
                      <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs sm:text-sm font-semibold text-on-surface">
                              Nama Lengkap
                            </Label>
                            <Input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm"
                              placeholder="cth: Ahmad Fauzi, S.Kom."
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs sm:text-sm font-semibold text-on-surface">
                              Bidang / Divisi Penugasan
                            </Label>
                            <Input
                              type="text"
                              readOnly
                              value={`Unit ${user?.division || "Lembaga"}`}
                              className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container border-outline-variant/60 text-outline text-sm cursor-not-allowed select-none font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/60">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                                <span>Username Login</span>
                              </Label>
                              <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Terkunci</span>
                            </div>
                            <Input
                              type="text"
                              readOnly
                              value={user?.username || ""}
                              className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container/70 border-outline-variant/60 text-outline text-sm cursor-not-allowed select-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                                <span>Email Terdaftar</span>
                              </Label>
                              <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Terkunci</span>
                            </div>
                            <Input
                              type="email"
                              readOnly
                              value={user?.email || ""}
                              className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container/70 border-outline-variant/60 text-outline text-sm cursor-not-allowed select-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2 text-[11px] text-outline flex items-center gap-1.5 pt-0.5">
                            <span className="material-symbols-outlined text-[15px] text-amber-500">info</span>
                            <span>Username dan Email dikunci permanen untuk amil demi integritas data dan riwayat pelaporan. Hanya Admin atau Superadmin yang berwenang mengubahnya.</span>
                          </div>
                        </div>

                        <Separator className="bg-surface-container" />

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                          <Button
                            type="submit"
                            disabled={savingProfile}
                            className="w-full sm:w-auto bg-primary-container hover:bg-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center justify-center h-auto cursor-pointer disabled:opacity-50"
                          >
                            {savingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Kinerja & Riwayat (Data Riil) */}
                <TabsContent value="kinerja" className="mt-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-none relative pl-4 border-l-4 border-primary">
                      {performanceLoading ? (
                        <Skeleton className="h-9 w-20 mb-1" />
                      ) : (
                        <div className="text-3xl font-black text-primary tabular-nums">
                          {performance?.totalReports ?? 0}
                        </div>
                      )}
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Total Daily Report
                      </div>
                      <span className="text-[11px] text-outline mt-1 block">
                        Laporan tersimpan
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-none relative pl-4 border-l-4 border-secondary">
                      {performanceLoading ? (
                        <Skeleton className="h-9 w-20 mb-1" />
                      ) : (
                        <div className="text-3xl font-black text-secondary tabular-nums">
                          {performance?.disciplineRate ?? 100}%
                        </div>
                      )}
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Tingkat Disiplin
                      </div>
                      <span className="text-[11px] text-secondary font-semibold mt-1 block">
                        Ketepatan waktu
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-none relative pl-4 border-l-4 border-primary-container">
                      {performanceLoading ? (
                        <Skeleton className="h-9 w-20 mb-1" />
                      ) : (
                        <div className="text-3xl font-black text-on-surface tabular-nums">
                          {performance?.totalAppreciations ?? 0}
                        </div>
                      )}
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Apresiasi Diterima
                      </div>
                      <span className="text-[11px] text-outline mt-1 block">
                        Dukungan rekan kerja
                      </span>
                    </div>
                  </div>

                  <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-none flex flex-col gap-4">
                    <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
                      <CardTitle className="text-base font-bold text-on-surface">
                        Laporan Terbaru Milik Saya
                      </CardTitle>
                      <span className="text-xs text-outline font-mono">5 Laporan Terakhir</span>
                    </CardHeader>

                    <Separator className="bg-surface-container/70" />

                    <CardContent className="p-0 flex flex-col gap-3">
                      {performanceLoading ? (
                        <div className="flex flex-col gap-3">
                          <Skeleton className="h-28 w-full rounded-2xl" />
                          <Skeleton className="h-28 w-full rounded-2xl" />
                        </div>
                      ) : !performance?.recentReports || performance.recentReports.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center gap-2 bg-surface-container-low/40 rounded-2xl border border-dashed border-outline-variant">
                          <span className="material-symbols-outlined text-3xl text-outline">description</span>
                          <p className="text-sm font-semibold text-on-surface">Belum Ada Laporan</p>
                          <p className="text-xs text-on-surface-variant max-w-sm">
                            Anda belum mengirimkan laporan harian. Mulai catat amanah dan hasil kerja harian Anda pada menu Daily Report.
                          </p>
                        </div>
                      ) : (
                        performance.recentReports.map((report) => (
                          <div
                            key={report.id}
                            className="p-4 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors flex flex-col gap-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-semibold text-secondary">
                                {formatReportDate(report.createdAt)}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {report.isLate && (
                                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                    Terlambat
                                  </span>
                                )}
                                <span
                                  className={`text-xs font-bold font-mono uppercase ${
                                    report.status === "PUBLISHED"
                                      ? "text-secondary"
                                      : report.status === "PENDING_APPROVAL"
                                      ? "text-amber-500"
                                      : "text-error"
                                  }`}
                                >
                                  {report.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-on-surface line-clamp-2 leading-relaxed">
                              {cleanReportContent(report.content)}
                            </p>
                            <Separator className="bg-surface-container/60 my-1" />
                            <div className="flex items-center justify-between text-xs text-outline">
                              <span>
                                {report.attachmentsCount > 0
                                  ? `${report.attachmentsCount} Foto Terlampir`
                                  : "Tanpa Foto Lampiran"}
                              </span>
                              <span className="font-medium text-primary">
                                {report.appreciations} Apresiasi
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Keamanan: Pengaturan Keamanan & Kata Sandi */}
                <TabsContent value="keamanan" className="mt-6">
                  <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                    <CardHeader className="p-0 flex flex-col gap-1">
                      <CardTitle className="text-lg font-bold text-on-surface">
                        Pengaturan Keamanan &amp; Kata Sandi
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-outline mt-0.5">
                        Ganti kata sandi secara berkala untuk menjaga keamanan akun pelaporan harian Anda.
                      </p>
                      <Separator className="bg-surface-container mt-4" />
                    </CardHeader>

                    <CardContent className="p-0">
                      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5 max-w-md">
                        {passwordError && (
                          <Alert className="bg-error/15 border-error/30 text-error rounded-xl p-3.5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <AlertDescription className="text-xs font-semibold">{passwordError}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs sm:text-sm font-semibold text-on-surface">
                              Password Saat Ini
                            </Label>
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="flex items-center gap-1 text-[11px] text-outline hover:text-amber-500 transition-colors cursor-pointer"
                              title={showCurrentPassword ? "Sembunyikan Password (Lampu Mati)" : "Lihat Password (Lampu Bersinar)"}
                            >
                              <span className={`material-symbols-outlined text-[16px] ${showCurrentPassword ? "text-amber-500" : "text-outline"}`}>
                                {showCurrentPassword ? "lightbulb" : "light_off"}
                              </span>
                              <span>{showCurrentPassword ? "Sembunyikan" : "Tampilkan"}</span>
                            </button>
                          </div>
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            placeholder="••••••••••••"
                            className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs sm:text-sm font-semibold text-on-surface">
                              Password Baru
                            </Label>
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="flex items-center gap-1 text-[11px] text-outline hover:text-amber-500 transition-colors cursor-pointer"
                              title={showNewPassword ? "Sembunyikan Password (Lampu Mati)" : "Lihat Password (Lampu Bersinar)"}
                            >
                              <span className={`material-symbols-outlined text-[16px] ${showNewPassword ? "text-amber-500" : "text-outline"}`}>
                                {showNewPassword ? "lightbulb" : "light_off"}
                              </span>
                              <span>{showNewPassword ? "Sembunyikan" : "Tampilkan"}</span>
                            </button>
                          </div>
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            placeholder="Minimal 6 karakter"
                            className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs sm:text-sm font-semibold text-on-surface">
                              Konfirmasi Password Baru
                            </Label>
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="flex items-center gap-1 text-[11px] text-outline hover:text-amber-500 transition-colors cursor-pointer"
                              title={showConfirmPassword ? "Sembunyikan Password (Lampu Mati)" : "Lihat Password (Lampu Bersinar)"}
                            >
                              <span className={`material-symbols-outlined text-[16px] ${showConfirmPassword ? "text-amber-500" : "text-outline"}`}>
                                {showConfirmPassword ? "lightbulb" : "light_off"}
                              </span>
                              <span>{showConfirmPassword ? "Sembunyikan" : "Tampilkan"}</span>
                            </button>
                          </div>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Ulangi password baru"
                            className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm font-mono"
                          />
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full sm:w-auto bg-primary-container hover:bg-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center justify-center h-auto cursor-pointer disabled:opacity-50"
                          >
                            {passwordLoading ? "Memperbarui..." : "Perbarui Kata Sandi"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
