import DivisionManagerView from "@/src/modules/divisions/components/division-manager-view";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Kelola Divisi & Pegawai | LAZ Persis",
  description: "Panel kendali administrator untuk manajemen divisi dan mutasi pegawai amil LAZ Persis.",
};

export default function AdminDivisiPage() {
  return <DivisionManagerView />;
}
