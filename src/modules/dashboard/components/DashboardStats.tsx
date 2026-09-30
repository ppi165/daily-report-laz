export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stat 1: Hari Kerja Aktif */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="h-1 w-full bg-primary-container absolute top-0 left-0"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Presensi Kerja
          </span>
          <div className="p-2 rounded-lg bg-surface-container text-primary-container">
            <span className="material-symbols-outlined text-[20px]">
              event_available
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl text-on-surface font-bold tracking-tight">
            20 Hari
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Hari Kerja Aktif tercatat di September
          </p>
        </div>
      </div>

      {/* Stat 2: Laporan Terpublikasi */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="h-1 w-full bg-primary-container absolute top-0 left-0"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Laporan Terverifikasi
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-container/10 text-primary-container">
            90% Konsistensi
          </span>
        </div>
        <div className="mt-3">
          <div className="text-3xl text-on-surface font-bold tracking-tight">
            18 Report
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Laporan Terpublikasi &amp; Terverifikasi Koordinator
          </p>
        </div>
      </div>

      {/* Stat 3: Total Apresiasi Rekan Kerja */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="h-1 w-full bg-secondary absolute top-0 left-0"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Sinergi Lembaga
          </span>
          <div className="p-2 rounded-lg bg-surface-container text-secondary">
            <span className="material-symbols-outlined text-[20px]">handshake</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-3xl text-on-surface font-bold tracking-tight">
            142 Apresiasi
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Total Apresiasi Rekan Kerja diterima bulan ini
          </p>
        </div>
      </div>
    </div>
  );
}
