"use client";

import { Button } from "@/components/ui/button";

interface SuccessToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function SuccessToast({
  title,
  description,
  onClose,
}: SuccessToastProps) {
  return (
    <div className="border border-secondary/30 bg-secondary/10 dark:bg-secondary/15 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all duration-200 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined font-bold text-[20px]">
            check_circle
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-on-surface">{title}</p>
          <p className="text-xs sm:text-sm text-on-surface-variant truncate sm:whitespace-normal">
            {description}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="size-8 text-on-surface-variant hover:text-on-surface hover:bg-secondary/20 shrink-0 ml-2"
        title="Tutup"
        aria-label="Tutup Notifikasi"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </Button>
    </div>
  );
}
