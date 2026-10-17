import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserAvatar from "@/src/common/components/user-avatar";
import { Separator } from "@/components/ui/separator";

export interface TeamFeedItem {
  id: string;
  author?: {
    name: string;
    division: string;
    role?: string;
    avatar?: string | null;
  } | null;
  content: string;
  createdAt: string | Date;
  appreciations?: number;
  attachments?: string[];
  commentsCount?: number;
}

interface TeamFeedProps {
  feeds?: TeamFeedItem[];
}

export default function TeamFeed({ feeds = [] }: TeamFeedProps) {
  return (
    <Card className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border-outline-variant/60 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-base sm:text-lg font-bold text-on-surface tracking-tight">
          Feed Rekan Tim
        </CardTitle>
        <Link
          className="text-xs text-secondary font-semibold hover:underline transition-colors"
          href="/feed"
        >
          Lihat Semua Feed
        </Link>
      </CardHeader>

      <Separator className="bg-outline-variant/40" />

      <CardContent className="p-0 flex flex-col gap-3">
        {feeds.length === 0 ? (
          <div className="py-8 px-4 rounded-xl bg-surface-container-low/40 border border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-center gap-1.5">
            <p className="text-xs font-semibold text-on-surface">
              Belum ada publikasi laporan rekan
            </p>
            <p className="text-[11px] text-outline max-w-xs">
              Laporan kerja yang dipublikasikan rekan amil akan muncul di sini.
            </p>
          </div>
        ) : (
          feeds.slice(0, 3).map((feed) => {
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
                className="flex flex-col gap-2 p-3.5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar
                      name={authorName}
                      avatarUrl={feed.author?.avatar}
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface leading-tight">
                        {authorName}
                      </span>
                      <span className="text-[10px] text-outline font-mono">
                        {timeStr} WIB
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-secondary truncate max-w-[120px]">
                    {authorDiv}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {feed.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-outline pt-1 border-t border-outline-variant/30">
                  <span className="font-medium text-secondary">
                    {feed.appreciations || 0} Apresiasi
                  </span>
                  <span>
                    {feed.attachments && feed.attachments.length > 0
                      ? `${feed.attachments.length} Foto`
                      : "Tanpa foto"}
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
