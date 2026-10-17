"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SessionNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: "idle_timeout" | null;
}

export default function SessionNoticeDialog({
  open,
  onOpenChange,
  reason,
}: SessionNoticeDialogProps) {
  if (!reason || reason !== "idle_timeout") return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-surface border-outline-variant/60 rounded-2xl p-6 text-on-surface shadow-2xl">
        <DialogHeader className="gap-2 items-center text-center pb-2">
          <div className="size-12 rounded-2xl flex items-center justify-center mb-1 bg-amber-500/15 text-amber-500 border border-amber-500/30">
            <span className="material-symbols-outlined text-[26px]">
              timer_off
            </span>
          </div>

          <DialogTitle className="text-lg font-bold text-on-surface">
            Sesi Tidak Aktif
          </DialogTitle>

          <DialogDescription className="text-xs text-outline leading-relaxed text-center">
            Anda tidak melakukan aktivitas selama 30 menit. Demi menjaga keamanan akun amil, sistem telah mengamankan sesi Anda secara otomatis.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full h-10 text-xs rounded-xl bg-secondary hover:bg-secondary/90 text-white cursor-pointer font-semibold shadow-xs"
          >
            Mengerti &amp; Masuk Kembali
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
