"use client";

import { useState } from "react";
import AppShell from "@/src/common/components/app-shell";
import SuccessToast from "@/src/common/components/success-toast";
import ClockInApproverSelect from "@/src/modules/approvals/components/clock-in-approver-select";
import { createReportAction } from "../actions/create-report.action";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface UploadedFile {
  url: string;
  name: string;
  savedPercentage?: string;
}

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getHMinus3String = () => {
  const d = new Date();
  d.setDate(d.getDate() - 3);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ReportForm() {
  const [mode, setMode] = useState<"today" | "clock-in">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode") || params.get("type");
      if (urlMode === "clock-in") return "clock-in";
    }
    return "today";
  });

  const [division] = useState("Humas");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode") || params.get("type");
      if (urlMode === "clock-in") return getYesterdayString();
    }
    return getTodayString();
  });

  const [approver1, setApprover1] = useState("");
  const [approver2, setApprover2] = useState("");
  const [tasks, setTasks] = useState("");
  const [results, setResults] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toastData, setToastData] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const isClockIn = mode === "clock-in";

  const handleModeChange = (newMode: "today" | "clock-in") => {
    setMode(newMode);
    if (newMode === "clock-in") {
      setSelectedDate((prev) => (prev >= getTodayString() ? getYesterdayString() : prev));
    } else {
      setSelectedDate(getTodayString());
    }

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (newMode === "clock-in") {
        url.searchParams.set("mode", "clock-in");
      } else {
        url.searchParams.delete("mode");
        url.searchParams.delete("type");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setUploadedPhoto({
          url: json.url,
          name: json.originalName || file.name,
          savedPercentage: json.savedPercentage,
        });
      } else {
        alert(json.error || "Gagal mengunggah foto.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat mengunggah foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tasks.trim() || !results.trim()) {
      alert("Pekerjaan dan hasil pekerjaan wajib diisi!");
      return;
    }

    if (isClockIn) {
      if (!approver1 || !approver2) {
        alert("Pilih 2 orang saksi/atasan untuk memverifikasi clock-in daily report Anda!");
        return;
      }
      if (approver1 === approver2) {
        alert("Saksi verifikator 1 dan saksi verifikator 2 tidak boleh orang yang sama!");
        return;
      }
    }

    setLoading(true);

    const fullContent = `[PEKERJAAN]\n${tasks.trim()}\n\n[HASIL / OUTPUT]\n${results.trim()}`;

    try {
      const res = await createReportAction({
        title: isClockIn ? "Clock-in Daily Report" : "Daily Report",
        content: fullContent,
        division,
        attachments: uploadedPhoto ? [uploadedPhoto.url] : [],
        reportDate: isClockIn ? selectedDate : undefined,
        isClockIn,
        approverMockIds: isClockIn ? [approver1, approver2] : [],
      });

      if (res.success) {
        setToastData({
          title: isClockIn ? "Pengajuan Clock-in Berhasil Terkirim" : "Laporan Berhasil Diterbitkan",
          description: isClockIn
            ? "Laporan susulan tersimpan dengan status PENDING. Menunggu persetujuan 2 verifikator rekan kerja."
            : "Laporan aktivitas kerja hari ini telah tersimpan dan terpublikasi.",
        });

        setTasks("");
        setResults("");
        setUploadedPhoto(null);
        setApprover1("");
        setApprover2("");
      } else {
        alert(res.message || "Gagal menyimpan laporan.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell headerTitle="Buat Laporan Baru" headerBadge="Form Laporan">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Daily Report
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Laporkan aktivitas dan pekerjaan yang telah Anda lakukan secara amanah dan transparan.
            </p>
          </div>

          {/* Mode Switch Menggunakan shadcn Tabs */}
          <Tabs
            value={mode}
            onValueChange={(val) => handleModeChange(val as "today" | "clock-in")}
            className="w-full"
          >
            <TabsList className="bg-surface-container rounded-xl p-1 h-auto flex flex-wrap gap-1">
              <TabsTrigger
                value="today"
                className="rounded-lg text-xs sm:text-sm font-semibold py-2 px-4 cursor-pointer"
              >
                Hari Ini
              </TabsTrigger>
              <TabsTrigger
                value="clock-in"
                className="rounded-lg text-xs sm:text-sm font-semibold py-2 px-4 cursor-pointer"
              >
                Pengajuan Clock-In
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Pembungkus Form Card */}
          <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs relative">
            <CardContent className="p-6 sm:p-8">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Tanggal Pelaporan Kerja */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold text-on-surface" htmlFor="report-date-picker">
                    {isClockIn ? "Tanggal Laporan Susulan" : "Tanggal Pelaporan"}
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      id="report-date-picker"
                      className={`w-full h-11 px-3.5 rounded-xl border text-on-surface text-sm font-medium transition-colors ${
                        isClockIn
                          ? "bg-surface-container-lowest border-outline-variant focus-visible:ring-secondary/20 cursor-pointer"
                          : "bg-surface-container-low/50 border-outline-variant/60 cursor-default focus-visible:ring-0 opacity-90"
                      }`}
                      type="date"
                      min={isClockIn ? getHMinus3String() : undefined}
                      max={isClockIn ? getYesterdayString() : getTodayString()}
                      value={selectedDate}
                      readOnly={!isClockIn}
                      onChange={(e) => isClockIn && setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-sm font-semibold text-on-surface"
                    htmlFor="pekerjaan-input"
                  >
                    {isClockIn ? "Apa yang dikerjakan pada tanggal tersebut?" : "Apa yang dikerjakan hari ini?"}
                  </Label>
                  <Textarea
                    className="w-full p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus-visible:ring-secondary/20 transition-all leading-relaxed"
                    id="pekerjaan-input"
                    placeholder={
                      isClockIn
                        ? "Tuliskan aktivitas, pekerjaan, tugas, atau hasil yang telah diselesaikan pada tanggal tersebut secara rinci..."
                        : "Tuliskan aktivitas, pekerjaan, tugas, atau hasil yang telah diselesaikan hari ini secara rinci..."
                    }
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

                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-sm font-semibold text-on-surface"
                    htmlFor="hasil-input"
                  >
                    {isClockIn ? "Hasil dari pengerjaan pada tanggal tersebut" : "Hasil dari pengerjaan hari ini"}
                  </Label>
                  <Textarea
                    className="w-full p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus-visible:ring-secondary/20 transition-all leading-relaxed"
                    id="hasil-input"
                    placeholder={
                      isClockIn
                        ? "Tuliskan hasil, capaian, output, atau perkembangan konkret dari pengerjaan pada tanggal tersebut..."
                        : "Tuliskan hasil, capaian, output, atau perkembangan konkret dari pengerjaan hari ini..."
                    }
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

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-on-surface">
                      Dokumentasi Pekerjaan
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Upload 1 foto dokumentasi pekerjaan. Foto otomatis dikompresi ke format WebP untuk menghemat storage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-1">
                    {uploading ? (
                      <div className="border-2 border-dashed border-secondary rounded-xl p-8 bg-surface-container-low/40 flex flex-col items-center justify-center gap-2">
                        <div className="size-8 rounded-full border-3 border-secondary border-t-transparent animate-spin"></div>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error-container/30 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer h-auto"
                            title="Hapus Foto"
                            type="button"
                            onClick={() => setUploadedPhoto(null)}
                          >
                            <span data-icon="inline-start" className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                            <span>Hapus Foto</span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container p-3 rounded-lg border border-outline-variant/60">
                          <div className="size-16 rounded-md overflow-hidden shrink-0 border border-outline-variant/40 bg-surface-variant">
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
                              Format WebP {uploadedPhoto.savedPercentage ? `• Hemat ${uploadedPhoto.savedPercentage}` : ""}
                            </p>
                            <div className="text-secondary text-xs mt-0.5 font-medium">
                              <span>Tersimpan di Supabase</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center hover:border-primary-container hover:bg-surface-container-low/40 transition-colors duration-150 flex flex-col items-center justify-center cursor-pointer min-h-[128px]"
                      >
                        <div className="size-10 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-2 text-primary-container">
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

                {isClockIn && (
                  <ClockInApproverSelect
                    approver1={approver1}
                    approver2={approver2}
                    onChangeApprover1={setApprover1}
                    onChangeApprover2={setApprover2}
                  />
                )}

                <Separator className="bg-surface-container" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors text-sm font-medium cursor-pointer"
                    type="button"
                  >
                    Simpan Draf Sementara
                  </Button>

                  <Button
                    disabled={
                      loading ||
                      uploading ||
                      (isClockIn && (!approver1 || !approver2 || approver1 === approver2))
                    }
                    className="w-full sm:w-auto font-semibold px-8 py-3 rounded-xl shadow-md flex items-center justify-center transition-transform duration-150 active:scale-[0.99] text-sm disabled:opacity-60 disabled:cursor-not-allowed h-auto bg-primary-container hover:bg-secondary text-white cursor-pointer"
                    type="submit"
                  >
                    {loading
                      ? "MEMPROSES..."
                      : isClockIn
                      ? "Ajukan Laporan Susulan (Clock-in)"
                      : "Kirim & Publikasikan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {toastData && (
            <SuccessToast
              title={toastData.title}
              description={toastData.description}
              onClose={() => setToastData(null)}
            />
          )}
        </div>
      </main>
    </AppShell>
  );
}
