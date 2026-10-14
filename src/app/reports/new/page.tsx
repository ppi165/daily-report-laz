import ReportForm from "@/src/modules/reports/components/report-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Input Daily Report - LAZ Persis",
  description: "Formulir Pelaporan Harian Pegawai LAZ Persis",
};

export default function NewReportPage() {
  return <ReportForm />;
}
