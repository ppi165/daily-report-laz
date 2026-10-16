import FeedView from "@/src/modules/feed/components/feed-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed Laporan - LAZ Persis",
  description: "Linimasa Interaktif Laporan & Apresiasi Amil LAZ Persis",
};

export default function FeedPage() {
  return <FeedView />;
}
