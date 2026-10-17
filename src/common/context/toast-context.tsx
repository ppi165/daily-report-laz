"use client";

import {
  toast,
  Toaster,
  Toaster as ToastProvider,
  useToastManager,
} from "@/components/ui/toast";

export { toast, Toaster, ToastProvider, useToastManager };

export function useToast() {
  const manager = useToastManager();
  return {
    toast,
    dismiss: (id?: string) => manager.close(id),
    toasts: manager.toasts,
  };
}
