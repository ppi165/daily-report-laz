import RekapReport from "@/src/modules/reports/components/RekapReport";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekap Daily Report - LAZ Persis",
  description: "Halaman Rekap Pelaporan Harian Pegawai LAZ Persis",
};

export default function RekapReportPage() {
  return <RekapReport />;
}
