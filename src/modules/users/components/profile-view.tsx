"use client";

import { useState } from "react";
import AppShell from "@/src/common/components/app-shell";

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState<"biodata" | "kinerja" | "keamanan">("biodata");
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "Ahmad Fauzi, S.Kom.",
    division: "Humas",
    email: "ahmad.fauzi@lazpersis.or.id",
    joinDate: "01 Januari 2024",
    bio: "Bertanggung jawab dalam pengelolaan publikasi siaran pers resmi, media sosial lembaga, dan dokumentasi lapangan program penyaluran zakat LAZ Persis.",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <AppShell headerTitle="Profil Saya" headerBadge={`Unit ${formData.division}`}>
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                account_circle
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Profil Pegawai
              </h1>
            </div>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Lengkapi dan perbarui data identitas kepegawaian Anda secara mandiri untuk ketepatan sistem pelaporan dan koordinasi internal LAZ Persis.
            </p>
          </div>

          {showToast && (
            <div className="border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] rounded-xl p-4 flex items-center justify-between shadow-sm transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A7F3D0] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined font-bold text-[20px] text-[#065F46]">
                    check
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">Data Berhasil Diperbarui!</p>
                  <p className="text-xs sm:text-sm text-[#065F46]">
                    Perubahan data profil Anda telah tersimpan di sistem.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-[#065F46] hover:opacity-75 p-1 rounded-lg transition-opacity"
                title="Tutup"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    task_alt
                  </span>
                  <h3 className="text-base font-bold text-on-surface">
                    Kelengkapan Data Mandiri
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-secondary">
                    85% Terisi
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-left md:text-right">
                <span className="text-xs text-outline font-medium block">Status Akun:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Amil Aktif Terverifikasi
                </span>
              </div>
            </div>

            <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                style={{ width: "85%" }}
              ></div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-medium">
                <span className="material-symbols-outlined text-[14px]">check</span>
                Email Resmi Terhubung
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-medium">
                <span className="material-symbols-outlined text-[14px]">check</span>
                Foto Profil Terpasang
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-medium">
                <span className="material-symbols-outlined text-[14px]">check</span>
                Divisi Terisi
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-medium">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Lengkapi Bio Tugas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary to-secondary opacity-90"></div>

                <div className="relative mt-8 mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md bg-surface-container-high">
                    <img
                      className="w-full h-full object-cover"
                      alt={formData.name}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn247TIAs7R8-zDWHwoeN8RTOBPLUZpEDYAKTXE-Vu4gq5tXxYXQdTxuFBAPBag-pPXnjHgYLrwi82oUcux15TpBfGvZnnJHe1AImvH-i7JV2V8bttE4ljzZkgMjCE7UsAHz6ZfMVkE_E_DmOTmVKJtuXCppT5JglnvHtsGbNUmo0yWjE2uAgnFr5IsUYr43PyO_W0bAyRNy_4HhYAOd9DnIvss6qdA8lW2yjcyrrh7v8M9HksxdURgA"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-container hover:bg-secondary text-white flex items-center justify-center cursor-pointer shadow-sm transition-transform active:scale-95"
                    title="Ganti Foto Profil"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => setShowToast(true)}
                    />
                  </label>
                </div>

                <h2 className="text-lg font-bold text-on-surface leading-snug">
                  {formData.name}
                </h2>

                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container/10 text-primary-container">
                    Unit {formData.division}
                  </span>
                </div>

                <div className="w-full border-t border-outline-variant/60 my-5"></div>

                <div className="w-full space-y-3 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-outline flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      Email
                    </span>
                    <span className="font-medium text-on-surface truncate max-w-[170px]" title={formData.email}>
                      {formData.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">event</span>
                      TMT Amil
                    </span>
                    <span className="font-medium text-on-surface">
                      {formData.joinDate}
                    </span>
                  </div>
                </div>

                <div className="w-full pt-5">
                  <label
                    htmlFor="avatar-upload"
                    className="w-full py-2 px-3 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>Unggah Foto Baru</span>
                  </label>
                </div>
              </div>

              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 text-[#166534] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    verified_user
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Sistem Keamanan
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-[#14532D]">
                  Sesi login Anda terenkripsi standar keamanan internal LAZ Persis. Pastikan memperbarui password secara berkala.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("biodata")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "biodata"
                      ? "bg-primary-container text-white shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span>Data Diri &amp; Kepegawaian</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("kinerja")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "kinerja"
                      ? "bg-primary-container text-white shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">monitoring</span>
                  <span>Kinerja &amp; Riwayat Laporan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("keamanan")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "keamanan"
                      ? "bg-primary-container text-white shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  <span>Keamanan Akun</span>
                </button>
              </div>

              {activeTab === "biodata" && (
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="border-b border-surface-container pb-4 mb-6">
                    <h3 className="text-lg font-bold text-on-surface">
                      Formulir Identitas &amp; Kepegawaian
                    </h3>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center justify-between">
                          <span>Nama Lengkap</span>
                          <span className="text-[11px] text-secondary font-medium">Wajib</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                          placeholder="cth: Ahmad Fauzi, S.Kom."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center justify-between">
                          <span>Email</span>
                          <span className="text-[11px] text-outline font-normal">Sesuai Akun Login</span>
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="email"
                            readOnly
                            value={formData.email}
                            className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container border border-outline-variant/60 text-outline text-sm cursor-not-allowed select-none focus:ring-0"
                          />
                          <div className="absolute right-3.5 flex items-center pointer-events-none text-outline">
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center justify-between">
                          <span>Bidang</span>
                          <span className="text-[11px] text-secondary font-medium">Wajib</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formData.division}
                            onChange={(e) => handleInputChange("division", e.target.value)}
                            className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm appearance-none focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 cursor-pointer"
                          >
                            <option value="Humas">Humas &amp; Media</option>
                            <option value="Program">Program Penyaluran</option>
                            <option value="Sekretariat">Sekretariat</option>
                            <option value="Keuangan">Keuangan &amp; Akuntansi</option>
                            <option value="SDM">SDM &amp; Keamilan</option>
                            <option value="IT">IT &amp; Transformasi Digital</option>
                            <option value="Marketing">Marketing Komunikasi</option>
                            <option value="Administrasi">Administrasi Umum</option>
                          </select>
                          <div className="absolute right-3.5 top-3 flex items-center pointer-events-none text-outline">
                            <span className="material-symbols-outlined text-[18px]">
                              expand_more
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-on-surface flex items-center justify-between">
                        <span>Ringkasan Tugas &amp; Amanah</span>
                        <span className="text-[11px] text-outline font-normal">Opsional</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        className="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all leading-relaxed"
                        placeholder="Deskripsikan secara singkat ruang lingkup pekerjaan atau fokus tanggung jawab Anda..."
                      />
                    </div>

                    <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-end gap-3">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-primary-container hover:bg-secondary active:scale-[0.99] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        <span>Simpan Perubahan Profil</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "kinerja" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm relative pl-4 border-l-4 border-primary">
                      <div className="text-2xl font-bold text-primary">38</div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Total Daily Report
                      </div>
                      <span className="text-[11px] text-secondary font-semibold mt-1 block">
                        +4 pekan ini
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm relative pl-4 border-l-4 border-secondary">
                      <div className="text-2xl font-bold text-secondary">95%</div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Tingkat Disiplin
                      </div>
                      <span className="text-[11px] text-secondary font-semibold mt-1 block">
                        Sangat Amanah
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm relative pl-4 border-l-4 border-primary-container">
                      <div className="text-2xl font-bold text-on-surface">142</div>
                      <div className="text-xs text-on-surface-variant mt-1 font-medium">
                        Apresiasi Diterima
                      </div>
                      <span className="text-[11px] text-outline font-semibold mt-1 block">
                        Reaksi rekan kerja
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-surface-container mb-4">
                      <h4 className="text-base font-bold text-on-surface">
                        Laporan Terbaru Milik Saya
                      </h4>
                      <span className="text-xs text-outline">Bulan September 2026</span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low/30 hover:border-secondary transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-secondary">
                            Senin, 28 Sep 2026 • 15:30 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E6F4EA] text-secondary">
                            PUBLISHED
                          </span>
                        </div>
                        <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
                          Membuat desain materi publikasi untuk kegiatan tabligh akbar dan distribusi logistik zakat produktif, serta mendokumentasikan liputan bersama relawan.
                        </p>
                        <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-xs text-outline">
                          <span>1 Foto Terlampir</span>
                          <span className="font-medium text-primary">12 Apresiasi</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low/30 hover:border-secondary transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-secondary">
                            Jumat, 25 Sep 2026 • 16:15 WIB
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E6F4EA] text-secondary">
                            PUBLISHED
                          </span>
                        </div>
                        <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
                          Penyusunan press release hasil audit penyaluran zakat kuartal 3 dan koordinasi liputan media partner.
                        </p>
                        <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-xs text-outline">
                          <span>1 Foto Terlampir</span>
                          <span className="font-medium text-primary">8 Apresiasi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "keamanan" && (
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="border-b border-surface-container pb-4 mb-6">
                    <h3 className="text-lg font-bold text-on-surface">
                      Pengaturan Keamanan &amp; Kata Sandi
                    </h3>
                    <p className="text-xs sm:text-sm text-outline mt-0.5">
                      Ganti kata sandi secara berkala untuk menjaga keamanan akun pelaporan harian Anda.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-on-surface">
                        Password Saat Ini
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••••••"
                        className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-on-surface">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Minimal 8 karakter"
                        className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold text-on-surface">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Ulangi password baru"
                        className="w-full h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-primary-container hover:bg-secondary active:scale-[0.99] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        <span>Perbarui Kata Sandi</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
