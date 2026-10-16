import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/src/infrastructure/auth";
import UserManagerView from "@/src/modules/users/components/user-manager-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Pengguna & Hak Akses | LAZ Persis",
  description: "Panel manajemen amil, struktur pimpinan, koordinator, dan hierarki hak akses sistem.",
};

export default async function AdminPenggunaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyJWT(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPERADMIN")) {
    redirect("/dashboard");
  }

  return <UserManagerView />;
}
