"use client";

import { MOCK_APPROVERS } from "../constants/mock-approvers";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClockInApproverSelectProps {
  approver1: string;
  approver2: string;
  onChangeApprover1: (id: string) => void;
  onChangeApprover2: (id: string) => void;
}

export default function ClockInApproverSelect({
  approver1,
  approver2,
  onChangeApprover1,
  onChangeApprover2,
}: ClockInApproverSelectProps) {
  const isSame = Boolean(approver1 && approver2 && approver1 === approver2);
  const isValid = Boolean(approver1 && approver2 && !isSame);

  const selected1 = MOCK_APPROVERS.find((a) => a.id === approver1);
  const selected2 = MOCK_APPROVERS.find((a) => a.id === approver2);

  return (
    <div className="flex flex-col gap-4 rounded-2xl p-5 border border-outline-variant/60 bg-surface-container-low/40">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-on-surface">
          Persetujuan Clock-in (2 Verifikator)
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Pilih 2 orang rekan kerja atau atasan yang akan memverifikasi bahwa pekerjaan pada tanggal susulan ini benar-benar telah terlaksana.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Verifikator 1 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-on-surface">
            Verifikator 1
          </Label>
          <Select value={approver1} onValueChange={(val) => { if (val) onChangeApprover1(val); }}>
            <SelectTrigger className="w-full h-11 px-3 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
              <SelectValue placeholder="Pilih Rekan / Atasan 1" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border-outline-variant">
              <SelectGroup>
                {MOCK_APPROVERS.map((approver) => (
                  <SelectItem key={approver.id} value={approver.id}>
                    <span className="font-medium">{approver.name}</span>
                    <span className="text-xs text-outline ml-1.5">({approver.role})</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Verifikator 2 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-on-surface">
            Verifikator 2
          </Label>
          <Select value={approver2} onValueChange={(val) => { if (val) onChangeApprover2(val); }}>
            <SelectTrigger className="w-full h-11 px-3 rounded-xl bg-surface-container-lowest border-outline-variant text-on-surface text-sm">
              <SelectValue placeholder="Pilih Rekan / Atasan 2" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border-outline-variant">
              <SelectGroup>
                {MOCK_APPROVERS.map((approver) => (
                  <SelectItem key={approver.id} value={approver.id}>
                    <span className="font-medium">{approver.name}</span>
                    <span className="text-xs text-outline ml-1.5">({approver.role})</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
      {isValid && selected1 && selected2 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-on-surface-variant">
          <span className="font-semibold text-on-surface">Pihak Verifikator:</span>
          <span className="px-2 py-0.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-medium">
            1. {selected1.name} ({selected1.division})
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-medium">
            2. {selected2.name} ({selected2.division})
          </span>
        </div>
      )}
    </div>
  );
}
