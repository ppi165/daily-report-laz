"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useUser } from "@/src/common/context/user-context";
import { changePasswordAction } from "../actions/change-password.action";

interface UserProfile {
  name: string;
  username: string;
  email: string;
  division: string;
  role: string;
  joinDate: string;
  bio: string;
}

export default function ProfileView() {
  const { user } = useUser();
  const [formData, setFormData] = useState<UserProfile>(() => ({
    name: user?.name || "Memuat...",
    username: user?.username || "",
    email: user?.email || "",
    division: user?.division || "Lembaga",
    role: user?.role || "STAFF",
    joinDate: "Januari 2024",
    bio: "Amil aktif pada Lembaga Amil Zakat Persatuan Islam (LAZ Persis).",
  }));

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

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        username: user.username || prev.username,
        email: user.email || prev.email,
        division: user.division || prev.division,
        role: user.role || prev.role,
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Data diri berhasil diperbarui!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Password baru dan konfirmasi password tidak cocok!");
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
        setToastMessage("Kata sandi akun Anda berhasil diperbarui!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setPasswordError(res.message || "Gagal memperbarui kata sandi.");
      }
    } catch {
      setPasswordError("Terjadi kesalahan jaringan saat memperbarui kata sandi.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AppShell headerTitle="Profil Pegawai" headerBadge="Manajemen Akun">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Profil Amil
            </h1>
            <p className="text-sm text-on-surface-variant">
              Kelola informasi identitas, bidang penugasan, dan pengaturan keamanan akun Anda.
            </p>
          </div>

          {toastMessage && (
            <Alert className="bg-secondary/15 border-secondary/30 text-secondary rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <AlertDescription className="text-sm font-semibold text-secondary">{toastMessage}</AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs hover:underline cursor-pointer h-auto p-1"
              >
                Tutup
              </Button>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Card className="bg-surface-container-lowest border-outline-variant/60 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <CardContent className="p-0 flex flex-col items-center w-full">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary to-secondary opacity-90"></div>

                  <div className="relative mt-8 mb-4">
                    <Avatar className="size-28 border-4 border-surface-container-lowest shadow-md bg-surface-container-high">
                      <AvatarImage
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn247TIAs7R8-zDWHwoeN8RTOBPLUZpEDYAKTXE-Vu4gq5tXxYXQdTxuFBAPBag-pPXnjHgYLrwi82oUcux15TpBfGvZnnJHe1AImvH-i7JV2V8bttE4ljzZkgMjCE7UsAHz6ZfMVkE_E_DmOTmVKJtuXCppT5JglnvHtsGbNUmo0yWjE2uAgnFr5IsUYr43PyO_W0bAyRNy_4HhYAOd9DnIvss6qdA8lW2yjcyrrh7v8M9HksxdURgA"
                        alt={formData.name}
                      />
                      <AvatarFallback className="text-3xl font-bold">
                        {formData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 size-8 rounded-full bg-primary-container hover:bg-secondary text-white flex items-center justify-center cursor-pointer shadow-sm transition-transform active:scale-95"
                      title="Ganti Foto Profil"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>

                  <h2 className="text-lg font-bold text-on-surface">
                    {formData.name}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {formData.email}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className="text-xs font-semibold text-secondary">
                      Unit {formData.division}
                    </span>
                  </div>

                  <div className="w-full mt-6 flex flex-col gap-3 text-left">
                    <Separator className="bg-surface-container mb-1" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline">Bergabung Sejak</span>
                      <span className="font-semibold text-on-surface">{formData.joinDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline">Peran Akun</span>
                      <span className="font-semibold text-on-surface uppercase font-mono">{formData.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-outline">Tipe Hak Akses</span>
                      <span className="font-semibold text-secondary">
                        {formData.role === "SUPERADMIN"
                          ? "Root IT Owner"
                          : formData.role === "ADMIN"
                          ? "Pimpinan Pusat"
                          : formData.role === "SUPERVISOR"
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
                      <span>Upload Foto Baru</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-secondary-container/20 border border-secondary/35 rounded-2xl p-5 shadow-xs flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-on-surface">
                  Sistem Keamanan Akun
                </h4>
                <p className="text-xs leading-relaxed text-on-surface-variant">
                  Sesi login Anda terenkripsi standar keamanan internal LAZ Persis. Pastikan memperbarui password secara berkala.
                </p>
              </div>
            </div>

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
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
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
                              value={`Unit ${formData.division}`}
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
                              value={formData.username}
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
                              value={formData.email}
                              className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container/70 border-outline-variant/60 text-outline text-sm cursor-not-allowed select-none font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2 text-[11px] text-outline flex items-center gap-1.5 pt-0.5">
                            <span className="material-symbols-outlined text-[15px] text-amber-500">info</span>
                            <span>Username dan Email dikunci permanen untuk amil demi integritas data dan riwayat pelaporan. Hanya Admin atau Superadmin yang berwenang mengubahnya.</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs sm:text-sm font-semibold text-on-surface">
                            Ringkasan Tugas &amp; Amanah
                          </Label>
                          <Textarea
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            className="w-full p-3 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm leading-relaxed"
                            placeholder="Deskripsikan secara singkat ruang lingkup pekerjaan atau fokus tanggung jawab Anda..."
                          />
                        </div>

                        <Separator className="bg-surface-container" />

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                          <Button
                            type="submit"
                            className="w-full sm:w-auto bg-primary-container hover:bg-secondary text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center justify-center h-auto cursor-pointer"
                          >
                            Simpan Perubahan Profil
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="kinerja" className="mt-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-none relative pl-4 border-l-4 border-primary">
                      <div className="text-3xl font-black text-primary tabular-nums">38</div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Total Daily Report
                      </div>
                      <span className="text-[11px] text-secondary font-semibold mt-1 block">
                        +4 pekan ini
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-none relative pl-4 border-l-4 border-secondary">
                      <div className="text-3xl font-black text-secondary tabular-nums">95%</div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Tingkat Disiplin
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-none relative pl-4 border-l-4 border-primary-container">
                      <div className="text-3xl font-black text-on-surface tabular-nums">142</div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Apresiasi Diterima
                      </div>
                    </div>
                  </div>

                  <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-none flex flex-col gap-4">
                    <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
                      <CardTitle className="text-base font-bold text-on-surface">
                        Laporan Terbaru Milik Saya
                      </CardTitle>
                      <span className="text-xs text-outline font-mono">Bulan September 2026</span>
                    </CardHeader>

                    <Separator className="bg-surface-container/70" />

                    <CardContent className="p-0 flex flex-col gap-3">
                      <div className="p-4 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-secondary">
                            Senin, 28 Sep 2026 • 15:30 WIB
                          </span>
                          <span className="text-xs font-bold font-mono uppercase text-secondary">
                            PUBLISHED
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface line-clamp-2 leading-relaxed">
                          Membuat desain materi publikasi untuk kegiatan tabligh akbar dan distribusi logistik zakat produktif, serta mendokumentasikan liputan bersama relawan.
                        </p>
                        <Separator className="bg-surface-container/60 my-1" />
                        <div className="flex items-center justify-between text-xs text-outline">
                          <span>1 Foto Terlampir</span>
                          <span className="font-medium text-primary">12 Apresiasi</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-secondary">
                            Jumat, 25 Sep 2026 • 16:15 WIB
                          </span>
                          <span className="text-xs font-bold font-mono uppercase text-secondary">
                            PUBLISHED
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface line-clamp-2 leading-relaxed">
                          Penyusunan press release hasil audit penyaluran zakat kuartal 3 dan koordinasi liputan media partner.
                        </p>
                        <Separator className="bg-surface-container/60 my-1" />
                        <div className="flex items-center justify-between text-xs text-outline">
                          <span>1 Foto Terlampir</span>
                          <span className="font-medium text-primary">8 Apresiasi</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

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
