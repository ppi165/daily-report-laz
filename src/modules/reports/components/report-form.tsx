"use client";

import { useState, useEffect } from "react";
import AppShell from "@/src/common/components/app-shell";
import ManageDivisionModal from "./manage-division-modal";
import { createReportAction } from "../actions/create-report.action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadedFile {
  url: string;
  name: string;
  savedPercentage?: string;
}

export default function ReportForm() {
  const [userName, setUserName] = useState("Memuat nama...");
  const [todayFormatted, setTodayFormatted] = useState("");
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
  const [tasks, setTasks] = useState("");
  const [results, setResults] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await fetch("/api/v1/users/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.name) setUserName(json.data.name);
            if (json.data.division) {
              setDivision(json.data.division);
              setDivisions((prev) =>
                prev.includes(json.data.division) ? prev : [json.data.division, ...prev]
              );
            }
          }
        }
      } catch {
        setUserName("Pegawai");
      }
    }

    loadCurrentUser();

    const formatted = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    setTodayFormatted(formatted);
  }, []);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reports");

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedPhoto({
          url: data.url,
          name: file.name.replace(/\.[^/.]+$/, "") + ".webp",
          savedPercentage: data.savedPercentage,
        });
      } else {
        alert(data.message || "Gagal mengunggah foto.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi saat mengunggah foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const combinedContent = `**Pekerjaan:**\n${tasks}\n\n**Hasil:**\n${results}`;
    const attachments = uploadedPhoto?.url ? [uploadedPhoto.url] : [];

    try {
      const result = await createReportAction({
        title: "Laporan Harian",
        content: combinedContent,
        division: division,
        attachments,
      });

      if (result.success) {
        setShowSuccessToast(true);
        setTasks("");
        setResults("");
        setUploadedPhoto(null);
      } else {
        alert(result.message || "Gagal mengirim laporan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell headerTitle="Daily Report LAZ Persis" headerBadge={`Unit ${division}`}>
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
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

          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7 relative">
            <div className="absolute top-0 left-8 right-8 h-1 bg-primary-container rounded-t-2xl"></div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-on-surface flex items-center gap-1">
                    Nama Pegawai
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      className="w-full h-[42px] px-3.5 rounded-lg bg-surface-container border border-outline-variant/60 text-on-surface text-sm font-medium cursor-not-allowed select-none focus-visible:ring-0"
                      readOnly
                      type="text"
                      value={userName}
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

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-on-surface flex items-center gap-1">
                    Tanggal Report
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      className="w-full h-[42px] px-3.5 rounded-lg bg-surface-container border border-outline-variant/60 text-on-surface text-sm font-medium cursor-not-allowed select-none focus-visible:ring-0"
                      readOnly
                      type="text"
                      value={todayFormatted || "Hari ini"}
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

              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold text-on-surface flex items-center gap-1.5"
                  htmlFor="bidang-select"
                >
                  <span>Bidang</span>
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={division}
                      onValueChange={(val) => {
                        if (val === "__ADD_NEW__") {
                          setIsManageDivisionOpen(true);
                        } else if (val) {
                          setDivision(val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-[42px] px-3.5 rounded-lg bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
                        <SelectValue placeholder="Pilih Bidang" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface-container-lowest border-outline-variant">
                        {divisions.map((div) => (
                          <SelectItem key={div} value={div}>
                            {div}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="__ADD_NEW__"
                          className="font-semibold text-secondary"
                        >
                          + Tambah / Kelola Bidang...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsManageDivisionOpen(true)}
                    className="h-[42px] px-3.5 rounded-lg border-secondary/80 bg-secondary/5 hover:bg-secondary/15 text-secondary text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Tambah atau kelola daftar bidang"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    <span>Tambah Bidang</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold text-on-surface flex items-center justify-between"
                  htmlFor="pekerjaan-input"
                >
                  <span>Apa yang dikerjakan hari ini?</span>
                  <span className="text-xs text-outline">Wajib diisi</span>
                </Label>
                <Textarea
                  className="w-full p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus-visible:ring-secondary/20 transition-all leading-relaxed"
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

              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold text-on-surface flex items-center justify-between"
                  htmlFor="hasil-input"
                >
                  <span>Hasil dari pengerjaan hari ini</span>
                  <span className="text-xs text-outline">Wajib diisi</span>
                </Label>
                <Textarea
                  className="w-full p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus-visible:ring-secondary/20 transition-all leading-relaxed"
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

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      photo_library
                    </span>
                    Dokumentasi Pekerjaan
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Upload 1 foto dokumentasi pekerjaan. Foto otomatis dikompresi ke format WebP untuk menghemat storage.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1">
                  {uploading ? (
                    <div className="border-2 border-dashed border-secondary rounded-xl p-8 bg-surface-container-low/40 flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full border-3 border-secondary border-t-transparent animate-spin"></div>
                      <p className="text-xs font-semibold text-on-surface">
                        Mengompresi ke WebP &amp; Mengunggah ke Storage...
                      </p>
                    </div>
                  ) : uploadedPhoto ? (
                    <div className="border-2 border-[#CBD5E1] rounded-xl p-4 bg-surface-container-lowest flex flex-col justify-between relative group hover:border-primary-container transition-colors duration-150">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                          Foto Dokumentasi (WebP)
                        </span>
                        <button
                          className="text-error hover:bg-error-container/30 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Hapus Foto"
                          type="button"
                          onClick={() => setUploadedPhoto(null)}
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
                            alt={uploadedPhoto.name}
                            className="w-full h-full object-cover"
                            src={uploadedPhoto.url}
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold text-on-surface truncate">
                            {uploadedPhoto.name}
                          </p>
                          <p className="text-xs text-outline">
                            Format WebP {uploadedPhoto.savedPercentage ? `• Hemat ${uploadedPhoto.savedPercentage}` : ''}
                          </p>
                          <div className="flex items-center gap-1 text-secondary text-xs mt-0.5 font-medium">
                            <span className="material-symbols-outlined text-[14px]">
                              check_circle
                            </span>
                            <span>Tersimpan di Supabase</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
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
                        PNG / JPG / WEBP (otomatis dikompresi)
                      </p>
                      <input
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">
                    save
                  </span>
                  <span>Simpan Draf Sementara</span>
                </Button>

                <Button
                  disabled={loading || uploading}
                  className="w-full sm:w-auto bg-primary-container hover:bg-secondary text-white font-semibold px-8 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform duration-150 active:scale-[0.99] text-sm disabled:opacity-70 disabled:cursor-not-allowed h-auto"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                  <span>{loading ? 'MEMPROSES...' : 'Kirim & Publikasikan'}</span>
                </Button>
              </div>
            </form>
          </div>

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
        </div>
      </main>

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
