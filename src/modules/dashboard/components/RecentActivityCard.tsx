import Link from "next/link";

export default function RecentActivityCard() {
  return (
    <section className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">
              Aktivitas Terbaru Anda
            </h2>
          </div>
          <Link
            className="text-sm text-primary-container font-semibold hover:text-secondary flex items-center gap-1 transition-colors"
            href="/rekap-report"
          >
            <span>Lihat Rekap</span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Single Card: Laporan Terakhir */}
        <div className="mt-5 p-5 rounded-xl border border-outline-variant bg-surface flex flex-col gap-4">
          {/* Top Row: Date & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                event
              </span>
              <span className="text-sm font-semibold text-on-surface">
                27 Sep 2026
              </span>
              <span className="text-xs text-outline">• Dikirim 16:45 WIB</span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container/10 text-primary-container">
              PUBLISHED
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-base font-semibold text-on-surface leading-snug">
              Finalisasi Desain Booklet Zakat Produktif &amp; Dokumentasi Distribusi Beasiswa Peduli
            </h3>
            <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
              Menyelesaikan proofing materi cetak booklet program Zakat Produktif 2026 untuk Muzakki korporat. Melakukan pendampingan pengambilan foto dan video serah terima beasiswa pendidikan tingkat santri binaan di Bandung Timur.
            </p>
          </div>

          {/* 2 Foto Thumbnail Terlampir */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="relative rounded-lg overflow-hidden border border-outline-variant h-36 bg-surface-container">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                alt="Booklet Zakat Preview"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeayxIDwbVCrGlNGxpZnPUUVuHdj2zcf4rUbthvHKhGLaEkkd03wVH7mrdNM152RVUX8S9oOdPSMdra0UXB9xpTq2K335EQTGsO9MR0P4hC4nIkgMOkJIE8SgFRbcf6WjwU_X4TNvpW8aYUNafgfGaljTUfmSxSE1fppwy5jBZOsgbK5xrxmldjihmjB-jmpvgF_mbS0F2xjw7QEup0oc9Rm5aumHGkkQTGdvCERMTQVSD_g5kxWkS3g"
              />
              <span className="absolute bottom-2 left-2 bg-inverse-surface/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">
                Booklet_Zakat_Preview.jpg
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-outline-variant h-36 bg-surface-container">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                alt="Dokumentasi Beasiswa"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8yv2A3s4KIJclxzY9SCCwO5tzZybqfxJcy76uZ-AmyMYQfS3DzsXdfHCEGacf08poLiVWfk4hbh3wcplMBPJd3nbbPe7QdRs_sdwYvb3RV57HOvMi9iHYBqku-uR8ABArwlT8eVB5DPpEoeDD2qH4Cex_btW8IVWSpFlGOGVFF4Tzwj3ibfBSpn9cvLy-Bad7O4ANE3mI7c5knTL6c7F7Ek79MkF0IGzTXOXkp3T_HfnFXQie0T-Hjg"
              />
              <span className="absolute bottom-2 left-2 bg-inverse-surface/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">
                Dokumentasi_Beasiswa.jpg
              </span>
            </div>
          </div>

          {/* Footer Row: Apresiasi & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-container bg-primary-container/10 px-3 py-1.5 rounded-lg">
              <span>👏 14 apresiasi rekan kerja</span>
            </div>
            <button className="text-xs text-on-surface-variant hover:text-primary font-medium flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Detail Lengkap</span>
            </button>
          </div>
        </div>

        {/* Extra subtle archived entry note */}
        <div className="mt-4 p-3.5 rounded-xl bg-surface border border-outline-variant flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-outline text-[20px]">
              history
            </span>
            <div>
              <span className="font-medium text-on-surface">
                26 Sep 2026: Koordinasi Media Partner Tabloid Suara
              </span>
              <span className="text-outline ml-2">8 apresiasi</span>
            </div>
          </div>
          <span className="text-outline">Terverifikasi</span>
        </div>
      </div>
    </section>
  );
}
