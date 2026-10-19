"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserAvatar from "@/src/common/components/user-avatar";
import { deleteUserAction } from "../actions/delete-user.action";
import type { ManagedUserItem } from "./edit-role-dialog";

interface DeleteUserDialogProps {
  user: ManagedUserItem | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function DeleteUserDialog({
  user,
  onClose,
  onSuccess,
}: DeleteUserDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleDelete = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await deleteUserAction({ targetUserId: user.id });
      if (res.success) {
        onSuccess(res.message || `Akun amil "${user.name}" berhasil dihapus.`);
        onClose();
      } else {
        setError(res.message || "Gagal menghapus pengguna.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menghapus pengguna.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && !submitting && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-error/10 border border-error/25 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-[20px]">
                person_remove
              </span>
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-on-surface">
                Hapus Akun Pengguna
              </DialogTitle>
              <DialogDescription className="text-xs text-on-surface-variant">
                Konfirmasi penghapusan akun amil dari sistem LAZ Persis.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {error && (
            <Alert variant="destructive" className="py-2.5 rounded-xl border-error/25 bg-error/10 text-error">
              <span className="material-symbols-outlined text-[16px] mr-1.5">error</span>
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {/* Kartu Profil Amil Sasaran */}
          <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 flex items-center gap-3">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatar}
              size="md"
              className="border border-outline-variant shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-on-surface truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/50 font-mono text-secondary shrink-0">
                  {user.role}
                </span>
              </div>
              <span className="text-xs text-outline font-mono truncate">
                @{user.username}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                Divisi: <span className="font-semibold text-secondary">{user.division}</span>
                {user.position ? ` • ${user.position}` : ""}
              </span>
            </div>
          </div>

          {/* Peringatan Bahaya */}
          <div className="p-3 rounded-xl bg-error/5 border border-error/20 flex gap-2.5 items-start">
            <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">
              warning
            </span>
            <div className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-error">Peringatan: </span>
              Tindakan ini bersifat permanen. Seluruh riwayat laporan, notifikasi, dan hak akses yang terkait dengan akun ini akan dihapus dari sistem dan tidak dapat dipulihkan.
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-surface-container">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
            className="text-xs h-9 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
            className="bg-error hover:bg-error/90 text-white text-xs h-9 font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">
              {submitting ? "progress_activity" : "delete"}
            </span>
            <span>{submitting ? "Menghapus..." : "Ya, Hapus Pengguna"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
