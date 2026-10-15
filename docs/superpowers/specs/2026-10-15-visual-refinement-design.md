# Desain Spesifikasi: Penghalusan Visual UI (Menghilangkan Pola Generik AI)

**Tanggal:** 15 Oktober 2026  
**Status:** Draf Tervalidasi  
**Ruang Lingkup:** Refinement Visual & Hierarchy (Tanpa Mengubah Warna Brand & Konsep Utama)

---

## 1. Latar Belakang & Tujuan

Meskipun komponen teknis telah dimigrasikan ke shadcn/ui, tampilan visual aplikasi saat ini masih terasa kaku dan generik khas template bawaan AI (*cookie-cutter dashboard*). Karakteristik visual yang menjadi penyebab utama antara lain:
- **Border Hell:** Garis pembatas tipis (`border border-outline-variant`) yang ditumpuk hingga 3 lapis di dalam elemen yang sama.
- **Card Uniformity:** Seluruh 20 kartu di halaman memiliki spesifikasi padding, shadow, dan border yang sama persis tanpa hierarki visual.
- **Warna Monoton:** Didominasi oleh warna pasif (`text-on-surface-variant` dan `text-outline`), bahkan angka metrik penting tidak menggunakan warna aksen brand.
- **Spacing Kaku:** Nilai spacing seragam (`space-y-6`, `gap-6`, `p-6`) di semua konteks tanpa membedakan kontainer makro dan mikro.
- **Tipografi Flat:** Kontras ukuran dan ketebalan font minim antara judul, subjudul, dan teks isi.
- **Ikon Dekoratif Berlebihan:** Hampir setiap heading dan metadata teks didahului ikon yang tidak bernilai fungsional.
- **Pola Duplikasi (Copy-Paste):** Toast sukses dan tombol footer kartu memiliki styling berulang yang kaku.

Tujuan dari perbaikan ini adalah **menghilangkan kesan generik AI tersebut** dengan memperjelas hierarki visual, memperhalus elevasi background, mematangkan tipografi, dan mengurangi noise dekoratif, **tetap mempertahankan palet hijau khas LAZ Persis dan layout yang sudah ada**.

---

## 2. Prinsip & Aturan Desain

1. **Kedalaman via Surface Elevation, Bukan Garis Border Bertumpuk:**
   Elemen di dalam kartu utama (seperti item feed, preview aktivitas, atau thumbnail) tidak lagi memakai border tambahan; cukup menggunakan pembedaan warna latar (`bg-surface-container-low`, `bg-surface-container`).
2. **Hierarki Kontras Tipografi:**
   Judul halaman utama menggunakan `text-3xl lg:text-4xl font-extrabold tracking-tight`. Angka statistik penting menggunakan `text-4xl font-black tabular-nums`. Judul kartu section menggunakan `text-xl font-bold`.
3. **Pemberian Bobot Visual pada Kartu Utama (Anchor Cards):**
   Kartu fokus utama (Greeting Banner & Status Hari Ini) diberikan elevasi visual lebih jelas (`shadow-md`, aksen subtle). Kartu pendukung dibuat lebih tenang (`shadow-none` atau border minimal).
4. **Fungsionalitas Ikon yang Terarah:**
   Hapus ikon dekoratif yang mendahului judul halaman (`Daily Report`, `Profil Pegawai`). Ikon hanya digunakan pada tombol aksi interaktif, elemen input, dan indikator status penting.
5. **DRY & Komponen Bersama:**
   Ekstrak komponen notifikasi sukses (`SuccessToast`) ke `src/common/components/success-toast.tsx` untuk menghapus kode duplikasi dan hardcoded hex color.

---

## 3. Rincian Modifikasi per Komponen

### A. Dashboard (`src/modules/dashboard/components/`)
1. **`dashboard-stats.tsx`:**
   - Grid spacing diubah menjadi `gap-4 sm:gap-5` (lebih proporsional untuk kartu ringkas).
   - Angka statistik diubah menjadi `text-4xl font-black tabular-nums`.
   - Warna angka mencerminkan kategori (Card 1: `text-primary`, Card 2: `text-secondary`, Card 3: `text-on-surface font-extrabold`).
   - Kartu dibuat tanpa shadow tebal (`shadow-none` atau `shadow-xs`), menggunakan subtle border.
2. **`greeting-banner.tsx`:**
   - Tipografi heading ditingkatkan ke `text-3xl lg:text-4xl font-extrabold tracking-tight`.
   - Hapus ikon dekoratif `calendar_today` dan `schedule` di footer; ganti dengan tata letak teks yang bersih dan elegan.
   - Tambahkan elevasi `shadow-sm` dan border halus yang menyatu dengan tema.
3. **`today-status-card.tsx`:**
   - Buat kontras lebih tegas antara status "Sudah Lapor" dan "Belum Lapor" tanpa border bertumpuk.
   - Tombol aksi utama (CTA) menggunakan padding yang lebih proporsional (`h-11`).
4. **`recent-activity-card.tsx`:**
   - Hapus border sekunder dari inner preview box (baris 27); gunakan latar `bg-surface-container-low` yang bersih.
   - Ganti footer link kaku menjadi teks link interaktif yang elegan.
5. **`team-feed.tsx`:**
   - Hapus border dari item feed dan dari Avatar (mengatasi 3-level border hell).
   - Ubah teks konten laporan dari `text-on-surface-variant` menjadi `text-on-surface` agar lebih mudah dibaca.
   - Sempurnakan tampilan tombol apresiasi dan footer link.

### B. Form Laporan (`src/modules/reports/components/report-form.tsx`)
- Hapus ikon dekoratif besar `edit_note` di samping judul halaman `Daily Report`.
- Kurangi border bertingkat di area upload dan kontainer form.
- Sesuaikan padding kontainer form menjadi `p-6 sm:p-8` dengan pemisahan seksi yang mengandalkan ruang vertikal (`space-y-6`) alih-alih garis pemisah tebal.
- Integrasikan komponen `SuccessToast` reusable.

### C. Rekap Laporan (`src/modules/reports/components/rekap-report.tsx`)
- Sempurnakan kartu ringkasan metrik periode agar tidak kaku.
- Berikan hierarki yang lebih jelas antara search bar, filter select, dan tombol export excel.
- Kartu setiap laporan di feed grid dibuat lebih bersih dengan membuang border-border minor.

### D. Profil Pegawai (`src/modules/users/components/profile-view.tsx`)
- Hapus ikon dekoratif `account_circle` sebelum heading `Profil Pegawai`.
- Sempurnakan visual tabs agar terasa seperti tab navigasi modern (bukan button tumpuk).
- Hilangkan duplikasi hardcoded hex color pada toast dan ganti dengan `SuccessToast`.
- Sesuaikan kartu profil di sisi kiri agar avatar dan badge tampil lebih harmonis.

### E. Login Form (`src/modules/auth/components/login-form.tsx`)
- Pertajam tipografi heading `Selamat Datang Kembali` (`tracking-tight font-bold`).
- Buat input container lebih solid dan kurangi aksen berlebih.

---

## 4. Kriteria Keberhasilan & Verifikasi

1. **Zero TypeScript Errors:** Menjalankan `npx tsc --noEmit` exit code 0.
2. **Next.js Production Build:** `npm run build` exit code 0.
3. **Visual Quality:** UI terlihat lebih matang, elegan, tidak berulang, dan bebas dari kesan template kaku buatan AI.
4. **Preservasi Logika:** Tidak ada logika bisnis, state form, atau fetch API yang rusak.
