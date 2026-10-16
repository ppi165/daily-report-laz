"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CreateScheduleDialog from "./create-schedule-dialog";
import ScheduleRetentionConfig from "./schedule-retention-config";
import { deleteScheduleAction } from "../actions/delete-schedule.action";
import { SpecialScheduleData, ScheduleStatus } from "../types/schedule.types";

interface ExtendedScheduleData extends SpecialScheduleData {
  status: ScheduleStatus;
}

interface SpecialSchedulesCardProps {
  retentionType?: string;
  retentionValue?: number;
}

export default function SpecialSchedulesCard({
  retentionType,
  retentionValue,
}: SpecialSchedulesCardProps) {
  const [schedules, setSchedules] = useState<ExtendedScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/schedules");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSchedules(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus jadwal khusus "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await deleteScheduleAction(id);
      if (res.success) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(res.message || "Gagal menghapus jadwal.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus jadwal.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateVal: Date | string) => {
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs">
      <CardHeader className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              event_repeat
            </span>
            Jadwal Kerja Khusus / Event
          </CardTitle>
          <CardDescription className="text-xs text-on-surface-variant">
            Atur penyesuaian jam batas pelaporan harian yang aktif secara otomatis dalam rentang tanggal tertentu.
          </CardDescription>
        </div>

        <Button
          type="button"
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="h-10 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Jadwal Khusus</span>
        </Button>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex flex-col gap-5">
        {/* List Jadwal Khusus */}
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-outline">
            <div className="size-6 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
            <span className="text-xs">Memuat daftar jadwal khusus...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="py-6 px-4 rounded-xl border border-dashed border-outline-variant/80 text-center flex flex-col items-center justify-center gap-1 bg-surface-container-low/20">
            <span className="material-symbols-outlined text-outline text-[28px]">
              calendar_today
            </span>
            <p className="text-xs font-semibold text-on-surface">
              Belum Ada Jadwal Khusus Dikonfigurasi
            </p>
            <p className="text-[11px] text-outline max-w-sm">
              Sistem saat ini sepenuhnya berjalan menggunakan jam batas pelaporan reguler. Klik &quot;Tambah Jadwal Khusus&quot; untuk menambahkan periode baru.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {schedules.map((item) => {
              const isDeleting = deletingId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low/30 hover:bg-surface-container-low/60 transition-colors gap-3"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-on-surface">
                        {item.name}
                      </span>
                      {item.status === "ACTIVE" && (
                        <span className="text-xs font-bold text-secondary flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-secondary"></span>
                          Aktif (Berjalan)
                        </span>
                      )}
                      {item.status === "UPCOMING" && (
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-primary"></span>
                          Akan Datang
                        </span>
                      )}
                      {item.status === "EXPIRED" && (
                        <span className="text-xs font-medium text-outline">
                          • Selesai
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">
                          date_range
                        </span>
                        <span>
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-secondary">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span>Batas Lapor: {item.deadlineTime} WIB</span>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-outline italic">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={isDeleting}
                      className="size-9 p-0 rounded-lg text-outline hover:text-error hover:bg-error/10 cursor-pointer"
                      aria-label="Hapus Jadwal"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isDeleting ? "sync" : "delete"}
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Separator className="bg-surface-container" />

        {/* Konfigurasi Auto-Cleanup Retensi */}
        <ScheduleRetentionConfig
          initialType={retentionType}
          initialValue={retentionValue}
          onUpdated={fetchSchedules}
        />
      </CardContent>

      <CreateScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchSchedules}
      />
    </Card>
  );
}
