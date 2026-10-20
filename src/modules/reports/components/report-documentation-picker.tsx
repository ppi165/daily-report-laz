"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CameraCaptureDialog from "./camera-capture-dialog";

export interface UploadedFile {
  url: string;
  name: string;
  savedPercentage?: string;
}

export interface ReportDocumentationPickerProps {
  uploadedPhoto: UploadedFile | null;
  uploading: boolean;
  onUploadFile: (file: File) => void | Promise<void>;
  onRemovePhoto: () => void;
  required?: boolean;
}

export default function ReportDocumentationPicker({
  uploadedPhoto,
  uploading,
  onUploadFile,
  onRemovePhoto,
  required = true,
}: ReportDocumentationPickerProps) {
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya berkas gambar yang diperbolehkan.");
      return;
    }

    onUploadFile(file);
    // Reset file input value so selecting the same file again works
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya berkas gambar yang diperbolehkan.");
      return;
    }

    onUploadFile(file);
  };

  const handleSelectCamera = () => {
    setChoiceOpen(false);
    setTimeout(() => {
      setCameraOpen(true);
    }, 100);
  };

  const handleSelectGallery = () => {
    setChoiceOpen(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleCameraCapture = (file: File) => {
    onUploadFile(file);
  };

  return (
    <div className="flex flex-col gap-3 pt-2">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
          <span>Dokumentasi Pekerjaan</span>
          {required && <span className="text-xs font-bold text-error">* Wajib</span>}
        </h2>
        <p className="text-xs text-on-surface-variant">
          Unggah minimal 1 foto dokumentasi hasil atau aktivitas pekerjaan hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-1">
        {uploading ? (
          /* Loading State */
          <div className="border-2 border-dashed border-secondary rounded-xl p-8 bg-surface-container-low/40 flex flex-col items-center justify-center gap-2">
            <div className="size-8 rounded-full border-3 border-secondary border-t-transparent animate-spin"></div>
            <p className="text-xs font-semibold text-on-surface">Mengunggah foto dokumentasi...</p>
          </div>
        ) : uploadedPhoto ? (
          /* Uploaded Photo Preview Card */
          <div className="border border-outline-variant/80 rounded-2xl p-4 bg-surface-container-lowest flex flex-col gap-3 relative group hover:border-secondary transition-colors duration-150">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Foto Dokumentasi Terlampir</span>
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:bg-secondary/10 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer h-auto"
                  title="Ganti Foto"
                  type="button"
                  onClick={() => setChoiceOpen(true)}
                >
                  <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  <span>Ganti</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error hover:bg-error/10 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer h-auto"
                  title="Hapus Foto"
                  type="button"
                  onClick={onRemovePhoto}
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low/80 p-3 rounded-xl border border-outline-variant/60">
              <div className="size-16 rounded-lg overflow-hidden shrink-0 border border-outline-variant/40 bg-surface-variant">
                <img
                  alt={uploadedPhoto.name}
                  className="w-full h-full object-cover"
                  src={uploadedPhoto.url}
                />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold text-on-surface truncate">{uploadedPhoto.name}</p>
                <div className="text-secondary text-xs mt-0.5 font-medium flex items-center gap-1">
                  <span>Foto siap dilampirkan</span>
                  {uploadedPhoto.savedPercentage && (
                    <span className="text-[11px] text-on-surface-variant font-normal">
                      (hemat {uploadedPhoto.savedPercentage})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Compact Single Trigger Card with Pop-up on Click */
          <div
            onClick={() => setChoiceOpen(true)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-150 flex flex-col items-center justify-center cursor-pointer min-h-[140px] group ${
              isDragOver
                ? "border-secondary bg-surface-container-low/60 scale-[1.01]"
                : "border-outline-variant bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low/30"
            }`}
          >
            <div className="size-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-secondary/15 transition-all">
              <span className="material-symbols-outlined text-[26px]">add_a_photo</span>
            </div>
            <p className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
              <span>Klik untuk Lampirkan Foto Dokumentasi</span>
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Pilihan ambil foto langsung (kamera) atau unggah dari berkas / galeri
            </p>
            <p className="text-[10px] text-outline mt-1.5">
              Atau tarik & lepas (drag & drop) berkas foto (PNG, JPG, WEBP)
            </p>
          </div>
        )}
      </div>

      {/* Hidden Gallery / File Input */}
      <input
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />

      {/* Pop-up Dialog: Pilihan Sumber Foto Dokumentasi */}
      <Dialog open={choiceOpen} onOpenChange={setChoiceOpen}>
        <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-5 sm:p-6 rounded-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-secondary">
                add_a_photo
              </span>
              <span>Pilih Sumber Dokumentasi</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-on-surface-variant">
              Silakan pilih cara melampirkan foto hasil atau aktivitas pekerjaan Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 py-2">
            {/* Opsi 1: Ambil Foto Langsung */}
            <button
              type="button"
              onClick={handleSelectCamera}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-secondary/40 bg-secondary/5 hover:bg-secondary/15 hover:border-secondary transition-all text-left cursor-pointer group"
            >
              <div className="size-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">photo_camera</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Ambil Foto Langsung</span>
                <span className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                  Buka kamera perangkat untuk memotret saat ini
                </span>
              </div>
            </button>

            {/* Opsi 2: Pilih dari Galeri */}
            <button
              type="button"
              onClick={handleSelectGallery}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-outline-variant hover:border-secondary hover:bg-surface-container-low/40 transition-all text-left cursor-pointer group"
            >
              <div className="size-11 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform group-hover:text-secondary">
                <span className="material-symbols-outlined text-[24px]">photo_library</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Pilih dari Galeri / Berkas</span>
                <span className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                  Unggah file foto yang sudah tersimpan di perangkat
                </span>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Capture Dialog */}
      <CameraCaptureDialog
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}
