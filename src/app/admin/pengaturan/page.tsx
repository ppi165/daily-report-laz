import AppShell from "@/src/common/components/app-shell";
import { getSettingsUseCase } from "@/src/modules/settings/use-cases/get-settings.use-case";
import { SettingsView } from "@/src/modules/settings";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Pengaturan Umum Sistem - Daily Report LAZ Persis",
  description: "Pengaturan dinamis jadwal batas laporan, jam kerja, toleransi clock-in, dan kebijakan verifikator.",
};

export default async function SettingsPage() {
  const settings = await getSettingsUseCase.execute();

  const formattedSettings = {
    ...settings,
    updatedAt: settings.updatedAt.toISOString(),
  };

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <SettingsView initialSettings={formattedSettings} />
        </div>
      </main>
    </AppShell>
  );
}
