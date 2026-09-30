<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENT RULES — MODULAR MONOLITH

## 1. CORE PRINCIPLE

Project ini menggunakan arsitektur **Modular Monolith**.

Semua fitur berjalan dalam **satu aplikasi/deployment**, tetapi kode dibagi menjadi modul-modul berdasarkan domain atau business capability.

Agent WAJIB:

* Menjaga modularitas kode.
* Memisahkan setiap domain/fitur secara jelas.
* Menghindari ketergantungan antar modul yang tidak diperlukan.
* Menghindari struktur kode yang terlalu terpusat.
* Menghindari pembuatan microservices kecuali diminta secara eksplisit.
* Mengutamakan maintainability, readability, scalability, dan separation of concerns.

Jangan mengubah arsitektur menjadi microservices tanpa instruksi eksplisit dari user.

---

# 2. DEVELOPMENT PRINCIPLES

Agent harus mengikuti prinsip:

* Separation of Concerns
* Single Responsibility Principle
* Don't Repeat Yourself (DRY)
* Keep It Simple (KISS)
* Explicit over implicit
* Reusable components
* Low coupling
* High cohesion
* Consistent naming
* Clean and readable code

Prioritaskan solusi sederhana yang sesuai kebutuhan project.

Jangan membuat abstraction berlebihan hanya untuk terlihat "clean".

---

# 3. PROJECT STRUCTURE

Gunakan struktur modular seperti berikut:

```text
src/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── validators/
│   │   ├── routes/
│   │   └── index.*
│   │
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── validators/
│   │   ├── routes/
│   │   └── index.*
│   │
│   ├── reports/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── validators/
│   │   ├── routes/
│   │   └── index.*
│   │
│   └── ...
│
├── shared/
│   ├── database/
│   ├── middleware/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── config/
│
└── app.*
```

Sesuaikan ekstensi file dan struktur dengan framework yang digunakan.

Jangan membuat struktur folder baru tanpa alasan yang jelas.

---

# 4. MODULE BOUNDARY

Setiap module harus merepresentasikan satu domain atau business capability.

Contoh:

```text
auth
users
reports
employees
departments
notifications
exports
```

Setiap module harus memiliki tanggung jawab yang jelas.

Contoh:

```text
reports
→ membuat laporan
→ mengubah laporan
→ melihat laporan
→ menghapus laporan
→ mengambil rekap laporan
```

Jangan memasukkan logic laporan ke dalam module users hanya karena user membuat laporan.

---

# 5. MODULE INTERNAL STRUCTURE

Setiap module sebaiknya mengikuti pola:

```text
module/
├── controllers/
├── services/
├── repositories/
├── models/
├── validators/
├── routes/
└── index.*
```

Tanggung jawab:

### Controller

Controller bertanggung jawab terhadap:

* menerima request
* validasi input dasar
* memanggil service
* mengembalikan response

Controller TIDAK boleh berisi business logic yang kompleks.

Contoh:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

---

### Service

Service adalah tempat utama untuk business logic.

Service bertanggung jawab terhadap:

* business rules
* proses data
* validasi bisnis
* koordinasi repository
* koordinasi module lain jika diperlukan

Jangan meletakkan business logic kompleks di controller.

---

### Repository

Repository bertanggung jawab terhadap akses database.

Repository:

* query database
* insert
* update
* delete
* find
* transaction jika diperlukan

Business logic tidak boleh diletakkan di repository.

---

### Model

Model bertanggung jawab terhadap representasi data dan database schema sesuai teknologi yang digunakan.

---

### Validator

Validator bertanggung jawab terhadap validasi input.

Contoh:

```text
required
email
string
number
maximum length
file type
file size
```

Validasi bisnis yang kompleks tetap berada di Service.

---

### Routes

Routes hanya bertanggung jawab terhadap pemetaan endpoint ke controller.

Contoh:

```text
POST   /reports
GET    /reports
GET    /reports/:id
PUT    /reports/:id
DELETE /reports/:id
```

---

# 6. DEPENDENCY RULE

Dependency antar module harus dikontrol.

Contoh yang diperbolehkan:

```text
Reports
   ↓
Users
```

Jika Reports membutuhkan data user, Reports boleh menggunakan public interface/service dari Users.

Hindari:

```text
Reports
   ↓
Users Repository
   ↓
Users Database
```

Module tidak boleh mengakses internal implementation module lain secara langsung.

Gunakan public service/interface.

---

# 7. SHARED LAYER

Folder `shared` hanya digunakan untuk sesuatu yang benar-benar bersifat umum.

Contoh:

```text
shared/
├── database
├── middleware
├── utils
├── constants
├── config
└── types
```

Jangan memasukkan business logic khusus module ke dalam `shared`.

Jika sebuah function hanya digunakan oleh module Reports, letakkan di:

```text
modules/reports/
```

bukan:

```text
shared/utils/
```

---

# 8. DATABASE RULES

Gunakan satu database untuk aplikasi Modular Monolith.

