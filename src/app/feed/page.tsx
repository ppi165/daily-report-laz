import FeedView from "@/src/modules/feed/components/feed-view";
import { getFeedReportsUseCase, ParsedFeedReport } from "@/src/modules/feed/use-cases/get-feed-reports.use-case";
import { getDivisionsUseCase } from "@/src/modules/divisions/use-cases/get-divisions.use-case";
import { verifyJWT } from "@/src/infrastructure/auth";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Feed Laporan - LAZ Persis",
  description: "Linimasa Interaktif Laporan & Apresiasi Amil LAZ Persis",
};

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let currentUserId = "";

  if (token) {
    const decoded = await verifyJWT(token);
    if (decoded?.userId) {
      currentUserId = decoded.userId as string;
    }
  }

  let initialReports: ParsedFeedReport[] = [];
  let initialNextCursor: string | null = null;
  let initialDivisions: { id: string; name: string }[] = [];

  try {
    const [feedData, divisions] = await Promise.all([
      getFeedReportsUseCase.execute(currentUserId, { limit: 10 }),
      getDivisionsUseCase.execute(),
    ]);

    initialReports = feedData.reports;
    initialNextCursor = feedData.nextCursor;
    initialDivisions = divisions;
  } catch (err) {
    console.error("Gagal prefetch data feed SSR:", err);
  }

  return (
    <FeedView
      initialReports={initialReports}
      initialNextCursor={initialNextCursor}
      initialDivisions={initialDivisions}
    />
  );
}
