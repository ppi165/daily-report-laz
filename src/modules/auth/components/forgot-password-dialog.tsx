"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordResetInfoAction } from "../actions/request-password-reset-info.action";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserVerificationResult {
  id: string;
  name: string;
  division: string;
  username: string;
  email: string;
}

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UserVerificationResult | null>(null);

  const handleResetCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const res = await requestPasswordResetInfoAction({
      identifier: identifier.trim(),
    });

    setLoading(false);
    if (!res.success || !res.data) {
      setError(res.message || "Akun dengan username atau email tersebut tidak ditemukan.");
      return;
    }

    setResult(res.data);
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
    setResult(null);
    setIdentifier("");
  };

  const getWaLink = () => {
    if (!result) return "#";
    const message = `Assalamu'alaikum Admin LAZ Persis, saya ${result.name} (Divisi ${result.division}) dengan username "${result.username}" mengajukan permohonan reset password akun Daily Report LAZ Persis. Mohon bantuannya untuk mengatur ulang password akun saya. Terima kasih.`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-surface border-outline-variant/60 rounded-2xl p-6 text-on-surface shadow-2xl">
        <DialogHeader className="gap-1.5 pb-2 border-b border-outline-variant/40">
          <div className="size-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[22px]">
              lock_reset
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-on-surface">
            Bantuan Reset Password
          </DialogTitle>
          <DialogDescription className="text-xs text-outline leading-relaxed">
            Sesuai kebijakan keamanan LAZ Persis, pengaturan ulang password dikelola secara terpusat oleh Superadmin &amp; Admin.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleResetCheck} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-identifier" className="text-xs font-semibold text-on-surface">
                Masukkan Email atau Username Anda
              </Label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                  person_search
                </span>
                <Input
                  id="forgot-identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nama@lazpersis.or.id atau username"
                  className="pl-9 h-10 text-xs bg-surface-container-lowest border-outline-variant rounded-xl"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2.5 rounded-xl border-error/30 bg-error/10 text-error">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0">
                    error
                  </span>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </div>
              </Alert>
            )}

            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-[11px] text-outline flex flex-col gap-1.5 leading-relaxed">
              <span className="font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  info
                </span>
                SOP Reset Password:
              </span>
              <p>
                1. Masukkan identitas akun Anda untuk verifikasi status data amil di sistem.
              </p>
              <p>
                2. Sistem akan menyiapkan permohonan resmi untuk disampaikan kepada Administrator.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs rounded-xl border-outline-variant cursor-pointer font-medium"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-9 px-4 text-xs rounded-xl bg-secondary hover:bg-secondary/90 text-white cursor-pointer font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] animate-spin">
                      progress_activity
                    </span>
                    Memeriksa...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">
                      search
                    </span>
                    Verifikasi Akun
                  </span>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/25 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs">
                <span className="material-symbols-outlined text-[17px]">
                  check_circle
                </span>
                <span>Akun Ditemukan &amp; Terverifikasi</span>
              </div>
              <div className="text-xs text-on-surface space-y-0.5 mt-1 pt-1.5 border-t border-secondary/20">
                <p>
                  <strong className="text-outline">Nama:</strong> {result.name}
                </p>
                <p>
                  <strong className="text-outline">Divisi:</strong> {result.division}
                </p>
                <p>
                  <strong className="text-outline">Username:</strong> {result.username}
                </p>
              </div>
            </div>

            <p className="text-xs text-outline leading-relaxed">
              Silakan hubungi Administrator atau Superadmin LAZ Persis untuk mereset password akun Anda melalui modul Kelola Pengguna. Gunakan tautan WhatsApp di bawah untuk permohonan langsung:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href={getWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chat
                </span>
                <span>Hubungi Admin via WhatsApp</span>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full h-9 text-xs rounded-xl border-outline-variant cursor-pointer font-medium"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
