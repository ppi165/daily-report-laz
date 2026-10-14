# Rencana Implementasi Migrasi Arsitektur Feature-Driven & Use-Case-Driven

> **Untuk agen pekerja:** REQUIRED SUB-SKILL: Gunakan superpowers:subagent-driven-development (direkomendasikan) atau superpowers:executing-plans untuk mengimplementasikan rencana ini task-by-task. Langkah-langkah menggunakan format checkbox (`- [ ]`).

**Goal:** Memigrasi seluruh struktur kode `daily-report-laz` dari arsitektur lama (Controller-Service-Repository) ke Feature-Driven & Use-Case-Driven Architecture sesuai spesifikasi `AGENTS.md`.

**Architecture:** Menerapkan prinsip 1 File = 1 Responsibility dengan dependency flow terarah: `Page/Route -> Action -> Use Case -> Repository -> Prisma -> DB`. Memindahkan prisma dan auth helper ke `src/infrastructure/`, komponen global ke `src/common/`, serta mengorganisasi ulang domain ke `src/modules/{feature}/` dengan schema Zod per use-case.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Prisma ORM, Supabase, Zod, Jose (JWT), Tailwind CSS v4.

**Spec:** Dokumen `AGENTS.md` pada root project.

## Global Constraints

- Wajib menerapkan prinsip 1 File = 1 Responsibility.
- Naming convention seluruh file wajib `kebab-case` (contoh: `login.use-case.ts`, `login.schema.ts`, `report-form.tsx`).
- Prisma Client HANYA boleh diakses di dalam folder `repositories/` dan file singleton di `src/infrastructure/prisma/`.
- Validasi wajib menggunakan Zod (1 schema per use-case).
- Dilarang menggunakan raw emoji di UI (gunakan icon SVG / Material Symbols).
- File size target: Page ≤ 150 baris, Use Case ≤ 150 baris, Repository ≤ 150 baris, Component ≤ 200 baris.

## Review Focus

