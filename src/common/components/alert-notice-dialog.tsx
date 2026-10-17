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

export interface AlertNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  variant?: "error" | "info" | "warning";
}

export default function AlertNoticeDialog({
  open,
  onOpenChange,
  title,
  message,
  variant = "error",
}: AlertNoticeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-6 rounded-2xl">
        <DialogHeader className="flex flex-col gap-1 pb-2">
          <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[22px] ${
                variant === "error"
                  ? "text-error"
                  : variant === "warning"
                  ? "text-amber-500"
                  : "text-secondary"
              }`}
            >
              {variant === "error"
                ? "error"
                : variant === "warning"
                ? "warning"
                : "info"}
            </span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant text-xs cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
