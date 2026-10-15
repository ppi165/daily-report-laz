# Master Plan & To-Do List: Daily Report LAZ Persis

Dokumen ini berisi roadmap dan daftar tugas terperinci untuk menyelesaikan aplikasi Daily Report LAZ Persis hingga 100% siap digunakan secara operasional.

---

## 🎯 Ringkasan Status
- **Kesiapan Saat Ini:** ~75% (Fase 1 selesai: data dinamis nama, tanggal, status hari ini, form bersih)
- **Target Kesiapan:** 100% Operasional (Data dinamis, filter riil, profil tersinkronisasi DB, dashboard real-time)

---

## 📋 Fase 1: Perbaikan Data Pokok & Quick Wins (Selesai)
> **Fokus:** Mengganti semua data statis/dummy di formulir laporan dan kartu status harian dengan data dinamis riil.

- [x] **1.1 Form Daily Report: Nama Pegawai & Divisi Dinamis**
  - Mengambil data akun yang sedang login melalui endpoint `/api/v1/users/me`.
  - Mengganti teks hardcoded `"Ahmad Fauzi"` dengan nama asli user login.
  - Menyesuaikan default pilihan bidang/divisi sesuai divisi user login.
  - *File target:* `src/modules/reports/components/report-form.tsx`

- [x] **1.2 Form Daily Report: Tanggal Pelaporan Otomatis**
  - Mengganti teks hardcoded `"Senin, 28 September 2026"` dengan format tanggal otomatis hari ini (contoh: `"Kamis, 15 Oktober 2026"`).
  - *File target:* `src/modules/reports/components/report-form.tsx`

- [x] **1.3 Form Daily Report: Pembersihan Data Dummy Awal**
  - Mengosongkan default value pada textarea `tasks` (Apa yang dikerjakan) dan `results` (Hasil pengerjaan).
  - Mengatur `uploadedPhoto` awal menjadi `null` (tanpa foto dummy bawaan).
  - *File target:* `src/modules/reports/components/report-form.tsx`

- [x] **1.4 Dashboard: Kartu Status Laporan Hari Ini Dinamis**
  - Membuat pengecekan apakah user login sudah mengirimkan laporan pada hari ini.
  - Jika **Sudah Lapor**: tampilkan status hijau "Sudah Lapor Hari Ini" dengan tombol menuju detail/rekap.
  - Jika **Belum Lapor**: tampilkan status merah "Belum Lapor" dengan tombol "Tulis Laporan Hari Ini".
  - *File target:* `src/modules/dashboard/components/today-status-card.tsx`, `src/app/api/v1/dashboard/stats/route.ts`

---

## 📋 Fase 2: Dashboard Real-time (Aktivitas & Feed Tim)
> **Fokus:** Menghubungkan seluruh bagian dashboard dengan data riil dari database.

- [ ] **2.1 Aktivitas Terbaru Anda (Recent Activity)**
  - Mengambil laporan terakhir milik user login dari database.
  - Menampilkan tanggal asli pengiriman, cuplikan isi laporan, lampiran foto, dan apresiasi riil.
  - Menambahkan *empty state* yang informatif jika user baru pertama kali masuk / belum memiliki riwayat laporan.
  - *File target:* `src/modules/dashboard/components/recent-activity-card.tsx`

- [ ] **2.2 Feed Laporan Rekan Tim (Team Feed)**
  - Mengganti array dummy `feeds` dengan data 3–5 laporan terbaru dari seluruh rekan kerja via API `/api/v1/reports`.
  - Menampilkan nama pembuat laporan, divisi, avatar, waktu posting relatif (misal: "10 menit yang lalu"), dan cuplikan tugas.
  - *File target:* `src/modules/dashboard/components/team-feed.tsx`

- [ ] **2.3 Banner Sambutan (Greeting Banner)**
  - Memastikan tanggal di footer banner diperbarui otomatis sesuai tanggal hari ini (bukan statis September 2026).
  - *File target:* `src/modules/dashboard/components/greeting-banner.tsx`

---

## 📋 Fase 3: Rekap Report & Fitur Interaktif
> **Fokus:** Mengaktifkan pencarian, filter data, grafik statistik, dan ekspor excel.

- [ ] **3.1 Pencarian & Filter Data Riil di Backend**
  - Memperluas `getReportsUseCase` dan `reportRepository` untuk mendukung parameter pencarian teks (`search`), filter bidang (`division`), dan rentang tanggal (`startDate`, `endDate`).
  - *File target:*
    - `src/modules/reports/schemas/get-reports.schema.ts`
    - `src/modules/reports/repositories/report.repository.ts`
    - `src/modules/reports/use-cases/get-reports.use-case.ts`
    - `src/app/api/v1/reports/route.ts`

