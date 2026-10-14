import Link from "next/link";

export default function TodayStatusCard() {
  return (
    <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline">Status Hari Ini</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-error-container text-on-error-container">
            Belum Lapor
          </span>
        </div>
        <p className="text-lg font-semibold text-on-surface">
          Laporan Harian Belum Dikirim
        </p>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-error">
            alarm
          </span>
          <span>Belum disubmit (Batas 17:00 WIB)</span>
        </div>
      </div>
      <div className="pt-4 mt-4">
        <Link
          href="/daily-report"
          className="w-full bg-primary-container hover:bg-secondary text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px]">
            add_circle
          </span>
          <span>Tulis Laporan Hari Ini</span>
        </Link>
      </div>
    </div>
  );
}
