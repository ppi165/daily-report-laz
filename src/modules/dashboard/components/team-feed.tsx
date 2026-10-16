import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export interface TeamFeedItem {
  id: string;
  author?: {
    name: string;
    division: string;
    role?: string;
  } | null;
  content: string;
  createdAt: string | Date;
  appreciations?: number;
  attachments?: string[];
}

interface TeamFeedProps {
  feeds?: TeamFeedItem[];
}

export default function TeamFeed({ feeds = [] }: TeamFeedProps) {
  return (
    <Card className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xl font-bold text-on-surface tracking-tight">
          Feed Laporan Rekan Tim
        </CardTitle>
        <span className="text-xs text-outline font-medium">
          Terbaru
        </span>
      </CardHeader>

      <Separator className="bg-surface-container/80" />

      <CardContent className="p-0 flex flex-col gap-4">
        {feeds.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-low/40 border border-dashed border-outline-variant flex flex-col items-center justify-center text-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-outline">
              dynamic_feed
            </span>
            <p className="text-xs font-semibold text-on-surface">
              Belum ada publikasi laporan dari rekan amil
            </p>
            <p className="text-[11px] text-outline max-w-xs">
              Laporan yang telah terkirim dan dipublikasikan akan muncul di feed ini.
            </p>
          </div>
        ) : (
          feeds.map((feed) => {
            const dateObj = new Date(feed.createdAt);
            const timeStr = dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const authorName = feed.author?.name || "Amil";
            const authorDiv = feed.author?.division || "Lembaga";

            return (
              <div
                key={feed.id}
                className="flex flex-col gap-3 p-3.5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-9 border border-outline-variant">
                      <AvatarFallback className="font-semibold text-xs bg-secondary/15 text-secondary">
                        {authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-on-surface leading-tight">
                        {authorName}
                      </span>
                      <span className="text-[10px] text-outline font-mono">
                        {timeStr} WIB
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-secondary tracking-wide shrink-0">
                    {authorDiv}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  {feed.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-outline pt-1 border-t border-surface-container/60">
                  <div className="flex items-center gap-1.5 text-secondary font-medium">
                    <span className="material-symbols-outlined text-[15px]">
                      thumb_up
                    </span>
                    <span>{feed.appreciations || 0} Apresiasi</span>
                  </div>
                  <span>
                    {feed.attachments && feed.attachments.length > 0
                      ? `${feed.attachments.length} Foto`
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
