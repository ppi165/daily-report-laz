import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FeedItem {
  id: string;
  name: string;
  avatar: string;
  time: string;
  division: string;
  divisionColor: string;
  text: string;
  appreciation: number;
  attachments: string;
}

export default function TeamFeed() {
  const feeds: FeedItem[] = [
    {
      id: "1",
      name: "Siti Rahma",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
      time: "15:20 WIB",
      division: "Program",
      divisionColor: "bg-secondary-container/40 text-secondary border-transparent",
      text: "Menyalurkan 50 paket sembako tanggap bencana untuk warga terdampak di wilayah Garut Selatan bersama tim relawan lokal.",
      appreciation: 8,
      attachments: "2 Foto Terlampir",
    },
    {
      id: "2",
      name: "Dedi Kurniawan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      time: "14:10 WIB",
      division: "Keuangan",
      divisionColor: "bg-secondary-container/30 text-secondary border-transparent",
      text: "Menyelesaikan rekonsiliasi penerimaan donasi online transfer bank dan QRIS periode pekan ketiga bulan September 2026.",
      appreciation: 5,
      attachments: "Dokumen Rekap",
    },
    {
      id: "3",
      name: "Nabila Putri",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
      time: "11:30 WIB",
      division: "Humas",
      divisionColor: "bg-primary/10 text-primary border-transparent",
      text: "Take video wawancara penerima manfaat program beasiswa amil cerdas di kantor pusat untuk materi publikasi transparansi.",
      appreciation: 14,
      attachments: "3 Foto Terlampir",
    },
  ];

  return (
    <Card className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-6 shadow-none flex flex-col justify-between gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xl font-bold text-on-surface tracking-tight">
          Feed Laporan Rekan Tim
        </CardTitle>
        <span className="text-xs text-outline font-medium">
          Hari ini
        </span>
      </CardHeader>

      <Separator className="bg-surface-container/80" />

      <CardContent className="p-0 flex flex-col gap-3">
        {feeds.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-start gap-3">
              <Avatar className="size-10 ring-2 ring-surface-container-lowest shadow-xs shrink-0">
                <AvatarImage src={item.avatar} alt={item.name} />
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-sm font-bold text-on-surface truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-outline font-mono">{item.time}</span>
                </div>
                <div className="mb-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-semibold border-transparent ${item.divisionColor}`}
                  >
                    {item.division}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-on-surface line-clamp-2 leading-relaxed">
                  {item.text}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-outline">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent hover:text-secondary flex items-center gap-1 text-xs text-outline transition-colors cursor-pointer"
                  >
                    <span data-icon="inline-start" className="material-symbols-outlined text-[15px] text-secondary">
                      thumb_up
                    </span>
                    <span>Apresiasi ({item.appreciation})</span>
                  </Button>
                  <span>•</span>
                  <span>{item.attachments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <Separator className="bg-surface-container/80" />

      <CardFooter className="p-0 bg-transparent border-0 justify-center">
        <Link
          className="group inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          href="/rekap-report"
        >
          <span>Jelajahi Semua Laporan Rekan</span>
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
