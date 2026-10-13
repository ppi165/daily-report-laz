"use client";

import { useState } from "react";
import AppShell from "@/src/shared/components/AppShell";
import ManageDivisionModal from "./ManageDivisionModal";

export default function ReportForm() {
  const [divisions, setDivisions] = useState<string[]>([
    "Sekretariat",
    "Keuangan",
    "Humas",
    "Program",
    "SDM",
    "IT",
    "Administrasi",
    "Marketing",
    "Lainnya",
  ]);
  const [division, setDivision] = useState("Humas");
  const [isManageDivisionOpen, setIsManageDivisionOpen] = useState(false);
  const [tasks, setTasks] = useState(
    `1. Menyelesaikan draft infografis laporan bulanan zakat mal periode Agustus 2026.
2. Koordinasi bersama tim program terkait dokumentasi penyaluran beasiswa santri berprestasi di Bandung Barat.
3. Menulis dan mempublikasikan siaran pers kegiatan tabligh akbar LAZ Persis ke portal media resmi serta feed media sosial Instagram.`
  );
  const [results, setResults] = useState(
    `1. Draft infografis 100% selesai dan siap dipublikasikan ke media sosial.
2. Dokumentasi foto dan video penyaluran beasiswa terarsip rapi di cloud storage.
3. Siaran pers telah tayang di website portal resmi LAZ Persis.`
  );
  const [photoAttached, setPhotoAttached] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddDivision = (newDiv: string) => {
    setDivisions((prev) => [...prev, newDiv]);
    setDivision(newDiv);
  };

  const handleUpdateDivision = (oldDiv: string, newDiv: string) => {
    setDivisions((prev) => prev.map((d) => (d === oldDiv ? newDiv : d)));
    if (division === oldDiv) {
      setDivision(newDiv);
    }
  };

  const handleDeleteDivision = (targetDiv: string) => {
    setDivisions((prev) => {
      const filtered = prev.filter((d) => d !== targetDiv);
      if (division === targetDiv && filtered.length > 0) {
        setDivision(filtered[0]);
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Gabungkan task dan result untuk content laporan
    const combinedContent = `**Pekerjaan:**\n${tasks}\n\n**Hasil:**\n${results}`;
    
    try {
      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Laporan Harian", // Default title
          content: combinedContent,
          division: division,
          attachments: [] // Simulasi attachments kosong untuk saat ini
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setShowSuccessToast(true);
        // Reset form
        setTasks("");
        setResults("");
      } else {
        alert(data.message || "Gagal mengirim laporan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell headerTitle="Daily Report LAZ Persis" headerBadge={`Unit ${division}`}>
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
          {/* Header Halaman */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                edit_note
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Daily Report
              </h1>
            </div>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Laporkan aktivitas dan pekerjaan yang telah Anda lakukan hari ini secara
              amanah dan transparan.
            </p>
          </div>

          {/* Banner Info Publikasi */}
          <div className="flex items-center gap-3.5 bg-[#E6F4EA] border border-secondary-container/80 rounded-xl p-4 shadow-sm text-on-secondary-container">
            <div className="p-1 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                verified_user
              </span>
            </div>
            <p className="text-sm font-medium">
              Laporan yang dikirim akan otomatis berstatus{" "}
              <span className="font-bold underline decoration-secondary">
                PUBLISHED
              </span>{" "}
              dan dapat dilihat seluruh pegawai LAZ Persis.
            </p>
          </div>

          {/* Card Form Input Pekerjaan */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7 relative">
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-primary-container rounded-t-2xl"></div>

            {/* FORM CONTENT */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Row 1: Nama Pegawai & Tanggal Report */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field: Nama Pegawai (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface flex items-center gap-1">
                    Nama Pegawai
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full h-[42px] px-3.5 rounded-lg bg-surface-container border border-outline-variant/60 text-on-surface text-sm font-medium cursor-not-allowed select-none focus:ring-0"
                      readOnly
                      type="text"
                      value="Ahmad Fauzi"
                    />
                    <div className="absolute right-3.5 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[18px]">
                        lock
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-outline">
                    Otomatis sesuai akun login
                  </p>
                </div>

                {/* Field: Tanggal Report (Read-only / Otomatis) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface flex items-center gap-1">
                    Tanggal Report
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full h-[42px] px-3.5 rounded-lg bg-surface-container border border-outline-variant/60 text-on-surface text-sm font-medium cursor-not-allowed select-none focus:ring-0"
                      readOnly
                      type="text"
                      value="Senin, 28 September 2026"
                    />
                    <div className="absolute right-3.5 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[18px]">
                        calendar_month
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-outline">
                    Dicatat secara otomatis hari ini
                  </p>
                </div>
              </div>

              {/* Row 2: Bidang (Dropdown Dinamis & Tombol Tambah Bidang +) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-semibold text-on-surface flex items-center gap-1.5"
                    htmlFor="bidang-select"
                  >
                    <span>Bidang / Divisi</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsManageDivisionOpen(true)}
                    className="text-xs text-secondary hover:text-primary font-semibold flex items-center gap-1 transition-colors cursor-pointer hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add_circle
                    </span>
                    <span>Tambah Bidang +</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      className="w-full h-[42px] px-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-sm appearance-none focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 cursor-pointer"
                      id="bidang-select"
                      value={division}
                      onChange={(e) => {
                        if (e.target.value === "__ADD_NEW__") {
                          setIsManageDivisionOpen(true);
                        } else {
                          setDivision(e.target.value);
                        }
                      }}
                    >
                      {divisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                      <option
                        value="__ADD_NEW__"
                        className="font-semibold text-secondary"
                      >
                        + Tambah / Kelola Bidang...
                      </option>
                    </select>
                    <div className="absolute right-3.5 top-3 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsManageDivisionOpen(true)}
                    className="h-[42px] px-3.5 rounded-lg border border-secondary/80 bg-secondary/5 hover:bg-secondary/15 text-secondary text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Tambah atau kelola daftar bidang/divisi"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    <span className="hidden sm:inline">Tambah Bidang +</span>
                  </button>
                </div>
              </div>

              {/* Row 3: Apa yang dikerjakan hari ini? (Textarea) */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-on-surface flex items-center justify-between"
                  htmlFor="pekerjaan-input"
                >
                  <span>Apa yang dikerjakan hari ini?</span>
                  <span className="text-xs text-outline">Wajib diisi</span>
                </label>
                <textarea
                  className="w-full p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all leading-relaxed"
                  id="pekerjaan-input"
                  placeholder="Tuliskan aktivitas, pekerjaan, tugas, atau hasil yang telah diselesaikan hari ini secara rinci..."
                  rows={5}
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                />
                <div className="flex justify-end pt-1">
                  <span className="text-xs text-outline">
                    {tasks.length} / 1000 karakter
                  </span>
                </div>
              </div>

              {/* Row 4: Hasil dari pengerjaan hari ini (Textarea) */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-on-surface flex items-center justify-between"
                  htmlFor="hasil-input"
                >
                  <span>Hasil dari pengerjaan hari ini</span>
                  <span className="text-xs text-outline">Wajib diisi</span>
                </label>
                <textarea
                  className="w-full p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all leading-relaxed"
                  id="hasil-input"
                  placeholder="Tuliskan hasil, capaian, output, atau perkembangan konkret dari pengerjaan hari ini..."
                  rows={4}
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                />
                <div className="flex justify-end pt-1">
                  <span className="text-xs text-outline">
                    {results.length} / 1000 karakter
                  </span>
                </div>
              </div>

              {/* Section: Dokumentasi Pekerjaan */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      photo_library
                    </span>
                    Dokumentasi Pekerjaan
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Upload 1 foto dokumentasi pekerjaan. Format JPG, PNG,
                    WebP (maksimal 5 MB).
                  </p>
                </div>

                {/* 1 Slot Upload Grid */}
                <div className="grid grid-cols-1 gap-4 pt-1">
                  {/* Slot 1: Sudah ada foto preview */}
                  {photoAttached ? (
                    <div className="border-2 border-[#CBD5E1] rounded-xl p-4 bg-surface-container-lowest flex flex-col justify-between relative group hover:border-primary-container transition-colors duration-150">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                          Foto Dokumentasi
                        </span>
                        <button
                          className="text-error hover:bg-error-container/30 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                          title="Hapus Foto"
                          type="button"
                          onClick={() => setPhotoAttached(false)}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                             delete
                          </span>
                          Hapus Foto
                        </button>
                      </div>
                      <div className="flex items-center gap-3 bg-surface-container p-3 rounded-lg border border-outline-variant/60">
                        <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border border-outline-variant/40 bg-surface-variant">
                          <img
                            alt="dokumentasi_desain_kajian.jpg"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3kIG4oV_hEXsjD1ITSZV56PcTF7XSAfkSpKs6brQ84CJ_4L1DR9S6tkLSZuA2XM7DyXU-daCmvkUfflih6DL1cR4bHp0BbjuubFsHKFBNBvMxiRIi7co3cJ98q_vT-V0BSzg_Ba5oF_Yr__KNSPvNkTXbKaXjcfTVALOPQryxUIcfs8C03PQHc-2U78gemsb7Qi-eyT5IDmm8_gMtMafAKlQsQCFtaruOWf2a4vneMYqFVFSU_Zlyrg"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold text-on-surface truncate">
                            dokumentasi_desain_kajian.jpg
                          </p>
                          <p className="text-xs text-outline">2.1 MB • Terlampir</p>
                          <div className="flex items-center gap-1 text-secondary text-xs mt-0.5 font-medium">
                            <span className="material-symbols-outlined text-[14px]">
                              check_circle
                            </span>
                            <span>Siap kirim</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      onClick={() => setPhotoAttached(true)}
                      className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center hover:border-primary-container hover:bg-surface-container-low/40 transition-colors duration-150 flex flex-col items-center justify-center cursor-pointer min-h-[128px]"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-2 text-primary-container">
                        <span className="material-symbols-outlined text-[24px]">
                          add
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-on-surface">
                        Pilih atau Tarik Foto ke sini
                      </p>
                      <p className="text-[11px] text-outline mt-0.5">
                        PNG / JPG hingga 5MB
                      </p>
                      <input
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        type="file"
                        onChange={() => setPhotoAttached(true)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Tombol Sekunder / Simpan Draf */}
                <button
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">
                    save
                  </span>
                  <span>Simpan Draf Sementara</span>
                </button>

                {/* Tombol Utama / Kirim Report */}
                <button
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary-container hover:bg-secondary text-white font-semibold px-8 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform duration-150 active:scale-[0.99] text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                  <span>{loading ? 'MEMPROSES...' : 'Kirim & Publikasikan'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Banner Konfirmasi Sukses (Toast/Alert Preview) */}
          {showSuccessToast && (
            <div className="border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A7F3D0] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined font-bold text-[20px] text-[#065F46]">
                    check
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold">Report berhasil dikirim!</p>
                  <p className="text-xs sm:text-sm text-[#065F46]">
                    Daily report Anda telah tersimpan dan berstatus{" "}
                    <span className="font-semibold underline">PUBLISHED</span>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="text-[#065F46] hover:opacity-75 p-1 rounded-lg transition-opacity"
                title="Tutup"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
          )}

          {/* Footer Context Note */}
          <div className="text-center pb-8 pt-2">
            <p className="text-xs text-outline">
              © 2026 Lembaga Amil Zakat Persatuan Islam (LAZ Persis) • Divisi
              Humas &amp; Transformasi Digital
            </p>
          </div>
        </div>
      </main>

      {/* Modal Dialog: Kelola & Tambah Bidang / Divisi Dinamis */}
      <ManageDivisionModal
        isOpen={isManageDivisionOpen}
        onClose={() => setIsManageDivisionOpen(false)}
        divisions={divisions}
        selectedDivision={division}
        onAddDivision={handleAddDivision}
        onUpdateDivision={handleUpdateDivision}
        onDeleteDivision={handleDeleteDivision}
        onSelectDivision={(d) => setDivision(d)}
      />
    </AppShell>
  );
}
