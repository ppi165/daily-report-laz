# UI Library & Komponen Antarmuka (shadcn/ui)

Dokumen ini mencatat bahwa project **Daily Report LAZ Persis** secara resmi telah mengintegrasikan dan menggunakan **shadcn/ui** berbasis **Tailwind CSS v4** dengan tema dark/light mode yang selaras.

---

## 📦 Daftar Komponen Terpasang (A – Z)

Seluruh komponen tersimpan pada direktori `components/ui/` dan siap diimpor menggunakan path alias `@/components/ui/[nama-komponen]`:

| No | Komponen | File Path | Fungsi Utama di Daily Report LAZ |
|---|---|---|---|
| 1 | **Alert** | `components/ui/alert.tsx` | Kotak notifikasi statis, pengumuman, batas deadline laporan harian. |
| 2 | **Alert Dialog** | `components/ui/alert-dialog.tsx` | Konfirmasi tindakan krusial (misal: hapus data bidang, batalkan draft). |
| 3 | **Avatar** | `components/ui/avatar.tsx` | Foto profil pengguna dengan otomatis fallback inisial nama. |
| 4 | **Badge** | `components/ui/badge.tsx` | Label status laporan (*Terkirim*, *Draft*) dan penanda unit kerja/divisi. |
| 5 | **Button** | `components/ui/button.tsx` | Tombol interaktif (submit form, download export excel, aksi popup). |
| 6 | **Calendar** | `components/ui/calendar.tsx` | Pemilih kalender untuk filter rentang tanggal pada rekap laporan. |
| 7 | **Card** | `components/ui/card.tsx` | Kontainer kartu statistik dashboard, status harian, dan feed aktivitas tim. |
| 8 | **Dialog** | `components/ui/dialog.tsx` | Modal pop-up (misal: modal kelola divisi, modal detail kegiatan). |
| 9 | **Dropdown Menu** | `components/ui/dropdown-menu.tsx` | Menu pop-up profil akun (Ganti Password, Pengaturan, Keluar) & opsi kartu. |
| 10 | **Input** | `components/ui/input.tsx` | Input kolom teks standar (pencarian, form login, identitas profil). |
| 11 | **Label** | `components/ui/label.tsx` | Label form yang terhubung secara aksesibel dengan elemen input/textarea. |
| 12 | **Popover** | `components/ui/popover.tsx` | Pop-up mengambang (panel notifikasi, filter lanjutan, date-picker). |
| 13 | **Progress** | `components/ui/progress.tsx` | Bar indikator progres kelengkapan laporan bidang atau upload file. |
| 14 | **Scroll Area** | `components/ui/scroll-area.tsx` | Wadah kontainer dengan scrollbar yang rapi untuk list panjang. |
| 15 | **Select** | `components/ui/select.tsx` | Dropdown pemilihan divisi kerja, opsi filter waktu, dan status. |
| 16 | **Separator** | `components/ui/separator.tsx` | Garis pemisah visual antar blok kartu atau seksi formulir. |
| 17 | **Sheet** | `components/ui/sheet.tsx` | Drawer samping (off-canvas) untuk navigasi sidebar pada perangkat mobile. |
| 18 | **Skeleton** | `components/ui/skeleton.tsx` | Placeholder animasi saat data dashboard dan rekap sedang dimuat. |
| 19 | **Textarea** | `components/ui/textarea.tsx` | Area input teks multi-baris untuk rincian tugas dan hasil capaian pekerjaan. |
| 20 | **Tabs** | `components/ui/tabs.tsx` | Navigasi tab konten (seperti di halaman profil: Biodata, Kinerja, Keamanan). |

---

## 🛠️ Konfigurasi & Utility

- **Konfigurasi Utama:** `components.json`
- **Helper Classname Utility:** `lib/utils.ts` (`cn(...)`)
- **Variabel Desain & Warna:** `src/app/globals.css` (terintegrasi dengan token tema hijau khas LAZ Persis dan dark mode).

---

## 🚀 Contoh Penggunaan

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StatusCard() {
  return (
    <Card className="border-outline-variant bg-surface-container-lowest">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Daily Report Hari Ini</CardTitle>
          <Badge variant="secondary">Terkirim</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button className="w-full">Lihat Detail</Button>
      </CardContent>
    </Card>
  );
}
```

---

## ⚠️ Aturan Tampilan & Ikon

- **Dilarang menggunakan raw emoji** pada elemen UI (seperti 📦, 📍, ⚡, 👩, 👨, dll).
- Gunakan **Google Material Symbols** (`<span className="material-symbols-outlined">icon_name</span>`) atau **Lucide React** (`lucide-react`) untuk menjaga estetika modern, profesional, dan konsisten.
