"use client";

import AppShell from "@/src/shared/components/AppShell";

export default function RekapReport() {
  return (
    <AppShell headerTitle="Rekap Daily Report LAZ Persis" headerBadge="Unit Humas">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center">
        <div className="max-w-[1240px] w-full space-y-6">
          {/* Header Section */}
          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
              Rekap Daily Report
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Lihat aktivitas, sinergi, dan kontribusi seluruh rekan kerja di
              berbagai bidang LAZ Persis.
            </p>
          </div>

          {/* Top Stats & Horizontal Bar Chart Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant custom-shadow-card">
            {/* 3 Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-surface-container">
              {/* Stat 1 */}
              <div className="relative pl-4 border-l-4 border-primary">
                <div className="text-3xl text-primary font-bold tracking-tight">
                  86
                </div>
                <div className="text-sm text-on-surface-variant mt-0.5 font-medium">
                  Total Report Periode Ini
                </div>
                <div className="text-xs text-secondary flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    trending_up
                  </span>
                  <span>+18% dari pekan lalu</span>
                </div>
              </div>
              {/* Stat 2 */}
              <div className="relative pl-4 border-l-4 border-primary-container">
                <div className="text-3xl text-[#1A1A1A] font-bold tracking-tight">
                  14
                </div>
                <div className="text-sm text-on-surface-variant mt-0.5 font-medium">
                  Pegawai Aktif Melapor
                </div>
                <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    group
                  </span>
                  <span>Total 15 staf terdaftar</span>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="relative pl-4 border-l-4 border-secondary">
                <div className="text-3xl text-secondary font-bold tracking-tight">
                  92%
                </div>
                <div className="text-sm text-on-surface-variant mt-0.5 font-medium">
                  Kelengkapan Pelaporan
                </div>
                <div className="text-xs text-secondary flex items-center gap-1 mt-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>
                  <span>Sangat Baik (Amanah)</span>
                </div>
              </div>
            </div>

            {/* Horizontal Bar Distribution Chart */}
            <div className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h2 className="text-lg text-on-surface font-semibold">
                  Distribusi Laporan per Bidang
                </h2>
                <span className="text-xs text-on-surface-variant">
                  Update real-time pekan ini
                </span>
              </div>
              <div className="space-y-3.5">
                {/* Humas */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#076437]"></span>
                      Humas
                    </span>
                    <span className="font-semibold text-primary">24 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#076437] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                {/* Program */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#09914F]"></span>
                      Program
                    </span>
                    <span className="font-semibold text-secondary">20 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "83.3%" }}
                    ></div>
                  </div>
                </div>
                {/* Sekretariat */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                      Sekretariat
                    </span>
                    <span className="font-semibold text-on-surface">16 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary-container opacity-85 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "66.6%" }}
                    ></div>
                  </div>
                </div>
                {/* Keuangan */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      Keuangan
                    </span>
                    <span className="font-semibold text-on-surface">12 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-secondary opacity-75 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
                {/* SDM */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      SDM
                    </span>
                    <span className="font-semibold text-on-surface">10 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary opacity-70 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "41.6%" }}
                    ></div>
                  </div>
                </div>
                {/* IT */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-outline"></span>
                      IT
                    </span>
                    <span className="font-semibold text-on-surface">4 report</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-outline h-2.5 rounded-full transition-all duration-500"
                      style={{ width: "16.6%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant custom-shadow-card flex flex-wrap items-center justify-between gap-4">
            {/* Left Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Dropdown Periode */}
              <div className="relative">
                <select
                  aria-label="Pilih Periode"
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-2 pr-9 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>Mingguan</option>
                  <option>Bulanan</option>
                  <option>Custom</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-outline text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>
              {/* Dropdown Tanggal */}
              <div className="relative">
                <select
                  aria-label="Pilih Rentang Tanggal"
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-2 pr-9 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>21 – 27 September 2026</option>
                  <option>14 – 20 September 2026</option>
                  <option>07 – 13 September 2026</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-outline text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>
              {/* Dropdown Bidang */}
              <div className="relative">
                <select
                  aria-label="Filter Bidang"
                  className="appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-2 pr-9 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  <option>Semua Bidang</option>
                  <option>Humas</option>
                  <option>Program</option>
                  <option>Sekretariat</option>
                  <option>Keuangan</option>
                  <option>SDM</option>
                  <option>IT</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2 text-outline text-[20px]">
                  keyboard_arrow_down
                </span>
              </div>
              {/* Search Input Field */}
              <div className="relative min-w-[260px] w-full sm:w-auto mt-2 sm:mt-0">
                <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                  placeholder="Cari nama pegawai atau isi report..."
                  type="text"
                />
              </div>
            </div>
            {/* Right Export Button */}
            <button className="w-full sm:w-auto bg-surface-container-lowest border border-primary-container text-primary-container hover:bg-[#F0FDF4] text-sm font-medium px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span>Export Excel</span>
            </button>
          </div>

          {/* Feed Layout: Report Cards Grid (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Ahmad Fauzi */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant custom-shadow-card custom-shadow-hover transition-shadow flex flex-col justify-between">
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-surface-container">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-11 h-11 rounded-full object-cover border border-outline-variant"
                      alt="Ahmad Fauzi"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8k_2bzNbJSLAxivw30TRjIsgj-qfebHFsGFz4n1BEvTRbJuKKvmHb1BU86JdhH5wVtN2FPb_bKiscoZKCRBLYozuFVx9RoyzB2gNany1f81QMlOsjd9mCVTD4sXVJXvpXm00KoJy3j4lO03DwJQ64sVznnIsMTjWe38MJYHRFYE3irg5z9G44lyprdzkhhTCru5mOldkxuKEr6tNKUILpq-QmLfveTAUl7desvDZfHIgp-56VHrTQBw"
                    />
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-base font-semibold text-on-surface leading-tight">
                          Ahmad Fauzi
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface-variant w-max">
                          Humas
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-0.5">
                        28 Sep 2026 • 15:30 WIB
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(9,145,79,0.10)] text-secondary">
                    PUBLISHED
                  </span>
                </div>
                {/* Card Content Body */}
                <p className="text-sm text-on-surface mb-4 leading-relaxed">
                  Membuat desain materi publikasi untuk kegiatan tabligh akbar dan
                  distribusi logistik zakat produktif, serta mendokumentasikan kegiatan
                  liputan bersama relawan.
                </p>
                {/* Card Photos (2 Side by Side) */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-lg overflow-hidden aspect-video border border-outline-variant">
                    <img
                      className="w-full h-full object-cover"
                      alt="Aktivitas 1"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP7W0RR_RexhHIWRBUqzasCs8w1PEd9wv5RAEl5G_X-A9d76_rH297U4Tnj9G__hNRFiaMl3IJyKGj0gPifaV9imIpc_lYIIGMDksKqRg90IDbtqCkKFur4Dpfs54P4JSrqrC4YrDiUrv8dekinQZtPvDUlX5tKBh7D5v1kd1ZCm_ZRnJpeAKJN7643au6oImTVQTd06-jh0wBx7Z9zEziRqVkhvS7b_JjNV4ih_S1ILsb6218DOCSIw"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden aspect-video border border-outline-variant">
                    <img
                      className="w-full h-full object-cover"
                      alt="Aktivitas 2"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6B2GRDNffItCBGHLcy3mc4NcnK05fTYKM_TWJJNRvzbzjrUVvtdHHG19JYSXLqTztWA6MuzNpbzylCTBbKlI32hCWs-kPq3UoIXxH10L4e-smbrUZzHQIqGEcGa506PlqEsb6AA4-ralOW2YG4rwynQq4dWYjFIufCbV8YEmnjToZsvYjk3gsyvkJ-Bi87KhBc-Ezh4dg9VURpjSb9ZfvCUSWa1KzTUQpNNuf_ROPxfchYx1U1JHYgg"
                    />
                  </div>
                </div>
              </div>
              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF8F0] text-[#B45309] border border-[#FFEDD5] hover:bg-[#FFEDD5] transition-colors text-xs font-semibold">
                  <span>👏</span>
                  <span>12 Apresiasi</span>
                </button>
                <a
                  className="text-sm font-medium text-primary hover:text-secondary flex items-center gap-1"
                  href="#"
                >
                  <span>Lihat Detail</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 2: Fajar Hidayat */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant custom-shadow-card custom-shadow-hover transition-shadow flex flex-col justify-between">
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-surface-container">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-11 h-11 rounded-full object-cover border border-outline-variant"
                      alt="Fajar Hidayat"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGmu9i7WtbFL-GxGDE4nsOKci342GKD1hS-aE6f9Zkc0X1NS407611hAllgDwtP-dwSkZgYiWhOHLx2gLq3-qpX2JDiF84ZTRYVG87mdj0MxzbvHbP7QFdA9Bn2IfZ4_XZSWVTVVVc12rIpED2AxPT7emk73-gh_c1rCNf-wqpouZFxeQvLjty5LqT05Ab6GB-2Zdqr5be-6kDBy0TxbxXCTLBDDBcSnXYBLKNfGp_PrkDos7DBx4vbA"
                    />
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-base font-semibold text-on-surface leading-tight">
                          Fajar Hidayat
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface-variant w-max">
                          Program
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-0.5">
                        28 Sep 2026 • 14:15 WIB
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(9,145,79,0.10)] text-secondary">
                    PUBLISHED
                  </span>
                </div>
                {/* Card Content Body */}
                <p className="text-sm text-on-surface mb-4 leading-relaxed">
                  Koordinasi verifikasi calon mustahik beasiswa santri berprestasi wilayah
                  Jawa Barat dan penyusunan berita acara serah terima dana bantuan
                  pendidikan.
                </p>
                {/* Card Single Photo */}
                <div className="mb-5 rounded-lg overflow-hidden aspect-[2/1] border border-outline-variant">
                  <img
                    className="w-full h-full object-cover"
                    alt="Aktivitas"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWZPcSVZJ0oxia-HbnW4it-4Kx1FNoBFbRhhf3VTY1C_HH8fP1VzybUSFLmRkOQ7GbfnwNXhuDHyxeGVvhpBtbeb4dSgO9gSDYB4zcU5C-QL8n0tyQVn64SgNXrY8B1TCSOhb5_dV_wRmaX8FTdEE3PtZmQFScRfcbwoK5d8MvTEY1S2GQU4fPP0CxyB1hCxs3DqYAw6SVrz4dhcGH29svHiblPRD4HS_nkiENy11AI-f06FbldoVXtw"
                  />
                </div>
              </div>
              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF8F0] text-[#B45309] border border-[#FFEDD5] hover:bg-[#FFEDD5] transition-colors text-xs font-semibold">
                  <span>👏</span>
                  <span>9 Apresiasi</span>
                </button>
                <a
                  className="text-sm font-medium text-primary hover:text-secondary flex items-center gap-1"
                  href="#"
                >
                  <span>Lihat Detail</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 3: Nurul Aini */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant custom-shadow-card custom-shadow-hover transition-shadow flex flex-col justify-between">
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-surface-container">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-11 h-11 rounded-full object-cover border border-outline-variant"
                      alt="Nurul Aini"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG9-gs0_UyfiB0Sx3fdadspH8N70gabgy0ncdOlMO8ZUvUIBDINBzwYZxcJlpldAtx55yU0O0k-MD_fEemcB-RgXRDakIsdkE1ynU_b-3GivtoDTCi612oXlT-I2__w819fRPRniA_8aQlcs91WlIj8xEEZjH5E4_fKoKVmlMC-cwAwKSOLhEycNUGTgJHE4DK8YnVN2sc8_RuPQ7YQfQEQIzvlTvISuF96Yv0hdEzUUeC7JfD3Fmhog"
                    />
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-base font-semibold text-on-surface leading-tight">
                          Nurul Aini
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface-variant w-max">
                          Keuangan
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-0.5">
                        28 Sep 2026 • 11:20 WIB
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(9,145,79,0.10)] text-secondary">
                    PUBLISHED
                  </span>
                </div>
                {/* Card Content Body */}
                <p className="text-sm text-on-surface mb-6 leading-relaxed">
                  Rekonsiliasi mutasi rekening zakat, infak, shadaqah bank syariah mitra
                  dan penerbitan bukti setor zakat resmi untuk muzakki korporat.
                </p>
                {/* Decorative Info Metric Box */}
                <div className="p-3.5 mb-5 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[24px]">
                      verified
                    </span>
                    <div>
                      <div className="text-[11px] text-on-surface-variant">
                        Status Transaksi
                      </div>
                      <div className="text-xs font-semibold text-on-surface mt-0.5">
                        32 Bukti Setor Terverifikasi
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-secondary font-semibold">
                    Terselesaikan
                  </span>
                </div>
              </div>
              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF8F0] text-[#B45309] border border-[#FFEDD5] hover:bg-[#FFEDD5] transition-colors text-xs font-semibold">
                  <span>👏</span>
                  <span>15 Apresiasi</span>
                </button>
                <a
                  className="text-sm font-medium text-primary hover:text-secondary flex items-center gap-1"
                  href="#"
                >
                  <span>Lihat Detail</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Box Empty State Contoh (Panduan Alternatif / Tampilan Bersih) */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
                <span className="material-symbols-outlined text-[28px]">
                  description
                </span>
              </div>
              <h3 className="text-base text-on-surface mb-1 font-semibold">
                Belum Ada Daily Report
              </h3>
              <p className="text-xs text-on-surface-variant max-w-xs mb-5">
                Belum ada laporan yang dipublikasikan pada periode yang dipilih.
              </p>
              <button className="px-4 py-2 bg-primary-container text-white rounded-xl text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Buat Daily Report</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
