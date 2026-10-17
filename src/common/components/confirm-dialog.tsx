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

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "destructive",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-6 rounded-2xl">
        <DialogHeader className="flex flex-col gap-1 pb-2">
          <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[22px] ${
                variant === "destructive" ? "text-error" : "text-secondary"
              }`}
            >
              {variant === "destructive" ? "warning" : "help"}
            </span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-xl border-outline-variant text-xs cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={onConfirm}
            className={`h-9 px-4 rounded-xl text-white font-semibold text-xs transition-colors cursor-pointer ${
              variant === "destructive"
                ? "bg-error hover:bg-error/90"
                : "bg-secondary hover:bg-secondary/90"
            }`}
          >
            {loading ? "Memproses..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
