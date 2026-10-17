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
  commentsCount?: number;
}

interface RecentActivityCardProps {
  activities?: ActivityReportItem[];
}

export default function RecentActivityCard({ activities = [] }: RecentActivityCardProps) {
  return (
    <Card className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-base sm:text-lg font-bold text-on-surface tracking-tight">
          Aktivitas Terbaru Anda
        </CardTitle>
        <Link
          className="text-xs text-secondary font-semibold hover:underline transition-colors"
          href="/rekap-report"
        >
          Lihat Rekap Lengkap
        </Link>
      </CardHeader>

      <Separator className="bg-outline-variant/40" />

      <CardContent className="p-0 flex flex-col gap-3">
        {activities.length === 0 ? (
          <div className="py-8 px-4 rounded-xl bg-surface-container-low/40 border border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-center gap-1.5">
            <p className="text-xs font-semibold text-on-surface">
              Belum ada riwayat laporan
            </p>
            <p className="text-[11px] text-outline max-w-xs">
              Laporan kerja yang Anda kirimkan akan otomatis terdata dan ditampilkan di sini.
            </p>
          </div>
        ) : (
          activities.slice(0, 3).map((act) => {
            const dateObj = new Date(act.createdAt);
            const dateStr = dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            });
            const timeStr = dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const isPending = act.status === "PENDING_APPROVAL";
            const isRejected = act.status === "REJECTED";

            return (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">
                      {dateStr}
                    </span>
                    <span className="text-[11px] text-outline font-mono">
                      • {timeStr} WIB
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      isPending
                        ? "text-amber-500"
                        : isRejected
                        ? "text-rose-500"
                        : "text-secondary"
                    }`}
                  >
                    {isPending
                      ? "Menunggu Saksi"
                      : isRejected
                      ? "Ditolak"
                      : "Diterbitkan"}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {act.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-outline pt-1 border-t border-outline-variant/30">
                  <span className="font-medium text-secondary">
                    {act.appreciations || 0} Apresiasi
                  </span>
                  <span>
                    {act.attachments && act.attachments.length > 0
                      ? `${act.attachments.length} Foto Lampiran`
                      : "Tanpa lampiran"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
