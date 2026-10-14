import ProfileView from "@/src/modules/users/components/profile-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya - Daily Report LAZ Persis",
  description: "Lengkapi data identitas dan kepegawaian mandiri LAZ Persis",
};

export default function ProfilPage() {
  return <ProfileView />;
}
