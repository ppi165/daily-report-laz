import RekapReport from "@/src/modules/reports/components/rekap-report";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekap Daily Report - LAZ Persis",
  description: "Halaman Rekap Pelaporan Harian Pegawai LAZ Persis",
};

export default function RekapReportPage() {
  return <RekapReport />;
}
