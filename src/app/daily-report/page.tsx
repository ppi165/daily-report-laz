import ReportForm from "@/src/modules/reports/components/report-form";
import { getSettingsUseCase } from "@/src/modules/settings/use-cases/get-settings.use-case";
import { userRepository } from "@/src/modules/users/repositories/user.repository";
import { verifyJWT } from "@/src/infrastructure/auth";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Input Daily Report - LAZ Persis",
  description: "Formulir Pelaporan Harian Pegawai LAZ Persis",
};

interface DailyReportPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DailyReportPage({ searchParams }: DailyReportPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const urlMode = resolvedParams.mode || resolvedParams.type;
  const initialMode = urlMode === "clock-in" ? "clock-in" : "today";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let currentUserId: string | undefined;
  if (token) {
    const decoded = await verifyJWT(token);
    if (decoded?.userId) {
      currentUserId = decoded.userId as string;
    }
  }

  // Batching server-side: settings & eligible approvers dari database
  const [settings, approvers] = await Promise.all([
    getSettingsUseCase.execute(),
    userRepository.findEligibleApprovers(currentUserId),
  ]);

  return (
    <ReportForm
      initialMode={initialMode}
      initialSettings={{
        clockInMaxDays: settings.clockInMaxDays,
        clockInRequiredWitness: settings.clockInRequiredWitness,
        requirePhoto: settings.requirePhoto,
      }}
      availableApprovers={approvers}
    />
  );
}
