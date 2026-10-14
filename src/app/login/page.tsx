import LoginForm from "@/src/modules/auth/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Daily Report LAZ Persis",
  description: "Masuk ke Sistem Pelaporan Harian LAZ Persis",
};

export default function LoginPage() {
  return <LoginForm />;
}
