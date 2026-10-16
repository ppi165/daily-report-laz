"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { updateUserAction } from "../actions/update-user.action";

export interface ManagedUserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  division: string;
  position: string | null;
  role: string;
  createdAt: string | Date;
}

interface EditRoleDialogProps {
  user: ManagedUserItem | null;
  divisions?: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSuccess: (message: string) => void;
  actorRole?: string;
}

export default function EditRoleDialog({
  user,
  divisions = [],
  onClose,
  onSuccess,
  actorRole,
}: EditRoleDialogProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPERVISOR" | "STAFF">("STAFF");
  const [position, setPosition] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email);
      setDivision(user.division);
      setRole((user.role === "ADMIN" || user.role === "SUPERVISOR" || user.role === "STAFF") ? user.role : "STAFF");
      setPosition(user.position || "Staf Pelaksana");
      setError(null);
    }
  }, [user]);

  if (!user) return null;

  const isTargetSuperadmin = user.role === "SUPERADMIN";
  const isActorAdmin = actorRole === "ADMIN";

  const handleUsernameChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    setUsername(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    setSubmitting(true);
    try {
      const res = await updateUserAction({
        targetUserId: user.id,
        name,
        username,
        email,
        division,
        role,
        position,
      });

      if (res.success) {
        onSuccess(res.message);
        onClose();
      } else {
        setError(res.message || "Gagal memperbarui data amil");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat memproses permintaan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-surface-container-lowest border-outline-variant max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">manage_accounts</span>
              <span>Edit Identitas & Hak Akses Amil</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-on-surface-variant">
              Khusus Admin / Superadmin untuk mengoreksi kredensial login, divisi, dan wewenang akun amil.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3.5 py-4">
            {error && (
              <Alert variant="destructive" className="py-2.5 rounded-xl border-error/25 bg-error/10 text-error">
                <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {isTargetSuperadmin && isActorAdmin && (
              <Alert className="py-2.5 rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-500">
                <AlertDescription className="text-xs font-medium">
                  Akun Superadmin dilindungi dan tidak dapat diubah oleh Admin.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-on-surface">Nama Lengkap Amil</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isTargetSuperadmin && isActorAdmin}
                className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <span>Username Login</span>
                  <span className="text-error">*</span>
                </Label>
                <Input
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  disabled={isTargetSuperadmin && isActorAdmin}
                  className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <span>Email Resmi</span>
                  <span className="text-error">*</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isTargetSuperadmin && isActorAdmin}
                  className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface">Divisi / Bidang</Label>
                <Select
                  value={division}
                  onValueChange={(val) => { if (val) setDivision(val); }}
                  disabled={isTargetSuperadmin && isActorAdmin}
                >
                  <SelectTrigger className="w-full h-10 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant">
                    <SelectValue placeholder="Pilih Divisi" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container-lowest border-outline-variant">
                    <SelectGroup>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface">Jabatan / Posisi</Label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  disabled={isTargetSuperadmin && isActorAdmin}
                  className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-on-surface">Tingkatan Hak Akses (Role)</Label>
              <Select
                value={role}
                onValueChange={(val) => { if (val) setRole(val as "ADMIN" | "SUPERVISOR" | "STAFF"); }}
                disabled={isTargetSuperadmin && isActorAdmin}
              >
                <SelectTrigger className="w-full h-10 text-xs sm:text-sm bg-surface-container-lowest border-outline-variant">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="bg-surface-container-lowest border-outline-variant">
                  <SelectGroup>
                    <SelectItem value="STAFF">
                      <div className="flex flex-col text-left py-0.5">
                        <span className="font-bold text-xs text-on-surface">STAFF (Amil Pelaksana)</span>
                        <span className="text-[11px] text-outline">Input Daily Report & Pengajuan Clock-in</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="SUPERVISOR">
                      <div className="flex flex-col text-left py-0.5">
                        <span className="font-bold text-xs text-secondary">SUPERVISOR (Koordinator Bidang)</span>
                        <span className="text-[11px] text-outline">Verifikator Clock-in susulan</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex flex-col text-left py-0.5">
                        <span className="font-bold text-xs text-amber-500">ADMIN (Pimpinan Harian / BPH)</span>
                        <span className="text-[11px] text-outline">Akses manajerial penuh ke seluruh sistem</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-surface-container">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
              className="text-xs h-9 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting || (isTargetSuperadmin && isActorAdmin)}
              className="bg-primary-container hover:bg-secondary text-white text-xs h-9 font-semibold cursor-pointer"
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
