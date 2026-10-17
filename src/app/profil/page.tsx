import ProfileView from "@/src/modules/users/components/profile-view";
import { userRepository } from "@/src/modules/users/repositories/user.repository";
import { verifyJWT } from "@/src/infrastructure/auth";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Profil Saya - Daily Report LAZ Persis",
  description: "Lengkapi data identitas dan kepegawaian mandiri LAZ Persis",
};

export default async function ProfilPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let initialPerformance = null;

  if (token) {
    const decoded = await verifyJWT(token);
    if (decoded?.userId) {
      try {
        initialPerformance = await userRepository.getUserPerformance(decoded.userId as string);
      } catch (err) {
        console.error("Gagal prefetch kinerja amil SSR:", err);
      }
    }
  }

  return <ProfileView initialPerformance={initialPerformance} />;
}
