import ApprovalView from "@/src/modules/approvals/components/approval-view";
import { getClockInReportsUseCase } from "@/src/modules/approvals/use-cases/get-clock-in-reports.use-case";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { verifyJWT } from "@/src/infrastructure/auth";
import { cookies } from "next/headers";
import { ClockInReport } from "@/src/modules/approvals/types/approval.types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Persetujuan Clock-in | Daily Report LAZ Persis",
  description: "Halaman verifikasi dan persetujuan clock-in daily report 2 saksi amil LAZ Persis.",
};

export default async function VerifikasiPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let currentUser: { id: string; name: string; role: string; division?: string } | null = null;
  let initialReports: ClockInReport[] = [];

  if (token) {
    const decoded = await verifyJWT(token);
    if (decoded?.userId) {
      try {
        const [userData, reports] = await Promise.all([
          getCurrentUserUseCase.execute(token),
          getClockInReportsUseCase.execute(decoded.userId as string, decoded.role as string),
        ]);
        if (userData) {
          currentUser = {
            id: userData.id,
            name: userData.name,
            role: userData.role,
            division: userData.division,
          };
        }
        initialReports = reports as unknown as ClockInReport[];
      } catch (err) {
        console.error("Gagal prefetch data verifikasi SSR:", err);
      }
    }
  }

  return <ApprovalView initialReports={initialReports} initialUser={currentUser} />;
}
