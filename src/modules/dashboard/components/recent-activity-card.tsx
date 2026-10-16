import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface ActivityReportItem {
  id: string;
  title: string | null;
  content: string;
  createdAt: string | Date;
  status: string;
  appreciations?: number;
  attachments?: string[];
  division?: string;
}

interface RecentActivityCardProps {
  activities?: ActivityReportItem[];
}

export default function RecentActivityCard({ activities = [] }: RecentActivityCardProps) {
  return (
    <Card className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
          Aktivitas Terbaru Anda
        </CardTitle>
        <Link
          className="text-xs sm:text-sm text-primary font-semibold hover:text-secondary flex items-center gap-1 transition-colors"
          href="/rekap-report"
        >
          <span>Lihat Rekap</span>
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </CardHeader>

      <Separator className="bg-surface-container/80" />

      <CardContent className="p-0 flex flex-col gap-3">
        {activities.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-low/40 border border-dashed border-outline-variant flex flex-col items-center justify-center text-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-outline">
              history_edu
            </span>
            <p className="text-xs font-semibold text-on-surface">
              Belum ada riwayat laporan terbaru
            </p>
            <p className="text-[11px] text-outline max-w-xs">
              Laporan kerja yang Anda kirimkan akan otomatis terdata dan ditampilkan di sini.
            </p>
          </div>
        ) : (
          activities.map((act) => {
            const dateObj = new Date(act.createdAt);
            const dateStr = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={act.id}
                className="p-4 sm:p-4.5 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-on-surface">
                      {dateStr}
                    </span>
                    <span className="text-xs text-outline font-mono">
                      • {timeStr} WIB
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono tracking-wider uppercase ${
                      act.status === "PUBLISHED"
                        ? "text-secondary"
                        : "text-primary"
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface mb-0.5">
                    {act.title || "Laporan Aktivitas Harian"}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {act.content}
                  </p>
                </div>

                <Separator className="bg-surface-container/60" />

                <div className="flex items-center justify-between text-xs text-outline pt-0.5">
                  <div className="flex items-center gap-1.5 text-secondary font-medium">
                    <span className="material-symbols-outlined text-[15px]">
                      thumb_up
                    </span>
                    <span>{act.appreciations || 0} Apresiasi</span>
                  </div>
                  <div className="text-on-surface-variant font-medium">
                    <span>
                      {act.attachments && act.attachments.length > 0
                        ? `${act.attachments.length} Foto Lampiran`
                        : "Tidak ada lampiran"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
