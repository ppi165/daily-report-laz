# Desain Spesifikasi: Migrasi Komponen UI ke shadcn/ui

**Tanggal:** 15 Oktober 2026  
**Status:** Draf Tervalidasi  
**Pendekatan:** Migrasi Bertahap per Halaman/Fitur (Opsi A)

---

## 1. Latar Belakang & Tujuan

Aplikasi Daily Report LAZ Persis saat ini telah memiliki fungsionalitas inti, namun sebagian besar elemen antarmuka (UI) masih menggunakan elemen HTML mentah (`<button>`, `<input>`, `<select>`, modal kustom dengan `fixed inset-0`, dan dropdown dengan listener `click-outside` manual). 

Untuk meningkatkan konsistensi visual, aksesibilitas (WAI-ARIA), performa, serta kemudahan kolaborasi tim, seluruh elemen UI tersebut akan dimigrasikan ke komponen resmi **shadcn/ui** berbasis Tailwind CSS v4 yang sudah diinisialisasi di direktori `components/ui/`.

---

## 2. Prinsip & Aturan Desain

1. **Konsistensi Arsitektur:** Tetap mematuhi aturan Feature-Driven Architecture (1 File = 1 Responsibility, path modular di `src/modules/*` dan komponen global di `src/common/*`).
2. **Tanpa Raw Emoji:** Dilarang keras menggunakan raw emoji di UI (seperti 🚀, 📦, 📍). Gunakan Google Material Symbols (`<span className="material-symbols-outlined">icon_name</span>`) atau Lucide Icons.
3. **Kompatibilitas Tema:** Mempertahankan palet warna tema LAZ Persis (hijau container, on-primary) dan dukungan Dark/Light mode di `globals.css`.
4. **Penyederhanaan Kode:** Menghapus boilerplate state manual yang berlebih (misal `isOpen` + listener document click pada dropdown, digantikan oleh `DropdownMenu` atau `Popover` bawaan shadcn).

---

## 3. Pemetaan Komponen Mentah ke shadcn/ui

| Elemen Lama (Mentah) | Komponen shadcn/ui | File Contoh |
|---|---|---|
| `<button>` manual & custom pill | `Button` (dengan variant `default`, `outline`, `ghost`, `destructive`) | Seluruh komponen |
| `<input type="text/password/email">` | `Input` | `login-form.tsx`, `profile-view.tsx` |
| `<textarea>` | `Textarea` | `report-form.tsx`, `profile-view.tsx` |
| `<select>` dropdown bawaan browser | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | `report-form.tsx`, `rekap-report.tsx` |
| Modal custom `fixed inset-0 z-50` | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` | `manage-division-modal.tsx` |
| Sidebar off-canvas mobile | `Sheet`, `SheetContent`, `SheetTrigger` | `side-nav-bar.tsx` |
| Dropdown custom (`useRef` + `useEffect`) | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent` | `profile-dropdown.tsx`, `notification-dropdown.tsx` |
| Tab navigasi manual (`activeTab` state) | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `profile-view.tsx` |
| Tag status / pill badge | `Badge` (variant `default`, `secondary`, `outline`, `destructive`) | `today-status-card.tsx`, `rekap-report.tsx` |
| Progress bar manual | `Progress` | `rekap-report.tsx`, `profile-view.tsx` |
| Avatar img / text fallback | `Avatar`, `AvatarImage`, `AvatarFallback` | `profile-dropdown.tsx`, `team-feed.tsx` |
| Spinner loading manual | `Skeleton` | `rekap-report.tsx` |

---

## 4. Urutan Fase Eksekusi (Opsi A)

### Fase 1: Common Navigation & Shell
- `src/common/components/profile-dropdown.tsx`: Ganti logika manual dropdown ke `DropdownMenu` + `Avatar`.
- `src/common/components/notification-dropdown.tsx`: Ganti ke `DropdownMenu` / `Popover` + `Badge` + `ScrollArea`.
- `src/common/components/side-nav-bar.tsx`: Integrasikan drawer mobile dengan `Sheet`.
- `src/common/components/top-nav-bar.tsx`: Gunakan `Button` ghost untuk toggle sidebar & theme.

### Fase 2: Autentikasi (Login)
- `src/modules/auth/components/login-form.tsx`: Migrasikan form container ke `Card`, input ke `Input`, label ke `Label`, dan submit ke `Button`.

### Fase 3: Dashboard
- `src/modules/dashboard/components/today-status-card.tsx`: Pasang `Card`, `Badge` status hari ini, dan `Button`.
- `src/modules/dashboard/components/dashboard-stats.tsx`: Pasang `Card` untuk kartu metrik ringkasan.
- `src/modules/dashboard/components/recent-activity-card.tsx` & `team-feed.tsx`: Pasang `Card`, `Badge`, `Avatar`, dan `Button`.

### Fase 4: Pelaporan (Daily Report & Rekap)
- `src/modules/reports/components/report-form.tsx`: Pasang `Card`, `Input`, `Textarea`, `Select`, `Button`.
- `src/modules/reports/components/manage-division-modal.tsx`: Refactor modal manual menjadi `Dialog` shadcn.
- `src/modules/reports/components/rekap-report.tsx`: Pasang filter `Select`, search `Input`, indikator `Progress`, `Skeleton` saat loading, dan `Badge`.

### Fase 5: Profil Pegawai
- `src/modules/users/components/profile-view.tsx`: Ganti sistem tab 3 button manual menjadi `Tabs` shadcn, gunakan `Avatar` besar, `Input`, `Textarea`, `Select`, dan `Progress` kelengkapan profil.

---

## 5. Kriteria Keberhasilan & Verifikasi

1. **Zero TypeScript Errors:** Menjalankan `npx tsc --noEmit` tanpa error tipe data.
2. **Build Sukses:** Menjalankan `npm run build` menghasilkan exit code 0.
3. **Tidak Ada Regresi Visual:** Tampilan tetap responsif, estetika dark-glass / tema hijau LAZ Persis tetap konsisten, dan fungsionalitas CRUD/interaksi form tetap berjalan normal.
