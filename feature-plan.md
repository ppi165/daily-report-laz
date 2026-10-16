# Konsep Lanjutan: Clock-in Daily Report (Laporan Susulan)

Dokumen ini mencatat roadmap dan spesifikasi detail untuk pengembangan fitur **Clock-in Daily Report (Laporan Susulan)** pada sistem Daily Report LAZ Persis.

---

## 1. Latar Belakang & Tujuan
Pegawai terkadang menghadapi kendala teknis atau situasi darurat di lapangan yang menyebabkan pelaporan harian tidak dapat diunggah pada hari yang sama. Fitur Clock-in Daily Report memungkinkan pengisian laporan untuk tanggal lampau secara tertib, transparan, dan terakreditasi.

---

## 2. Aturan Bisnis & Validasi (Business Rules)
1. **Batas Waktu Pelaporan Lampau (Max H-3):**
   - Pengisian laporan susulan hanya diizinkan maksimal hingga 3 hari ke belakang ($H-3$) dari tanggal sistem berjalan.
   - Tanggal lebih dari 3 hari yang lalu akan dikunci otomatis pada antarmuka maupun validasi tingkat backend/use-case.
2. **Tidak Mengizinkan Tanggal Masa Depan ($H+N$):**
   - Pemilihan tanggal di masa depan diblokir sepenuhnya.
3. **Status Verifikasi & Approval Koordinator:**
   - Laporan reguler (hari ini) langsung bertatus `PUBLISHED`.
   - Laporan Clock-in (tanggal lampau) dapat diatur berstatus awal `PENDING_APPROVAL` atau `SUSULAN` dengan penanda khusus (badge kuning/oranye).
   - Koordinator bidang/divisi berhak menyetujui (`APPROVED`) atau meminta perbaikan jika ada ketidaksesuaian rincian pekerjaan lampau.
4. **Alasan Keterlambatan (Opsional / Mandatory di fase lanjut):**
   - Form Clock-in dapat mewajibkan input singkat mengenai alasan pelaporan susulan (misal: "Gangguan jaringan di lokasi baksos").

---

## 3. Notifikasi & Audit Trail
1. **Notifikasi Koordinator:**
   - Saat laporan susulan dikirimkan, notifikasi otomatis masuk ke koordinator divisi terkait.
2. **Audit Log:**
   - Menyimpan `submittedAt` (kapan form dikirim secara aktual) dan `reportDate` (tanggal kerja yang dilaporkan) untuk transparansi rekapitulasi HR & absensi.

---

## 4. Rencana Implementasi Bertahap
- [x] **Fase Dasar:** Form adaptif mendeteksi tanggal lampau sebagai Clock-in dan penyimpanan `reportDate` di Prisma.
- [ ] **Fase Lanjutan:** Enforce batasan H-3 di backend `create-report.use-case.ts`.
- [ ] **Fase Approval:** Alur persetujuan koordinator divisi dan filter tab "Laporan Susulan" di halaman Rekap.
