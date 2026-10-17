"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  id?: string;
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: {
    (options: ToastOptions): void;
    success: (description: string, title?: string) => void;
    error: (description: string, title?: string) => void;
    warning: (description: string, title?: string) => void;
    info: (description: string, title?: string) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Module-level emitter for calling toast from outside React components
type ToastHandler = (options: ToastOptions) => void;
let globalToastHandler: ToastHandler | null = null;

export const toast = {
  show: (options: ToastOptions) => {
    if (globalToastHandler) {
      globalToastHandler(options);
    }
  },
  success: (description: string, title = "Berhasil") => {
    if (globalToastHandler) {
      globalToastHandler({ title, description, variant: "success" });
    }
  },
  error: (description: string, title = "Peringatan") => {
    if (globalToastHandler) {
      globalToastHandler({ title, description, variant: "error" });
    }
  },
  warning: (description: string, title = "Perhatian") => {
    if (globalToastHandler) {
      globalToastHandler({ title, description, variant: "warning" });
    }
  },
  info: (description: string, title = "Pemberitahuan") => {
    if (globalToastHandler) {
      globalToastHandler({ title, description, variant: "info" });
    }
  },
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

interface ActiveToast extends ToastOptions {
  id: string;
  variant: ToastVariant;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (options: ToastOptions) => {
      const id = options.id || Math.random().toString(36).substring(2, 9);
      const variant: ToastVariant = options.variant || "info";
      const duration = options.duration ?? 4000;

      const newToast: ActiveToast = {
        ...options,
        id,
        variant,
      };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Maksimal 5 toast sekaligus

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  useEffect(() => {
    globalToastHandler = addToast;
    return () => {
      globalToastHandler = null;
    };
  }, [addToast]);

  // Intercept window.alert to automatically trigger the top-right Shadcn toast
  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalAlert = window.alert;
      window.alert = (message?: unknown) => {
        const text = String(message ?? "");
        const lower = text.toLowerCase();
        const isError = lower.includes("gagal") || lower.includes("error") || lower.includes("salah") || lower.includes("wajib");
        const isSuccess = lower.includes("berhasil") || lower.includes("sukses");

        addToast({
          title: isError ? "Perhatian" : isSuccess ? "Berhasil" : "Pemberitahuan",
          description: text,
          variant: isError ? "error" : isSuccess ? "success" : "info",
        });
      };

      return () => {
        window.alert = originalAlert;
      };
    }
  }, [addToast]);

  const toastContextMethods = {
    toast: Object.assign(
      (options: ToastOptions) => addToast(options),
      {
        success: (description: string, title = "Berhasil") =>
          addToast({ title, description, variant: "success" }),
        error: (description: string, title = "Peringatan") =>
          addToast({ title, description, variant: "error" }),
        warning: (description: string, title = "Perhatian") =>
          addToast({ title, description, variant: "warning" }),
        info: (description: string, title = "Pemberitahuan") =>
          addToast({ title, description, variant: "info" }),
      }
    ),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toastContextMethods}>
      {children}

      {/* Container Toast: Pojok Kanan Atas di Bawah Header (top-[72px] right-4) */}
      <div
        className="fixed top-[72px] right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const iconName =
            t.variant === "success"
              ? "check_circle"
              : t.variant === "error"
              ? "error"
              : t.variant === "warning"
              ? "warning"
              : "info";

          const borderBg =
            t.variant === "success"
              ? "bg-surface-container-lowest/95 border-secondary/40 text-on-surface"
              : t.variant === "error"
              ? "bg-surface-container-lowest/95 border-error/40 text-on-surface"
              : t.variant === "warning"
              ? "bg-surface-container-lowest/95 border-amber-500/40 text-on-surface"
              : "bg-surface-container-lowest/95 border-outline-variant/80 text-on-surface";

          const iconColor =
            t.variant === "success"
              ? "text-secondary"
              : t.variant === "error"
              ? "text-error"
              : t.variant === "warning"
              ? "text-amber-500"
              : "text-primary";

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-3",
                borderBg
              )}
            >
              <span className={cn("material-symbols-outlined text-[20px] shrink-0 mt-0.5", iconColor)}>
                {iconName}
              </span>

              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h5 className="text-xs sm:text-sm font-bold text-on-surface leading-tight">
                    {t.title}
                  </h5>
                )}
                <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                  {t.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-outline hover:text-on-surface transition-colors p-1 -mr-1 -mt-1 rounded-lg cursor-pointer shrink-0"
                title="Tutup Notifikasi"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
