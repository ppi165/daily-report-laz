import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RecentActivityCard() {
  return (
    <Card className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-6 shadow-none flex flex-col justify-between gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xl font-bold text-on-surface tracking-tight">
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

      <CardContent className="p-0 flex flex-col gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">
                27 Sep 2026
              </span>
              <span className="text-xs text-outline">• 16:45 WIB</span>
            </div>
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-secondary/15 text-secondary border-transparent">
              PUBLISHED
            </Badge>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-bold text-on-surface mb-1">
              Rilis Berita Tabligh Akbar &amp; Penyaluran Beasiswa
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
              Membuat konten rilis media online dan mendampingi liputan penyaluran zakat beasiswa untuk santri berprestasi di pesantren binaan Bandung Barat.
            </p>
          </div>

          <Separator className="bg-surface-container/60" />

          <div className="flex items-center justify-between text-xs text-outline pt-1">
            <div className="flex items-center gap-1.5 text-secondary font-medium">
              <span className="material-symbols-outlined text-[16px]">
                thumb_up
              </span>
              <span>12 Apresiasi diterima</span>
            </div>
            <div className="text-on-surface-variant font-medium">
              <span>1 Foto Lampiran</span>
            </div>
          </div>
        </div>
      </CardContent>

      <Separator className="bg-surface-container/80" />

      <CardFooter className="p-0 bg-transparent border-0 justify-center">
        <Link
          className="group inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          href="/daily-report"
        >
          <span>Buka Formulir Laporan Harian</span>
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