Setiap module bertanggung jawab terhadap data/domain masing-masing.

Contoh:

```text
users
employees
reports
departments
notifications
```

Jangan membuat database terpisah untuk setiap module kecuali user meminta secara eksplisit.

Gunakan transaction ketika satu operasi memengaruhi beberapa data yang harus konsisten.

---

# 9. API RULES

API harus mengikuti struktur yang konsisten.

Gunakan:

```text
/api/v1/...
```

Contoh:

```text
/api/v1/auth
/api/v1/users
/api/v1/reports
/api/v1/departments
```

Gunakan HTTP method secara tepat:

```text
GET     → mengambil data
POST    → membuat data
PUT     → mengganti/update data
PATCH   → update sebagian
DELETE  → menghapus data
```

Response API harus konsisten.

Contoh:

```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

# 10. AUTHENTICATION & AUTHORIZATION

Authentication dan authorization harus dipisahkan.

Authentication:

```text
Siapa user tersebut?
```

Authorization:

```text
Apa yang boleh dilakukan user tersebut?
```

Jangan mengandalkan frontend untuk security.

Semua permission penting harus divalidasi di backend.

Contoh:

```text
Admin
→ melihat semua laporan

Employee
→ membuat laporan
→ melihat laporan sendiri
```

Backend tetap harus melakukan pengecekan permission.

---

# 11. FRONTEND RULES

Frontend juga harus menggunakan struktur modular.

Contoh:

```text
src/
├── modules/
│   ├── auth/
│   ├── reports/
│   ├── users/
│   └── departments/
│
├── components/
├── layouts/
├── pages/
├── hooks/
├── services/
├── utils/
└── config/
```

Komponen yang hanya digunakan oleh satu module harus berada di module tersebut.

Contoh:

```text
modules/reports/components/ReportForm
```

bukan:

```text
components/ReportForm
```

Jika hanya digunakan oleh Reports.

---

# 12. UI COMPONENT RULE

Gunakan reusable components untuk elemen yang benar-benar digunakan berulang.

Contoh:

```text
Button
Modal
Input
Select
Table
Card
Dialog
Toast
```

Jangan membuat komponen global untuk sesuatu yang hanya digunakan satu kali.

Pertahankan konsistensi:

* typography
* spacing
* border radius
* button style
* form style
* table style
* responsive behavior

Jangan mengubah desain UI yang sudah ada kecuali user meminta perubahan.

---

# 13. FILE UPLOAD RULE

Jika aplikasi menggunakan upload file:

Backend wajib memvalidasi:

```text
file type
file size
file name
storage location
access permission
```

Jangan mempercayai validasi frontend.

Frontend hanya membantu user.

Backend tetap menjadi sumber validasi utama.

---

# 14. ERROR HANDLING

Jangan menggunakan error handling yang tidak konsisten.

Gunakan centralized error handling apabila framework mendukung.

Error harus:

* informatif
* aman
* tidak membocorkan informasi sensitif
* mudah ditelusuri saat debugging

Jangan menampilkan:

```text
database password
API key
secret
stack trace production
```

kepada user.

---

# 15. ENVIRONMENT VARIABLES

Semua konfigurasi sensitif harus menggunakan environment variables.

Contoh:

```text
DATABASE_URL
DB_HOST
DB_USER
DB_PASSWORD
JWT_SECRET
APP_URL
STORAGE_PATH
```

Jangan hardcode:

```text
password
secret key
API key
database credential
```

di source code.

---

# 16. SECURITY

Agent wajib memperhatikan:

* authentication
* authorization
* input validation
* SQL injection
* XSS
* CSRF jika relevan
* file upload security
* password hashing
* secret management
* rate limiting jika diperlukan
* secure HTTP headers

Jangan menyimpan password dalam plaintext.

---

# 17. CHANGE MANAGEMENT

Sebelum melakukan perubahan besar:

1. Periksa struktur project.
2. Identifikasi module yang terdampak.
3. Identifikasi dependency.
4. Periksa file yang sudah ada.
5. Gunakan kembali code yang tersedia jika sesuai.
6. Hindari membuat duplicate implementation.

Jangan langsung membuat file baru sebelum memastikan fitur tersebut belum tersedia.

---

# 18. MODIFY, DON'T REWRITE

Jika fitur sudah tersedia:

```text
MODIFY
```

bukan:

```text
REWRITE EVERYTHING
```

Jangan menghapus atau mengganti arsitektur existing hanya karena memiliki pendekatan yang berbeda.

Jika perubahan besar memang diperlukan:

* jelaskan alasan
* identifikasi impact
* lakukan perubahan secara bertahap

---

# 19. NO UNNECESSARY DEPENDENCIES

Jangan menambahkan library/package baru jika tidak diperlukan.

Sebelum menambahkan dependency:

1. Periksa apakah fitur dapat dibuat menggunakan dependency yang sudah tersedia.
2. Jika tidak, gunakan dependency yang stabil dan relevan.
3. Hindari dependency yang hanya digunakan untuk satu fungsi sederhana.

---

# 20. TESTING

Setiap business-critical feature harus dapat diuji.

Prioritaskan:

```text
Unit Test
Integration Test
API Test
```

Minimal test case harus mencakup:

```text
success case
validation error
authentication error
authorization error
not found
server/database error
```

---

# 21. LOGGING

Gunakan logging untuk proses penting.

Contoh:

```text
login
logout
create report
update report
delete report
export data
permission denied
system error
```

Jangan menyimpan data sensitif di log.

---

# 22. PERFORMANCE

Prioritaskan performa yang masuk akal tanpa premature optimization.

Perhatikan:

* database query
* N+1 query
* pagination
* unnecessary API request
* image size
* caching jika diperlukan
* lazy loading jika relevan

Jangan melakukan optimasi kompleks tanpa kebutuhan nyata.

---

# 23. RESPONSIVE DESIGN

Frontend harus mendukung:

```text
Desktop
Tablet
Mobile
```

Gunakan responsive layout.

Jangan membuat desain hanya untuk satu ukuran layar kecuali user meminta secara khusus.

---

# 24. NAMING CONVENTION

Gunakan nama yang jelas dan konsisten.

Contoh:

```text
createReport
updateReport
deleteReport
getReportById
```

Hindari:

```text
doThing
processData
handleStuff
tempFunction
```

Nama module harus menggambarkan domain.

---

# 25. CODE QUALITY

Sebelum menyelesaikan perubahan, Agent harus memeriksa:

```text
- syntax error
- import error
- unused import
- duplicate code
- broken dependency
- incorrect route
- incorrect API call
- database mismatch
- authentication issue
- authorization issue
- responsive issue
```

Jangan menyatakan pekerjaan selesai jika masih terdapat error yang diketahui.

---

# 26. GIT / VERSION CONTROL

Gunakan commit berdasarkan perubahan yang logis.

Contoh:

```text
feat: add report submission
fix: fix report validation
refactor: improve report service
style: improve dashboard layout
docs: update API documentation
```

Hindari commit yang mencampurkan banyak perubahan tidak berkaitan.

---

# 27. AGENT WORKFLOW

Setiap kali menerima task, ikuti workflow:

### STEP 1 — Understand

Pahami:

* tujuan task
* module terkait
* input
* output
* business rule
* existing implementation

### STEP 2 — Inspect

Periksa:

```text
project structure
existing modules
related files
database schema
API
frontend components
dependencies
```

### STEP 3 — Plan

Tentukan:

```text
module yang terdampak
file yang perlu dibuat
file yang perlu diubah
dependency
database changes
API changes
```

### STEP 4 — Implement

Implementasikan perubahan dengan tetap mengikuti Modular Monolith.

### STEP 5 — Validate

Periksa:

```text
build
lint
test
API
database
UI
responsive
authentication
authorization
```

### STEP 6 — Review

Pastikan:

```text
tidak ada duplicate code
tidak ada dependency yang tidak perlu
tidak ada business logic di controller
tidak ada module yang melanggar boundary
tidak ada secret yang hardcoded
```

### STEP 7 — Report

Berikan ringkasan:

```text
Changes made
Files changed
Modules affected
Database changes
API changes
Testing performed
Known issues
```

---

# 28. IMPORTANT AGENT BEHAVIOR

Agent DILARANG:

* membuat microservices tanpa instruksi
* melakukan rewrite project tanpa alasan
* menghapus fitur existing tanpa izin
* mengubah database schema secara sembarangan
* membuat duplicate component
* membuat duplicate API
* memasukkan semua logic ke satu file
* membuat controller terlalu kompleks
* mengakses database langsung dari frontend
* hardcode credentials
* memasukkan business logic ke shared utilities
* membuat abstraction berlebihan
* menambahkan dependency tanpa kebutuhan

---

# 29. ARCHITECTURE DECISION PRIORITY

Jika terjadi konflik antara beberapa pendekatan, gunakan prioritas:

```text
1. Existing project requirement
2. Business requirement
3. Module boundary
4. Security
5. Maintainability
6. Simplicity
7. Performance
```

Jangan mengorbankan business requirement hanya demi architectural purity.

---

# 30. GOLDEN RULE

> "One application, multiple well-defined modules."

Project ini adalah **Modular Monolith**, bukan kumpulan file yang saling bercampur dan bukan microservices.

Setiap module harus:

* memiliki tanggung jawab yang jelas,
* memiliki internal implementation sendiri,
* berkomunikasi melalui interface/service yang jelas,
* memiliki coupling seminimal mungkin,
* dan tetap dapat berkembang tanpa merusak module lain.

Sebelum menulis kode, **pahami struktur project terlebih dahulu.**

Sebelum membuat file baru, **periksa apakah functionality tersebut sudah tersedia.**

Sebelum mengubah arsitektur, **pastikan perubahan tersebut benar-benar diperlukan.**

**Do not overengineer. Build modular, simple, maintainable software.**
