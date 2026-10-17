"use client";

import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UserAvatar from "@/src/common/components/user-avatar";

export interface ApproverItem {
  id: string;
  name: string;
  role: string;
  division: string;
  position?: string | null;
  avatar?: string | null;
}

interface ApproverSearchSelectProps {
  value: string;
  onChange: (id: string) => void;
  approvers: ApproverItem[];
  placeholder?: string;
  disabledId?: string;
}

export default function ApproverSearchSelect({
  value,
  onChange,
  approvers,
  placeholder = "Pilih Rekan / Atasan",
  disabledId,
}: ApproverSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selected = useMemo(
    () => approvers.find((a) => a.id === value),
    [approvers, value]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return approvers;

    return approvers.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.division.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
    );
  }, [approvers, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm flex items-center justify-between gap-2 hover:border-secondary transition-colors text-left focus:outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
      >
        {selected ? (
          <div className="flex items-center gap-2.5 overflow-hidden flex-1">
            <UserAvatar
              name={selected.name}
              avatarUrl={selected.avatar}
              size="xs"
            />
            <span className="font-semibold truncate text-on-surface">
              {selected.name}
            </span>
            <span className="text-xs font-semibold text-secondary shrink-0">
              • {selected.division}
            </span>
          </div>
        ) : (
          <span className="text-outline truncate">{placeholder}</span>
        )}
        <span className="material-symbols-outlined text-[20px] text-outline shrink-0">
          unfold_more
        </span>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        className="w-[calc(100vw-2rem)] sm:w-[360px] p-2 bg-surface-container-lowest border border-outline-variant/80 rounded-xl shadow-xl z-50 overflow-hidden"
      >
        {/* Kolom Pencarian */}
        <div className="relative flex items-center px-2 py-1.5 border-b border-outline-variant/50">
          <span className="material-symbols-outlined text-[18px] text-outline shrink-0 mr-2">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, divisi, atau jabatan..."
            className="w-full text-xs bg-transparent border-0 text-on-surface placeholder:text-outline focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-outline hover:text-on-surface p-1 cursor-pointer shrink-0"
              title="Hapus pencarian"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Daftar Hasil Verifikator */}
        <div className="max-h-56 overflow-y-auto p-1 flex flex-col gap-1 mt-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-outline flex flex-col items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[24px] opacity-60">
                person_search
              </span>
              <span>Verifikator tidak ditemukan</span>
              <span className="text-[10px] text-outline/80">
                Coba kata kunci nama, divisi, atau jabatan lain.
              </span>
            </div>
          ) : (
            filtered.map((approver) => {
              const isSelected = approver.id === value;
              const isOther = approver.id === disabledId;

              return (
                <button
                  key={approver.id}
                  type="button"
                  disabled={isOther}
                  onClick={() => {
                    onChange(approver.id);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? "bg-secondary/15 text-secondary font-medium"
                      : isOther
                      ? "opacity-45 cursor-not-allowed bg-surface-container-low"
                      : "hover:bg-surface-container text-on-surface cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                    <UserAvatar
                      name={approver.name}
                      avatarUrl={approver.avatar}
                      size="xs"
                    />
                    <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-on-surface text-xs truncate">
                          {approver.name}
                        </span>
                        <span className="text-[11px] font-semibold text-secondary shrink-0">
                          • {approver.division}
                        </span>
                      </div>
                      <span className="text-[11px] text-outline truncate">
                        {isOther
                          ? "Sudah dipilih pada verifikator lain"
                          : approver.role}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                      check
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
