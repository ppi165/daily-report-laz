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
import { Textarea } from "@/components/ui/textarea";
import { createScheduleAction } from "../actions/create-schedule.action";
import { updateScheduleAction } from "../actions/update-schedule.action";
import { SpecialScheduleData } from "../types/schedule.types";

interface CreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  scheduleToEdit?: SpecialScheduleData | null;
}

export default function CreateScheduleDialog({
  open,
  onOpenChange,
  onSuccess,
  scheduleToEdit,
}: CreateScheduleDialogProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("15:30");
  const [reminderTime, setReminderTime] = useState("14:30");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(scheduleToEdit && scheduleToEdit.id);

  const formatDateForInput = (dateVal: Date | string) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (open && scheduleToEdit) {
      setName(scheduleToEdit.name || "");
      setStartDate(formatDateForInput(scheduleToEdit.startDate));
      setEndDate(formatDateForInput(scheduleToEdit.endDate));
      setDeadlineTime(scheduleToEdit.deadlineTime || "15:30");
      setReminderTime(scheduleToEdit.reminderTime || "");
      setDescription(scheduleToEdit.description || "");
    } else if (open && !scheduleToEdit) {
      setName("");
      setStartDate("");
      setEndDate("");
      setDeadlineTime("15:30");
      setReminderTime("14:30");
      setDescription("");
    }
  }, [open, scheduleToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Nama jadwal/event wajib diisi!");
      return;
    }
    if (!startDate || !endDate) {
      alert("Tanggal mulai dan tanggal selesai wajib ditentukan!");
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      alert("Tanggal selesai tidak boleh sebelum tanggal mulai!");
      return;
    }
    if (!deadlineTime) {
      alert("Jam batas pelaporan khusus wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && scheduleToEdit) {
        const res = await updateScheduleAction({
          id: scheduleToEdit.id,
          name: name.trim(),
          startDate,
          endDate,
          deadlineTime,
          reminderTime: reminderTime || undefined,
          description: description.trim() || undefined,
          isActive: scheduleToEdit.isActive ?? true,
        });

        if (res.success) {
          onSuccess();
          onOpenChange(false);
        } else {
          alert(res.message || "Gagal memperbarui jadwal khusus.");
        }
      } else {
        const res = await createScheduleAction({
          name: name.trim(),
          startDate,
          endDate,
          deadlineTime,
          reminderTime: reminderTime || undefined,
          description: description.trim() || undefined,
          isActive: true,
        });

        if (res.success) {
          onSuccess();
          onOpenChange(false);
        } else {
          alert(res.message || "Gagal membuat jadwal khusus.");
        }
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menyimpan jadwal khusus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-container-lowest border-outline-variant p-6 rounded-2xl">
        <DialogHeader className="flex flex-col gap-1 pb-2">
          <DialogTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              {isEdit ? "edit_calendar" : "event_available"}
            </span>
            {isEdit ? "Edit Jadwal Kerja Khusus" : "Tambah Jadwal Kerja Khusus"}
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant">
            {isEdit
              ? "Perbarui periode atau jam batas pelaporan untuk event/jadwal ini."
              : "Konfigurasi penyesuaian jam batas pelaporan untuk periode atau event tertentu (misal: Ramadhan, tanggap bencana, atau lembur audit)."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="schedule-name" className="text-xs font-semibold text-on-surface">
              Nama Event / Periode
            </Label>
            <Input
              id="schedule-name"
              placeholder="Contoh: Ramadhan 1447 H, Siaga Bencana Lapangan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl bg-surface-container-lowest border-outline-variant text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schedule-start" className="text-xs font-semibold text-on-surface">
                Tanggal Mulai
              </Label>
              <Input
                id="schedule-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 rounded-xl bg-surface-container-lowest border-outline-variant text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schedule-end" className="text-xs font-semibold text-on-surface">
                Tanggal Selesai
              </Label>
              <Input
                id="schedule-end"
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 rounded-xl bg-surface-container-lowest border-outline-variant text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schedule-deadline" className="text-xs font-semibold text-on-surface">
                Jam Batas Lapor (WIB)
              </Label>
              <Input
                id="schedule-deadline"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="h-10 rounded-xl bg-surface-container-lowest border-outline-variant text-sm font-medium"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="schedule-reminder" className="text-xs font-semibold text-on-surface">
                Jam Pengingat (Opsional)
              </Label>
              <Input
                id="schedule-reminder"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-10 rounded-xl bg-surface-container-lowest border-outline-variant text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="schedule-desc" className="text-xs font-semibold text-on-surface">
              Keterangan Tambahan (Opsional)
            </Label>
            <Textarea
              id="schedule-desc"
              placeholder="Catatan penyesuaian jam kerja untuk staf..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-xl bg-surface-container-lowest border-outline-variant text-xs"
              rows={2}
            />
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 rounded-xl border-outline-variant text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="h-9 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