1. Penanganan error validasi Zod pada Server Action / Route Handler harus mengembalikan respons yang konsisten (`{ success: false, message: ... }`).
2. Cookie JWT session wajib menggunakan atribut `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, dan `secure` sesuai environment.
3. Semua komponen UI yang mengimpor dari path lama (`@/src/shared/...` dan controller lama) wajib dialihkan ke path baru tanpa error import.
4. Endpoint REST API `/api/v1/*` tetap berfungsi normal untuk interoperabilitas dengan client-side fetching yang sudah ada.
5. `next build` harus lulus dengan exit code 0.

---

### Task 1: Setup Dependensi & Layer Infrastructure

**Files:**
- Modify: `package.json`
- Create: `src/infrastructure/prisma/prisma.client.ts`
- Create: `src/infrastructure/prisma/index.ts`
- Create: `src/infrastructure/auth/jwt.util.ts`
- Create: `src/infrastructure/auth/index.ts`
- Create: `src/infrastructure/supabase/client.ts`
- Create: `src/infrastructure/supabase/index.ts`

**Interfaces:**
- Produces:
  - `prisma` dari `@/src/infrastructure/prisma`
  - `signJWT`, `verifyJWT` dari `@/src/infrastructure/auth`
  - `supabase` dari `@/src/infrastructure/supabase`

- [ ] **Step 1: Install Zod**
  Jalankan `npm install zod` dan arahkan log ke `/tmp/task_log.txt`.

- [ ] **Step 2: Buat singleton Prisma di `src/infrastructure/prisma/prisma.client.ts` dan re-export di `index.ts`**
  Gunakan pattern singleton `globalThis` yang aman untuk Next.js hot-reload.

- [ ] **Step 3: Pindahkan JWT utilities ke `src/infrastructure/auth/jwt.util.ts` dan re-export di `index.ts`**
  Migrasikan fungsi `signJWT` dan `verifyJWT` berbasis library `jose`.

- [ ] **Step 4: Buat Supabase client di `src/infrastructure/supabase/client.ts` dan re-export di `index.ts`**
  Gunakan `createClient` dari `@supabase/supabase-js`.

- [ ] **Step 5: Verifikasi build infrastructure**
  Jalankan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan tipe.

---

### Task 2: Migrasi Layer Common (Global UI & Context)

**Files:**
- Create: `src/common/context/theme-context.tsx`
- Create: `src/common/components/app-shell.tsx`
- Create: `src/common/components/top-nav-bar.tsx`
- Create: `src/common/components/side-nav-bar.tsx`
- Create: `src/common/components/profile-dropdown.tsx`
- Create: `src/common/components/notification-dropdown.tsx`

**Interfaces:**
- Consumes: `src/infrastructure/auth`
- Produces: `AppShell`, `ThemeProvider`, komponen navigasi global di `src/common/`

- [ ] **Step 1: Pindahkan dan rename file context ke `src/common/context/theme-context.tsx`**
  Pastikan nama file kebab-case.

- [ ] **Step 2: Pindahkan komponen UI shell ke `src/common/components/` dengan penamaan kebab-case**
  - `app-shell.tsx`
  - `top-nav-bar.tsx`
  - `side-nav-bar.tsx`
  - `profile-dropdown.tsx`
  - `notification-dropdown.tsx`

- [ ] **Step 3: Sesuaikan path import pada komponen common**
  Ubah import yang sebelumnya merujuk ke `@/src/shared/...` menjadi `@/src/common/...` dan `@/src/infrastructure/...`.

---

### Task 3: Migrasi Modul Auth

**Files:**
- Create: `src/modules/auth/schemas/login.schema.ts`
- Create: `src/modules/auth/repositories/auth.repository.ts`
- Create: `src/modules/auth/use-cases/login.use-case.ts`
- Create: `src/modules/auth/actions/login.action.ts`
- Create: `src/modules/auth/actions/logout.action.ts`
- Create: `src/modules/auth/components/login-form.tsx`
- Create: `src/modules/auth/index.ts`
- Modify: `app/api/v1/auth/login/route.ts`
- Modify: `app/api/v1/auth/logout/route.ts`
- Modify: `app/login/page.tsx`

**Interfaces:**
- Consumes: `prisma` dari `@/src/infrastructure/prisma`, `signJWT` dari `@/src/infrastructure/auth`
- Produces: `loginAction`, `logoutAction`, `loginUseCase`, `authRepository`

- [ ] **Step 1: Buat `login.schema.ts` menggunakan Zod**
  Validasi `identifier` (min 1) dan `password` (min 1), opsional `remember`.

- [ ] **Step 2: Buat `auth.repository.ts`**
  Implementasikan method `findUserByUsernameOrEmail(identifier: string)`.

- [ ] **Step 3: Buat `login.use-case.ts`**
  Implementasikan `LoginUseCase` dengan method `execute(input: LoginInput)`. Lakukan pengecekan user dan validasi password dengan `bcryptjs`.

- [ ] **Step 4: Buat `login.action.ts` dan `logout.action.ts`**
  `loginAction` memvalidasi input dengan Zod, memanggil use-case, dan menyetel cookie session. `logoutAction` menghapus cookie.

- [ ] **Step 5: Migrasikan `login-form.tsx` dan hubungkan route handler `/api/v1/auth/login` serta `/api/v1/auth/logout`**
  Perbarui route handler agar langsung mendelegasikan ke use-case / action tanpa melewati controller lama.

---

### Task 4: Migrasi Modul Users

**Files:**
- Create: `src/modules/users/repositories/user.repository.ts`
- Create: `src/modules/users/use-cases/get-current-user.use-case.ts`
- Create: `src/modules/users/actions/get-current-user.action.ts`
- Create: `src/modules/users/components/profile-view.tsx`
- Create: `src/modules/users/index.ts`
- Modify: `app/api/v1/users/me/route.ts`
- Modify: `app/profil/page.tsx`

**Interfaces:**
- Consumes: `prisma` dari `@/src/infrastructure/prisma`, `verifyJWT` dari `@/src/infrastructure/auth`
- Produces: `getCurrentUserAction`, `getCurrentUserUseCase`, `userRepository`

- [ ] **Step 1: Buat `user.repository.ts`**
  Method `findById(id: string)` dengan select fields `id, name, email, username, division`.

- [ ] **Step 2: Buat `get-current-user.use-case.ts`**
  Verifikasi token JWT, ambil profil user dari repository, dan kembalikan data.

- [ ] **Step 3: Buat `get-current-user.action.ts` dan hubungkan route `/api/v1/users/me`**
  Route handler memanggil `getCurrentUserUseCase.execute()`.

- [ ] **Step 4: Migrasikan `profile-view.tsx` (kebab-case) dan hubungkan halaman `/profil`**
  Perbarui import profile view dan integrasi data.

---

### Task 5: Migrasi Modul Reports

**Files:**
- Create: `src/modules/reports/schemas/create-report.schema.ts`
- Create: `src/modules/reports/schemas/get-reports.schema.ts`
- Create: `src/modules/reports/repositories/report.repository.ts`
- Create: `src/modules/reports/use-cases/create-report.use-case.ts`
- Create: `src/modules/reports/use-cases/get-reports.use-case.ts`
- Create: `src/modules/reports/use-cases/get-report-by-id.use-case.ts`
- Create: `src/modules/reports/use-cases/delete-report.use-case.ts`
- Create: `src/modules/reports/actions/create-report.action.ts`
- Create: `src/modules/reports/actions/get-reports.action.ts`
- Create: `src/modules/reports/actions/delete-report.action.ts`
- Create: `src/modules/reports/components/report-form.tsx`
- Create: `src/modules/reports/components/rekap-report.tsx`
- Create: `src/modules/reports/components/manage-division-modal.tsx`
- Create: `src/modules/reports/index.ts`
- Modify: `app/api/v1/reports/route.ts`
- Modify: `app/daily-report/page.tsx`
- Modify: `app/rekap-report/page.tsx`
- Modify: `app/reports/new/page.tsx`

**Interfaces:**
- Consumes: `prisma` dari `@/src/infrastructure/prisma`
- Produces: CRUD use cases, actions, dan components untuk laporan

- [ ] **Step 1: Buat schema Zod `create-report.schema.ts` dan `get-reports.schema.ts`**
  Validasi input laporan (title, content, division, attachments).

- [ ] **Step 2: Buat `report.repository.ts`**
  Menangani method Prisma: `create`, `findMany`, `findById`, `count`, `update`, `delete`.

- [ ] **Step 3: Buat use-cases untuk laporan**
  `CreateReportUseCase`, `GetReportsUseCase`, `GetReportByIdUseCase`, `DeleteReportUseCase`.

- [ ] **Step 4: Buat Server Actions dan hubungkan route handler `app/api/v1/reports/route.ts`**
  Delegasikan GET dan POST di route handler ke use-case terkait.

- [ ] **Step 5: Migrasikan komponen report ke kebab-case dan update halaman**
  Update import di `ReportForm.tsx -> report-form.tsx`, `rekap-report.tsx`, `manage-division-modal.tsx`, serta halaman `/daily-report`, `/rekap-report`, `/reports/new`.

---

### Task 6: Migrasi Modul Dashboard

**Files:**
- Create: `src/modules/dashboard/repositories/dashboard.repository.ts`
- Create: `src/modules/dashboard/use-cases/get-dashboard-stats.use-case.ts`
- Create: `src/modules/dashboard/actions/get-dashboard-stats.action.ts`
- Create: `src/modules/dashboard/components/dashboard-view.tsx`
- Create: `src/modules/dashboard/components/dashboard-stats.tsx`
- Create: `src/modules/dashboard/components/greeting-banner.tsx`
- Create: `src/modules/dashboard/components/recent-activity-card.tsx`
- Create: `src/modules/dashboard/components/team-feed.tsx`
- Create: `src/modules/dashboard/components/today-status-card.tsx`
- Create: `src/modules/dashboard/index.ts`
- Modify: `app/api/v1/dashboard/stats/route.ts`
- Modify: `app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `prisma` dari `@/src/infrastructure/prisma`
- Produces: `getDashboardStatsUseCase`, `getDashboardStatsAction`, komponen dashboard

- [ ] **Step 1: Buat `dashboard.repository.ts`**
  Query agregasi Prisma: count reports, count active users, count total users.

- [ ] **Step 2: Buat `get-dashboard-stats.use-case.ts` dan `get-dashboard-stats.action.ts`**
  Hitung persentase `completionRate` dan return format standar `{ success: true, data: { ... } }`.

- [ ] **Step 3: Hubungkan route handler `app/api/v1/dashboard/stats/route.ts`**
  Panggil `getDashboardStatsUseCase.execute()`.

- [ ] **Step 4: Migrasikan komponen dashboard ke kebab-case dan update halaman `/dashboard`**
  Rename dan sesuaikan import di semua komponen dashboard.

---

### Task 7: Pembersihan Legacy Code & Verifikasi Menyeluruh

**Files:**
- Delete: File-file lama di `src/shared/`
- Delete: File controller & service lama di `src/modules/*/controllers/` dan `src/modules/*/services/`
- Modify: `app/layout.tsx` (pastikan import ThemeProvider & styling mengarah ke `src/common`)
- Test: Build & endpoint test

- [ ] **Step 1: Hapus folder dan file lama yang sudah digantikan**
  Hapus file di `src/shared/` dan controller/service lama.

- [ ] **Step 2: Jalankan `npm run lint` & periksa sisa import rusak**
  Pastikan tidak ada dangling import ke file yang sudah dipindah.

- [ ] **Step 3: Jalankan `npm run build`**
  Pastikan build Next.js (Turbopack) sukses tanpa error (exit code 0).

- [ ] **Step 4: Verifikasi fungsionalitas via curl**
  Tes login (`POST /api/v1/auth/login`), cek profil (`GET /api/v1/users/me`), cek stats (`GET /api/v1/dashboard/stats`), dan cek list report (`GET /api/v1/reports`).
