"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

export interface AlertOptions {
  title?: string;
  description: string;
  buttonText?: string;
  variant?: "error" | "warning" | "info" | "success";
}

interface DialogContextValue {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
  alert: (options: AlertOptions | string) => Promise<void>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  // Confirm State
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    variant: "destructive" | "default";
    resolve?: (value: boolean) => void;
  }>({
    open: false,
    title: "Konfirmasi",
    description: "",
    confirmText: "Lanjutkan",
    cancelText: "Batal",
    variant: "default",
  });

  // Alert State
  const [alertState, setAlertState] = useState<{
    open: boolean;
    title: string;
    description: string;
    buttonText: string;
    variant: "error" | "warning" | "info" | "success";
    resolve?: () => void;
  }>({
    open: false,
    title: "Pemberitahuan",
    description: "",
    buttonText: "Mengerti",
    variant: "info",
  });

  const confirm = useCallback((options: ConfirmOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const isString = typeof options === "string";
      const title = isString ? "Konfirmasi Tindakan" : options.title || "Konfirmasi Tindakan";
      const description = isString ? options : options.description;
      const isHapus = description.toLowerCase().includes("hapus") || title.toLowerCase().includes("hapus");
      const variant = isString ? (isHapus ? "destructive" : "default") : options.variant || (isHapus ? "destructive" : "default");
      const confirmText = isString
        ? isHapus ? "Hapus" : "Lanjutkan"
        : options.confirmText || (variant === "destructive" ? "Hapus" : "Lanjutkan");
      const cancelText = isString ? "Batal" : options.cancelText || "Batal";

      setConfirmState({
        open: true,
        title,
        description,
        confirmText,
        cancelText,
        variant,
        resolve,
      });
    });
  }, []);

  const showAlert = useCallback((options: AlertOptions | string) => {
    return new Promise<void>((resolve) => {
      const isString = typeof options === "string";
      const title = isString ? "Pemberitahuan" : options.title || "Pemberitahuan";
      const description = isString ? options : options.description;
      const buttonText = isString ? "Mengerti" : options.buttonText || "Mengerti";
      const variant = isString ? "info" : options.variant || "info";

      setAlertState({
        open: true,
        title,
        description,
        buttonText,
        variant,
        resolve,
      });
    });
  }, []);

  // DialogProvider focuses on modal confirmation dialogs (confirm)
  // while window.alert and general notifications are handled by ToastProvider in top-right
  const handleConfirmClose = (result: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
    }
    setConfirmState((prev) => ({ ...prev, open: false, resolve: undefined }));
  };

  const handleAlertClose = () => {
    if (alertState.resolve) {
      alertState.resolve();
    }
    setAlertState((prev) => ({ ...prev, open: false, resolve: undefined }));
  };

  return (
    <DialogContext.Provider value={{ confirm, alert: showAlert }}>
      {children}

      {/* Confirmation Dialog (e.g. Delete, Action Confirm) */}
      <Dialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) handleConfirmClose(false);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md bg-surface-container-lowest border-outline-variant/70 p-6 rounded-2xl shadow-lg"
        >
          <DialogHeader className="flex flex-col gap-1 pb-1">
            <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  confirmState.variant === "destructive" ? "text-error" : "text-secondary"
                }`}
              >
                {confirmState.variant === "destructive" ? "delete" : "help"}
              </span>
              <span>{confirmState.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {confirmState.description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleConfirmClose(false)}
              className="h-9 px-4 rounded-xl border-outline-variant text-xs font-medium cursor-pointer hover:bg-surface-container"
            >
              {confirmState.cancelText}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleConfirmClose(true)}
              className={`h-9 px-4 rounded-xl text-white font-medium text-xs cursor-pointer transition-colors ${
                confirmState.variant === "destructive"
                  ? "bg-error hover:bg-error/90"
                  : "bg-secondary hover:bg-secondary/90"
              }`}
            >
              {confirmState.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Notice Dialog */}
      <Dialog
        open={alertState.open}
        onOpenChange={(open) => {
          if (!open) handleAlertClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md bg-surface-container-lowest border-outline-variant/70 p-6 rounded-2xl shadow-lg"
        >
          <DialogHeader className="flex flex-col gap-1 pb-1">
            <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  alertState.variant === "error"
                    ? "text-error"
                    : alertState.variant === "warning"
                    ? "text-amber-500"
                    : alertState.variant === "success"
                    ? "text-secondary"
                    : "text-secondary"
                }`}
              >
                {alertState.variant === "error"
                  ? "error"
                  : alertState.variant === "warning"
                  ? "warning"
                  : alertState.variant === "success"
                  ? "check_circle"
                  : "info"}
              </span>
              <span>{alertState.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {alertState.description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAlertClose}
              className="h-9 px-4 rounded-xl border-outline-variant text-xs font-medium cursor-pointer hover:bg-surface-container"
            >
              {alertState.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}
