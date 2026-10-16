import ReportForm from "@/src/modules/reports/components/report-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Input Daily Report - LAZ Persis",
  description: "Formulir Pelaporan Harian Pegawai LAZ Persis",
};

interface NewReportPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewReportPage({ searchParams }: NewReportPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const urlMode = resolvedParams.mode || resolvedParams.type;
  const initialMode = urlMode === "clock-in" ? "clock-in" : "today";

  return <ReportForm initialMode={initialMode} />;
}
