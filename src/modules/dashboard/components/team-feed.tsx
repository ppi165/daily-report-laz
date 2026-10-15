import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TeamFeed() {
  const feeds = [
    {
      id: "feed-1",
      name: "Siti Rahma",
      time: "14:20 WIB",
      division: "Program",
      divisionColor: "bg-secondary-container/40 text-on-secondary-container",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAf3vIPMWnL7kxZibcz-vtrIz2FtkisqAblRR5VDp8Heo4JLAJll4_N4iIuJjcDtjTRTgWijZvvHkB6sFdYmVDYuiD9SXzsy1IoNNSU6SI0CNL6jA7aVQNfXIJYRi4ry1cr8gmG0vGu_oJqmUoCmaeFpxiQcTVBbZoFXQqzmSHKoQEodhCdv_Wi1FmMSmt5UfAKSZzpUp2ilVNFVKDlSBa6f8Md_vxE5WH0Psq_PiIzoHsCuoxU2C8u4A",
      text: "Penyaluran Paket Sembako Dhuafa Cianjur: Berhasil mendistribusikan 120 paket amanah pangan ke 3 desa terpencil.",
      appreciation: 9,
      attachments: "2 Lampiran Foto",
    },
    {
      id: "feed-2",
      name: "Dedi Kurniawan",
      time: "12:05 WIB",
      division: "Keuangan",
      divisionColor: "bg-surface-container-highest text-on-surface-variant",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_VJuuWL8gw-ci81zUKTIng7djX2tNyLJVZzEm1FH40KTctzk7JSG0sAZ4IxmxSmioHLMJzusUknwA0xzjF6FLfIDw_2Sa3Qt0D4R2kLNaL2PplPUBuJ8ftfVMwmRuV5RodECtnTzvjcuKPyGXmPG55VU7u02NBfjCFAjgDgG0EbfbWZ1YEB-dkEiElntfco2ipV8MFcvHENqNii2w7PtKvNIWsZ13OzLHt9oUA-pT8KrvyBhpoLLq-w",
      text: "Rekonsiliasi Bank Rekening Infaq & Zakat Mal Q3: Penutupan neraca saldo harian dan verifikasi mutasi online gate.",
      appreciation: 6,
      attachments: "1 Lampiran Spreadsheet",
    },
    {
      id: "feed-3",
      name: "Nabila Putri",
      time: "10:30 WIB",
      division: "Humas",
      divisionColor: "bg-primary-container/10 text-primary-container",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxgg9tDRQ-R8zTmXydrusmZ24RJeP3qyk_k5RmINwSkMq9ZPNr_z949VM6EBxmADr4RqDTPHZopiq7vgxvA-dJDsE3b8Z_5aoHAkU8t_UsgpkLSeV2_OOpPccpb11zuzcC6tENDfqkCZwUaeuo-DMx3sezNTrcZHMytST9No8SE6I9kFkyIneT9-y1-qvhQvA_wesGllnkapKMVKD4XSX_hnjOSe6xWijpBKP-_CNqFN1vlKBdYvhxrg",
      text: "Penyusunan Press Release Kampanye Qurban Berkelanjutan 1448 H untuk distribusi portal berita nasional.",
      appreciation: 11,
      attachments: "Rilis Dokumen",
    },
  ];

  return (
    <Card className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border-outline-variant p-6 shadow-sm flex flex-col justify-between">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-surface-container">
            <h2 className="text-lg font-semibold text-on-surface">
              Feed Laporan Rekan Tim
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">
              Hari ini
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {feeds.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-low/40 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border border-outline-variant bg-surface-variant shrink-0">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-sm font-semibold text-on-surface truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-outline">{item.time}</span>
                    </div>
                    <div className="mb-2">
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-semibold ${item.divisionColor}`}
                      >
                        {item.division}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-outline">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent hover:text-primary-container flex items-center gap-1 text-xs text-outline transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
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
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-surface-container">
          <Link
            className="w-full py-2.5 rounded-xl border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface text-center block transition-colors"
            href="/rekap-report"
          >
            Jelajahi Semua Laporan Rekan
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