- [ ] **3.2 Integrasi Filter & Pencarian di Halaman Rekap**
  - Menghubungkan input pencarian, dropdown periode/tanggal, dan dropdown filter bidang dengan pemanggilan API.
  - Menambahkan indikator loading dan penanganan jika hasil pencarian tidak ditemukan.
  - *File target:* `src/modules/reports/components/rekap-report.tsx`

- [ ] **3.3 Statistik Rekap & Grafik Distribusi Bidang Dinamis**
  - Menghitung Total Laporan, Pegawai Aktif, dan Persentase Kelengkapan dari data asli.
  - Menghitung distribusi persentase per divisi secara dinamis dari database (menggantikan bar chart dummy).
  - *File target:* `src/modules/reports/components/rekap-report.tsx`

- [ ] **3.4 Modal Detail Laporan & Preview Lampiran**
  - Mengaktifkan tombol "Lihat Detail" pada kartu laporan agar membuka modal yang menampilkan teks lengkap serta foto dokumentasi resolusi penuh.
  - *File target:* `src/modules/reports/components/rekap-report.tsx` / komponen modal baru

- [ ] **3.5 Fitur Apresiasi (Like) Laporan**
  - Mengaktifkan tombol apresiasi agar menambah jumlah likes di database secara real-time.
  - *File target:* `src/modules/reports/components/rekap-report.tsx` & endpoint apresiasi

- [ ] **3.6 Fitur Export Data ke Excel / CSV**
  - Mengaktifkan tombol "Export Excel" untuk mengunduh rekap laporan dalam format file spreadsheet (.xlsx / .csv).
  - *File target:* `src/modules/reports/components/rekap-report.tsx`

---

## 📋 Fase 4: Profil Pegawai & Keamanan Akun
> **Fokus:** Menyimpan data biodata mandiri, foto avatar, dan perubahan kata sandi ke database.

- [ ] **4.1 Sinkronisasi Biodata Pegawai**
  - Memuat data nama, email, divisi, dan bio user yang sedang login saat halaman profil dibuka.
  - Membuat Server Action / API untuk menyimpan perubahan nama, divisi, dan bio ke tabel `User` di database.
  - *File target:*
    - `src/modules/users/repositories/user.repository.ts`
    - `src/modules/users/use-cases/update-profile.use-case.ts`
    - `src/modules/users/actions/update-profile.action.ts`
    - `src/modules/users/components/profile-view.tsx`

- [ ] **4.2 Fitur Ganti Kata Sandi (Keamanan Akun)**
  - Membuat validasi password lama dengan `bcrypt.compare`.
  - Melakukan enkripsi password baru dengan `bcrypt.hash` dan menyimpannya ke database.
  - *File target:*
    - `src/modules/users/actions/change-password.action.ts`
    - `src/modules/users/components/profile-view.tsx`

- [ ] **4.3 Unggah Foto Profil (Avatar)**
  - Menambahkan kolom `avatar` pada schema Prisma `User` (jika belum ada) dan sync database.
  - Mengunggah foto profil ke Supabase Storage (kompresi WebP) dan memperbarui URL avatar user.
  - *File target:* `prisma/schema.prisma`, `src/modules/users/components/profile-view.tsx`

- [ ] **4.4 Tab Kinerja & Riwayat Laporan Pribadi**
  - Menampilkan metrik asli (total laporan user, persentase kedisiplinan, total apresiasi yang diterima).
  - Menampilkan daftar histori laporan milik user bersangkutan secara riil.
  - *File target:* `src/modules/users/components/profile-view.tsx`

---

## 📋 Fase 5: Manajemen Akun Pengguna (Admin) & Notifikasi
> **Fokus:** Administrasi staf amil zakat dan sistem notifikasi internal.

- [ ] **5.1 Manajemen Akun Amil (Admin Portal)**
  - Membuat halaman / antarmuka untuk Admin mendaftarkan akun pegawai baru (Nama, Email, Username, Password Awal, Divisi).
  - Manajemen status aktif pegawai.
  - *File target:* modul manajemen pengguna baru

- [ ] **5.2 Sistem Notifikasi Fungsional**
  - Menyesuaikan dropdown notifikasi agar mencerminkan pengingat batas waktu laporan (pukul 17:00 WIB) dan notifikasi saat laporan diapresiasi.
  - *File target:* `src/common/components/notification-dropdown.tsx`
