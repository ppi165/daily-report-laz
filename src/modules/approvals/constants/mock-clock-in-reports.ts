import { ClockInReport } from "../types/approval.types";

export const MOCK_CLOCK_IN_REPORTS: ClockInReport[] = [
  {
    id: "mock-rep-001",
    title: "Laporan Susulan: Pendistribusian Logistik Bencana Banjir",
    content: "Melakukan penyerahan paket sembako dan hygiene kit kepada 45 kepala keluarga terdampak banjir di posko siaga. Mengoordinasikan relawan lokal serta memverifikasi data penerima manfaat bersama aparat desa setempat.",
    division: "Program",
    attachments: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop",
    ],
    status: "PENDING_APPROVAL",
    isClockIn: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 jam lalu
    author: {
      name: "Muhammad Farhan",
      division: "Program",
    },
    approvals: [
      {
        id: "mock-appr-101",
        approverMockId: "mock-approver-1",
        approverName: "Siti Rahma",
        approverDivision: "Program",
        status: "PENDING",
        note: null,
        respondedAt: null,
      },
      {
        id: "mock-appr-102",
        approverMockId: "mock-approver-2",
        approverName: "Dedi Kurniawan",
        approverDivision: "Keuangan",
        status: "PENDING",
        note: null,
        respondedAt: null,
      },
    ],
  },
  {
    id: "mock-rep-002",
    title: "Laporan Susulan: Dokumentasi Lapangan Penyaluran Beasiswa Santri",
    content: "Melakukan pengambilan foto dan video dokumentasi program beasiswa santri berprestasi di Pesantren Persis Tarogong. Menyusun draft press release dan materi reels media sosial untuk kampanye transparansi zakat.",
    division: "Humas",
    attachments: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop",
    ],
    status: "PENDING_APPROVAL",
    isClockIn: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), // 7 jam lalu
    author: {
      name: "Aisyah Azzahra",
      division: "Humas",
    },
    approvals: [
      {
        id: "mock-appr-103",
        approverMockId: "mock-approver-3",
        approverName: "Nabila Putri",
        approverDivision: "Humas",
        status: "APPROVED",
        note: "Dokumentasi dan draf rilis sudah sesuai SOP humas lembaga.",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "mock-appr-104",
        approverMockId: "mock-approver-5",
        approverName: "Fajar Nugraha",
        approverDivision: "IT",
        status: "PENDING",
        note: null,
        respondedAt: null,
      },
    ],
  },
  {
    id: "mock-rep-003",
    title: "Laporan Susulan: Rekonsiliasi Bank & Verifikasi Mutasi Donasi Online",
    content: "Menyelesaikan rekonsiliasi penerimaan donasi melalui payment gateway dan transfer rekening virtual akun perbankan periode pekan berjalan. Memastikan seluruh bukti setor terverifikasi klop dengan mutasi rekening koran.",
    division: "Keuangan",
    attachments: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
    ],
    status: "PUBLISHED",
    isClockIn: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 hari lalu
    author: {
      name: "Hendra Gunawan",
      division: "Keuangan",
    },
    approvals: [
      {
        id: "mock-appr-105",
        approverMockId: "mock-approver-2",
        approverName: "Dedi Kurniawan",
        approverDivision: "Keuangan",
        status: "APPROVED",
        note: "Mutasi dan rekening koran sudah klop 100%.",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
      {
        id: "mock-appr-106",
        approverMockId: "mock-approver-6",
        approverName: "Ustadz H. Ahmad",
        approverDivision: "Pusat",
        status: "APPROVED",
        note: "Disetujui. Akuntabilitas keuangan terjaga baik.",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
    ],
  },
  {
    id: "mock-rep-004",
    title: "Laporan Susulan: Pengarsipan Berkas Legalitas Amil & Mitra",
    content: "Menginput perpanjangan berkas MoU kemitraan lembaga ke database internal sekretariat dan merapikan arsip fisik dokumen SK amil tahun berjalan.",
    division: "Sekretariat",
    attachments: [],
    status: "REJECTED",
    isClockIn: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    author: {
      name: "Dewi Lestari",
      division: "Sekretariat",
    },
    approvals: [
      {
        id: "mock-appr-107",
        approverMockId: "mock-approver-4",
        approverName: "Ridwan Fauzi",
        approverDivision: "Sekretariat",
        status: "REJECTED",
        note: "Bukti kehadiran dan tanggal tugas tidak sesuai dengan catatan absensi lapangan.",
        respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "mock-appr-108",
        approverMockId: "mock-approver-1",
        approverName: "Siti Rahma",
        approverDivision: "Program",
        status: "PENDING",
        note: null,
        respondedAt: null,
      },
    ],
  },
];
