"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface CameraCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

export default function CameraCaptureDialog({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureDialogProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);

  // Stop active media stream tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Check if device has multiple camera inputs (e.g. front & back)
  const checkCameraDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      setHasMultipleCameras(videoDevices.length > 1);
    } catch {
      setHasMultipleCameras(false);
    }
  }, []);

  // Start the video stream with desired facingMode
  const startCamera = useCallback(
    async (mode: "environment" | "user") => {
      stopStream();
      setErrorMsg(null);
      setIsLoadingCamera(true);

      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        setErrorMsg("Browser ini tidak mendukung akses live stream kamera langsung.");
        setIsLoadingCamera(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch {
            // Autoplay might require user interaction, handled gracefully
          }
        }
        await checkCameraDevices();
      } catch (err: unknown) {
        console.error("Camera access error:", err);
        const name = (err as { name?: string })?.name;
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setErrorMsg("Izin akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.");
        } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          setErrorMsg("Tidak ada perangkat kamera yang terdeteksi pada perangkat ini.");
        } else {
          setErrorMsg("Gagal mengaktifkan kamera. Anda dapat menggunakan kamera bawaan perangkat.");
        }
      } finally {
        setIsLoadingCamera(false);
      }
    },
    [stopStream, checkCameraDevices]
  );

  // Switch between front and back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from video to canvas
  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontal if using user (selfie) camera for natural mirror reflection
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedDataUrl(dataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
        }
      },
      "image/jpeg",
      0.92
    );

    stopStream();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedDataUrl(null);
    setCapturedBlob(null);
    startCamera(facingMode);
  };

  // Close dialog and clean up
  const handleClose = useCallback(() => {
    stopStream();
    setCapturedDataUrl(null);
    setCapturedBlob(null);
    setErrorMsg(null);
    onOpenChange(false);
  }, [stopStream, onOpenChange]);

  // Confirm photo and return File object
  const handleConfirmPhoto = useCallback(() => {
    if (!capturedBlob) return;
    const timestamp = Date.now();
    const fileName = `dokumentasi-${timestamp}.jpg`;
    const file = new File([capturedBlob], fileName, { type: "image/jpeg" });
    onCapture(file);
    handleClose();
  }, [capturedBlob, onCapture, handleClose]);

  // Handle fallback native mobile camera capture
  const handleNativeCaptureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onCapture(file);
    handleClose();
  };

  // Lifecycle when open changes
  useEffect(() => {
    if (open) {
      startCamera(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [open, facingMode, startCamera, stopStream]);

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleClose() : onOpenChange(val))}>
      <DialogContent className="sm:max-w-xl bg-surface-container-lowest border-outline-variant p-4 sm:p-6 rounded-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-bold text-on-surface flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-secondary">
                photo_camera
              </span>
              <span>Ambil Foto Dokumentasi</span>
            </span>

            {/* Switch camera button (if live stream active & multiple cameras available) */}
            {!capturedDataUrl && !errorMsg && hasMultipleCameras && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleToggleFacingMode}
                className="text-xs text-on-surface-variant hover:text-secondary flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant/60"
                title="Ganti Kamera Depan / Belakang"
              >
                <span className="material-symbols-outlined text-[18px]">cameraswitch</span>
                <span className="hidden sm:inline">
                  {facingMode === "environment" ? "Kamera Belakang" : "Kamera Depan"}
                </span>
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant">
            Posisikan kamera ke objek pekerjaan Anda lalu klik tombol jepret foto.
          </DialogDescription>
        </DialogHeader>

        {/* Viewfinder / Preview Container */}
        <div className="relative w-full aspect-4/3 sm:aspect-16/9 bg-black/95 rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/60">
          {capturedDataUrl ? (
            /* Snapshot Preview */
            <img
              src={capturedDataUrl}
              alt="Hasil Jepretan Dokumentasi"
              className="w-full h-full object-contain"
            />
          ) : errorMsg ? (
            /* Error & Native Camera Fallback State */
            <div className="p-6 text-center flex flex-col items-center justify-center gap-3 max-w-sm">
              <div className="size-12 rounded-full bg-error/15 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">videocam_off</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{errorMsg}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="text-xs bg-surface-container-low hover:bg-surface-container border-outline-variant flex items-center gap-1.5 cursor-pointer mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Buka Kamera Bawaan HP</span>
              </Button>
            </div>
          ) : (
            /* Live Camera Stream */
            <>
              {isLoadingCamera && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 gap-2">
                  <div className="size-8 rounded-full border-3 border-secondary border-t-transparent animate-spin"></div>
                  <span className="text-xs text-white/80 font-medium">Menghubungkan kamera...</span>
                </div>
              )}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />

              {/* Viewfinder Overlay Guide */}
              <div className="absolute inset-4 sm:inset-8 border border-white/20 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-t-2 border-l-2 border-secondary"></div>
                  <div className="w-3 h-3 border-t-2 border-r-2 border-secondary"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-b-2 border-l-2 border-secondary"></div>
                  <div className="w-3 h-3 border-b-2 border-r-2 border-secondary"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hidden Native Camera Input for Direct Fallback */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleNativeCaptureChange}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {capturedDataUrl ? (
            /* Actions after capturing */
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetake}
                className="text-xs flex items-center gap-1.5 border-outline-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span>Foto Ulang</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-xs cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmPhoto}
                  className="text-xs bg-primary-container hover:bg-secondary text-white font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Gunakan Foto</span>
                </Button>
              </div>
            </>
          ) : (
            /* Actions during live camera */
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="text-xs text-on-surface-variant flex items-center gap-1.5 border-outline-variant cursor-pointer"
                title="Buka aplikasi kamera bawaan perangkat"
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span className="hidden sm:inline">Kamera Bawaan HP</span>
                <span className="sm:hidden">Kamera HP</span>
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-xs cursor-pointer"
                >
                  Batal
                </Button>

                {/* Shutter Button */}
                <Button
                  type="button"
                  onClick={handleTakePhoto}
                  disabled={isLoadingCamera || Boolean(errorMsg)}
                  className="size-11 rounded-full bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center shadow-lg p-0 cursor-pointer disabled:opacity-40 transition-transform active:scale-95"
                  title="Jepret Foto"
                >
                  <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
