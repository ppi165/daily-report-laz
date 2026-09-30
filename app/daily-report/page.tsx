import ReportForm from "@/src/modules/reports/components/ReportForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Input Daily Report - LAZ Persis",
  description: "Formulir Pelaporan Harian Pegawai LAZ Persis",
};

export default function DailyReportPage() {
  return <ReportForm />;
}
