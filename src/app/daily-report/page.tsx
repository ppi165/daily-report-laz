import ReportForm from "@/src/modules/reports/components/report-form";
import { getSettingsUseCase } from "@/src/modules/settings/use-cases/get-settings.use-case";
import { scheduleRepository } from "@/src/modules/schedules/repositories/schedule.repository";
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

  // Batching server-side: settings, jadwal khusus aktif, & eligible approvers dari database
  const [settings, approvers, activeSchedule] = await Promise.all([
    getSettingsUseCase.execute(),
    userRepository.findEligibleApprovers(currentUserId),
    scheduleRepository.findActiveForDate(new Date()),
  ]);

  let deadlineTime = settings.dailyDeadlineTime || "17:00";
  if (activeSchedule) {
    deadlineTime = activeSchedule.deadlineTime;
  } else if (settings.isRamadhanMode && settings.ramadhanDeadlineTime) {
    deadlineTime = settings.ramadhanDeadlineTime;
  }

  return (
    <ReportForm
      initialMode={initialMode}
      initialSettings={{
        clockInMaxDays: settings.clockInMaxDays,
        clockInRequiredWitness: settings.clockInRequiredWitness,
        requirePhoto: settings.requirePhoto,
        deadlineTime,
      }}
      availableApprovers={approvers}
    />
  );
}
