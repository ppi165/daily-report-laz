"use client";

import { useState } from "react";

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 border-b border-surface-container flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                domain
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Kelola Bidang / Divisi
              </h3>
              <p className="text-xs text-on-surface-variant">
                Tambah, ubah, atau hapus daftar bidang kerja LAZ Persis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error flex items-center gap-2 text-xs font-medium animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
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
            <label
              htmlFor="new-division-input"
              className="text-xs font-semibold text-on-surface flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">
                add_circle
              </span>
              Tambah Bidang Baru
            </label>
            <div className="flex gap-2">
              <input
                id="new-division-input"
                type="text"
                placeholder="Contoh: ZISWAF, Pendidikan, Dakwah..."
                value={newDivisionInput}
                onChange={(e) => setNewDivisionInput(e.target.value)}
                className="flex-1 h-[42px] px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              <button
                type="submit"
                className="h-[42px] px-4 rounded-xl bg-secondary text-white font-medium text-xs sm:text-sm hover:bg-primary transition-colors flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                <span>Tambah +</span>
              </button>
            </div>
          </form>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant px-0.5">
              <span>Daftar Bidang Terdaftar</span>
              <span className="text-[11px] bg-surface-container px-2 py-0.5 rounded-full text-outline font-medium">
                {divisions.length} Bidang
              </span>
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
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(div);
                          if (e.key === "Escape") setEditingName(null);
                        }}
                        className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest border border-secondary text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(div)}
                        className="p-1.5 rounded-lg bg-secondary text-white hover:bg-primary transition-colors cursor-pointer"
                        title="Simpan Perubahan"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          check
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingName(null)}
                        className="p-1.5 rounded-lg bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
                        title="Batal"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Terpilih di Form
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectDivision(div);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-secondary hover:bg-secondary/10 rounded-lg transition-colors cursor-pointer"
                          title="Gunakan bidang ini pada formulir"
                        >
                          Pilih
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startEdit(div)}
                        className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                        title="Ubah nama bidang"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(div)}
                        className="p-1.5 text-outline hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                        title="Hapus bidang"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                      </button>
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
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
