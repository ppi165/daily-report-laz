"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ManageDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  divisions: string[];
  selectedDivision: string;
  onAddDivision: (name: string) => void;
  onUpdateDivision: (oldName: string, newName: string) => void;
  onDeleteDivision: (name: string) => void;
  onSelectDivision: (name: string) => void;
}

export default function ManageDivisionModal({
  isOpen,
  onClose,
  divisions,
  selectedDivision,
  onAddDivision,
  onUpdateDivision,
  onDeleteDivision,
  onSelectDivision,
}: ManageDivisionModalProps) {
  const [newDivisionInput, setNewDivisionInput] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newDivisionInput.trim();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!trimmed) {
      setErrorMessage("Nama bidang / divisi tidak boleh kosong.");
      return;
    }

    if (divisions.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`Bidang "${trimmed}" sudah ada dalam daftar.`);
      return;
    }

    onAddDivision(trimmed);
    setNewDivisionInput("");
    setSuccessMessage(`Bidang "${trimmed}" berhasil ditambahkan!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const startEdit = (name: string) => {
    setEditingName(name);
    setEditValue(name);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSaveEdit = (oldName: string) => {
    const trimmed = editValue.trim();
    setErrorMessage(null);

    if (!trimmed) {
      setErrorMessage("Nama bidang tidak boleh kosong.");
      return;
    }

    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      divisions.some((d) => d.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrorMessage(`Bidang "${trimmed}" sudah ada dalam daftar.`);
      return;
    }

    onUpdateDivision(oldName, trimmed);
    setEditingName(null);
    setSuccessMessage(`Bidang berhasil diubah menjadi "${trimmed}".`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDelete = (name: string) => {
    if (divisions.length <= 1) {
      setErrorMessage("Minimal harus ada 1 bidang/divisi terdaftar.");
      return;
    }
    setErrorMessage(null);
    onDeleteDivision(name);
    setSuccessMessage(`Bidang "${name}" berhasil dihapus.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg bg-surface-container-lowest border-outline-variant p-0 overflow-hidden sm:max-w-lg">
        <DialogHeader className="px-6 py-4 border-b border-surface-container bg-surface-container-low/40">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                domain
              </span>
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-on-surface">
                Kelola Bidang / Divisi
              </DialogTitle>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Tambah, ubah, atau hapus daftar bidang kerja LAZ Persis
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {errorMessage && (
            <Alert variant="destructive" className="bg-error-container/40 border-error/20 text-error p-3">
              <span className="material-symbols-outlined text-[18px]">
                error
              </span>
              <AlertDescription className="text-xs font-medium ml-2">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-center gap-2 text-xs font-medium animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-2">
            <Label
              htmlFor="new-division-input"
              className="text-xs font-semibold text-on-surface flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">
                add_circle
              </span>
              Tambah Bidang Baru
            </Label>
            <div className="flex gap-2">
              <Input
                id="new-division-input"
                type="text"
                placeholder="Contoh: ZISWAF, Pendidikan, Dakwah..."
                value={newDivisionInput}
                onChange={(e) => setNewDivisionInput(e.target.value)}
                className="flex-1 h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm"
              />
              <Button
                type="submit"
                className="h-[42px] px-4 rounded-xl bg-secondary text-white font-medium text-xs sm:text-sm hover:bg-primary transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                <span>Tambah +</span>
              </Button>
            </div>
          </form>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant px-0.5">
              <span>Daftar Bidang Terdaftar</span>
              <Badge variant="secondary" className="text-[11px] bg-surface-container px-2 py-0.5 text-outline font-medium">
                {divisions.length} Bidang
              </Badge>
            </div>

            <div className="border border-outline-variant/60 rounded-xl overflow-hidden divide-y divide-outline-variant/40 bg-surface-container-lowest">
              {divisions.map((div) => {
                const isSelected = selectedDivision === div;
                const isEditing = editingName === div;

                if (isEditing) {
                  return (
                    <div
                      key={div}
                      className="p-2.5 bg-surface-container-low/60 flex items-center gap-2"
                    >
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(div);
                          if (e.key === "Escape") setEditingName(null);
                        }}
                        className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest border-secondary text-on-surface text-xs sm:text-sm"
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => handleSaveEdit(div)}
                        className="h-8 w-8 bg-secondary text-white hover:bg-primary"
                        title="Simpan Perubahan"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          check
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingName(null)}
                        className="h-8 w-8 bg-surface-container text-outline hover:text-on-surface"
                        title="Batal"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </Button>
                    </div>
                  );
                }

                return (
                  <div
                    key={div}
                    className="p-3 flex items-center justify-between hover:bg-surface-container-low/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[18px] text-outline shrink-0">
                        corporate_fare
                      </span>
                      <span className="text-sm font-medium text-on-surface truncate">
                        {div}
                      </span>
                      {isSelected && (
                        <Badge variant="secondary" className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md shrink-0 border-transparent">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Terpilih di Form
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!isSelected && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSelectDivision(div);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-secondary hover:bg-secondary/10 h-7"
                          title="Gunakan bidang ini pada formulir"
                        >
                          Pilih
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(div)}
                        className="h-7 w-7 text-outline hover:text-on-surface hover:bg-surface-container"
                        title="Ubah nama bidang"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          edit
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(div)}
                        className="h-7 w-7 text-outline hover:text-error hover:bg-error-container/30"
                        title="Hapus bidang"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-surface-container bg-surface-container-low/30 flex items-center justify-between">
          <span className="text-xs text-outline">
            Perubahan langsung aktif di dropdown
          </span>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold"
          >
            Selesai
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
