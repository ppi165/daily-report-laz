import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecentActivityCard() {
  return (
    <Card className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border-outline-variant p-6 shadow-sm flex flex-col justify-between">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-surface-container">
            <div>
              <h2 className="text-lg font-semibold text-on-surface">
                Aktivitas Terbaru Anda
              </h2>
            </div>
            <Link
              className="text-sm text-primary-container font-semibold hover:text-secondary flex items-center gap-1 transition-colors"
              href="/rekap-report"
            >
              <span>Lihat Rekap</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="mt-5 p-5 rounded-xl border border-outline-variant bg-surface flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  event
                </span>
                <span className="text-sm font-semibold text-on-surface">
                  27 Sep 2026
                </span>
                <span className="text-xs text-outline">• Dikirim 16:45 WIB</span>
              </div>
              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-primary-container/10 text-primary-container">
                PUBLISHED
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-1">
                Rilis Berita Tabligh Akbar &amp; Penyaluran Beasiswa
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                Membuat konten rilis media online dan mendampingi liputan penyaluran zakat beasiswa untuk santri berprestasi di pesantren binaan Bandung Barat.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container text-xs text-outline">
              <div className="flex items-center gap-1 text-secondary font-medium">
                <span className="material-symbols-outlined text-[16px]">
                  thumb_up
                </span>
                <span>12 Apresiasi diterima</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  attach_file
                </span>
                <span>1 Foto Lampiran</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-surface-container">
          <Link
            className="w-full py-2.5 rounded-xl border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface text-center block transition-colors"
            href="/daily-report"
          >
            Lihat Riwayat Lengkap Laporan Saya
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
