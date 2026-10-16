"use client";

import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApproverSearchSelect from "./approver-search-select";

export interface ApproverOption {
  id: string;
  name: string;
  division: string;
  role: string;
  position?: string | null;
}

interface ClockInApproverSelectProps {
  approver1: string;
  approver2: string;
  onChangeApprover1: (id: string) => void;
  onChangeApprover2: (id: string) => void;
  requiredCount?: number;
  approvers?: ApproverOption[];
}

export default function ClockInApproverSelect({
  approver1,
  approver2,
  onChangeApprover1,
  onChangeApprover2,
  requiredCount = 2,
  approvers = [],
}: ClockInApproverSelectProps) {
  const isSingle = requiredCount === 1;
  const isSame = Boolean(!isSingle && approver1 && approver2 && approver1 === approver2);
  const isValid = isSingle ? Boolean(approver1) : Boolean(approver1 && approver2 && !isSame);

  const approverList = approvers;

  const selected1 = approverList.find((a) => a.id === approver1);
  const selected2 = approverList.find((a) => a.id === approver2);

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-5 border border-outline-variant/60 bg-surface-container-low/40">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-on-surface">
          Persetujuan Clock-in ({isSingle ? "1 Verifikator" : "2 Verifikator"})
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {isSingle
            ? "Pilih 1 orang rekan kerja atau atasan yang akan memverifikasi bahwa pekerjaan pada tanggal susulan ini benar-benar telah terlaksana."
            : "Pilih 2 orang rekan kerja atau atasan yang akan memverifikasi bahwa pekerjaan pada tanggal susulan ini benar-benar telah terlaksana."}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isSingle ? "w-full sm:max-w-md" : "sm:grid-cols-2"} gap-4 pt-1`}>
        {/* Verifikator 1 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
            <span>{isSingle ? "Verifikator" : "Verifikator 1"}</span>
            <span className="text-error font-bold" title="Wajib dipilih">*</span>
          </Label>
          <ApproverSearchSelect
            value={approver1}
            onChange={onChangeApprover1}
            approvers={approverList}
            placeholder={isSingle ? "Cari nama, divisi, jabatan..." : "Cari Verifikator 1..."}
            disabledId={!isSingle ? approver2 : undefined}
          />
        </div>

        {/* Verifikator 2 */}
        {!isSingle && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
              <span>Verifikator 2</span>
              <span className="text-error font-bold" title="Wajib dipilih">*</span>
            </Label>
            <ApproverSearchSelect
              value={approver2}
              onChange={onChangeApprover2}
              approvers={approverList}
              placeholder="Cari Verifikator 2..."
              disabledId={approver1}
            />
          </div>
        )}
      </div>

      {/* Peringatan jika sama */}
      {isSame && (
        <Alert variant="destructive" className="py-2.5 rounded-xl border-error/25 bg-error/10 text-error">
          <AlertDescription className="text-xs font-medium">
            Verifikator 1 dan Verifikator 2 tidak boleh orang yang sama. Harap pilih rekan yang berbeda.
          </AlertDescription>
        </Alert>
      )}

      {/* Status ringkas verifikator terpilih */}
      {isValid && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-on-surface-variant">
          <span className="font-semibold text-on-surface">Pihak Verifikator Terpilih:</span>
          {selected1 && (
            <span className="text-xs text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span>{isSingle ? "" : "1. "}</span>
              <strong className="text-secondary">{selected1.name}</strong>
              <span className="text-outline">({selected1.division})</span>
            </span>
          )}
          {!isSingle && selected2 && (
            <span className="text-xs text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span>2. </span>
              <strong className="text-secondary">{selected2.name}</strong>
              <span className="text-outline">({selected2.division})</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
