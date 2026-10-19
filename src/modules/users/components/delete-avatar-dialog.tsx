"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export default function DeleteAvatarDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
}: DeleteAvatarDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !loading && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-error/10 border border-error/25 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-[20px]">
                no_accounts
              </span>
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-on-surface">
                Hapus Foto Profil
              </DialogTitle>
              <DialogDescription className="text-xs text-on-surface-variant">
                Konfirmasi penghapusan foto profil akun Anda.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-xs text-on-surface-variant leading-relaxed">
          Apakah Anda yakin ingin menghapus foto profil saat ini? Tampilan foto akun Anda akan dikembalikan ke avatar default berbasis inisial nama.
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-surface-container">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-xs h-9 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-error hover:bg-error/90 text-white text-xs h-9 font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">
              {loading ? "progress_activity" : "delete"}
            </span>
            <span>{loading ? "Menghapus..." : "Ya, Hapus Foto"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
