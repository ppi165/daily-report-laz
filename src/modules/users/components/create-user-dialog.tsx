"use client";

import { useState } from "react";
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
import { createUserAction } from "../actions/create-user.action";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  divisions: Array<{ id: string; name: string }>;
  onSuccess: (message: string) => void;
}

export default function CreateUserDialog({
  open,
  onOpenChange,
  divisions,
  onSuccess,
}: CreateUserDialogProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPERVISOR" | "STAFF">("STAFF");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setUsername("");
    setEmail("");
    setDivision("");
    setPosition("");
    setRole("STAFF");
    setError(null);
  };

  const handleUsernameChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    setUsername(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!division) {
      setError("Silakan pilih divisi penugasan amil.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createUserAction({
        name,
        username,
        email,
        division,
        position: position.trim() || "Staf Pelaksana",
        role,
      });

      if (res.success) {
        onSuccess(res.message);
        resetForm();
        onOpenChange(false);
      } else {
        setError(res.message || "Gagal membuat akun amil");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat memproses permintaan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
      <DialogContent className="sm:max-w-lg bg-surface-container-lowest border-outline-variant max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">person_add</span>
              <span>Pendaftaran Amil Baru</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-on-surface-variant">
              Buat akun amil baru ke dalam sistem dan tentukan tingkatan hak aksesnya.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3.5 py-4">
            {error && (
              <Alert variant="destructive" className="py-2.5 rounded-xl border-error/25 bg-error/10 text-error">
                <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                <span>Nama Lengkap Amil</span>
                <span className="text-error">*</span>
              </Label>
              <Input
                placeholder="cth: Ustadz Ahmad Fauzan, M.Pd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <span>Username</span>
                  <span className="text-error">*</span>
                </Label>
                <Input
                  placeholder="cth: ahmadfauzan"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <span>Email Lembaga / Personal</span>
                  <span className="text-error">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="fauzan@lazpersis.or.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <span>Divisi / Bidang</span>
                  <span className="text-error">*</span>
                </Label>
                <Select value={division} onValueChange={(val) => { if (val) setDivision(val); }}>
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
                  placeholder="cth: Staf Kehumasan"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="text-xs sm:text-sm h-10 bg-surface-container-lowest border-outline-variant"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                <span>Tingkat Hak Akses (Role)</span>
                <span className="text-error">*</span>
              </Label>
              <Select value={role} onValueChange={(val) => { if (val) setRole(val as "ADMIN" | "SUPERVISOR" | "STAFF"); }}>
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
                        <span className="text-[11px] text-outline">Verifikator Clock-in & Monitor Kinerja Divisi</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex flex-col text-left py-0.5">
                        <span className="font-bold text-xs text-amber-500">ADMIN (Pimpinan Harian / BPH)</span>
                        <span className="text-[11px] text-outline">Kelola Divisi, Pengguna, dan Konfigurasi Lembaga</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/25 flex items-start gap-3 mt-1">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                key
              </span>
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-bold text-on-surface">Password Default Otomatis:</span>
                <span className="text-on-surface-variant leading-relaxed">
                  Akun baru otomatis menggunakan password baku <strong className="font-mono text-secondary font-semibold">lazpersis123</strong>. Amil dapat langsung login menggunakan username atau email tersebut dan mengubah password-nya di menu profil.
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-surface-container">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="text-xs h-9 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary-container hover:bg-secondary text-white text-xs h-9 font-semibold cursor-pointer"
            >
              {submitting ? "Mendaftarkan..." : "Daftarkan Amil"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
