import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Clock-in Mock Reports...');
  const defaultPassword = await bcrypt.hash('amil123', 10);

  // 1. Ensure Amil users exist
  const mockUsers = [
    {
      email: 'farhan@lazpersis.or.id',
      username: 'farhan',
      name: 'Muhammad Farhan',
      division: 'Program',
      role: 'STAFF',
      position: 'Staf Bidang Program',
    },
    {
      email: 'aisyah@lazpersis.or.id',
      username: 'aisyah',
      name: 'Aisyah Azzahra',
      division: 'Humas',
      role: 'STAFF',
      position: 'Staf Humas & Media Publikasi',
    },
    {
      email: 'hendra@lazpersis.or.id',
      username: 'hendra',
      name: 'Hendra Gunawan',
      division: 'Keuangan',
      role: 'STAFF',
      position: 'Staf Keuangan & Akuntansi',
    },
    {
      email: 'dewi@lazpersis.or.id',
      username: 'dewi',
      name: 'Dewi Lestari',
      division: 'Sekretariat',
      role: 'STAFF',
      position: 'Staf Administrasi & Arsip',
    },
  ];

  const userMap = {};

  for (const u of mockUsers) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        name: u.name,
        division: u.division,
        position: u.position,
      },
      create: {
        ...u,
        password: defaultPassword,
      },
    });
    userMap[u.username] = user;
    console.log(`User ${u.name} ready.`);
  }

  // 2. Clear old mock clock-in reports if exist
  const existingMockReports = await prisma.report.findMany({
    where: {
      id: { in: ['mock-rep-001', 'mock-rep-002', 'mock-rep-003', 'mock-rep-004'] },
    },
  });

  if (existingMockReports.length > 0) {
    await prisma.reportApproval.deleteMany({
      where: {
        reportId: { in: ['mock-rep-001', 'mock-rep-002', 'mock-rep-003', 'mock-rep-004'] },
      },
    });
    await prisma.report.deleteMany({
      where: {
        id: { in: ['mock-rep-001', 'mock-rep-002', 'mock-rep-003', 'mock-rep-004'] },
      },
    });
    console.log('Cleaned up previous mock clock-in reports.');
  }

  // 3. Create Mock Clock-In Reports
  // Skenario 1: Menunggu Verifikasi Penuh (0/2)
  await prisma.report.create({
    data: {
      id: 'mock-rep-001',
      title: 'Laporan Susulan: Pendistribusian Logistik Bencana Banjir',
      content:
        'Melakukan penyerahan paket sembako dan hygiene kit kepada 45 kepala keluarga terdampak banjir di posko siaga. Mengoordinasikan relawan lokal serta memverifikasi data penerima manfaat bersama aparat desa setempat.',
      division: 'Program',
      attachments: [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop',
      ],
      status: 'PENDING_APPROVAL',
      isClockIn: true,
      authorId: userMap['farhan'].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 jam lalu
      approvals: {
        create: [
          {
            id: 'mock-appr-101',
            approverMockId: 'mock-approver-1',
            approverName: 'Siti Rahma',
            approverDivision: 'Program',
            status: 'PENDING',
          },
          {
            id: 'mock-appr-102',
            approverMockId: 'mock-approver-2',
            approverName: 'Dedi Kurniawan',
            approverDivision: 'Keuangan',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  // Skenario 2: Menunggu Verifikasi Lanjutan (1/2 Disetujui)
  await prisma.report.create({
    data: {
      id: 'mock-rep-002',
      title: 'Laporan Susulan: Dokumentasi Lapangan Penyaluran Beasiswa Santri',
      content:
        'Melakukan pengambilan foto dan video dokumentasi program beasiswa santri berprestasi di Pesantren Persis Tarogong. Menyusun draft press release dan materi reels media sosial untuk kampanye transparansi zakat.',
      division: 'Humas',
      attachments: [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop',
      ],
      status: 'PENDING_APPROVAL',
      isClockIn: true,
      authorId: userMap['aisyah'].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7), // 7 jam lalu
      approvals: {
        create: [
          {
            id: 'mock-appr-103',
            approverMockId: 'mock-approver-3',
            approverName: 'Nabila Putri',
            approverDivision: 'Humas',
            status: 'APPROVED',
            note: 'Dokumentasi dan draf rilis sudah sesuai SOP humas lembaga.',
            respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
          },
          {
            id: 'mock-appr-104',
            approverMockId: 'mock-approver-5',
            approverName: 'Fajar Nugraha',
            approverDivision: 'IT',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  // Skenario 3: Resmi Diterbitkan / Konsensus Penuh (2/2 Disetujui)
  await prisma.report.create({
    data: {
      id: 'mock-rep-003',
      title: 'Laporan Susulan: Rekonsiliasi Bank & Verifikasi Mutasi Donasi Online',
      content:
        'Menyelesaikan rekonsiliasi penerimaan donasi melalui payment gateway dan transfer rekening virtual akun perbankan periode pekan berjalan. Memastikan seluruh bukti setor terverifikasi klop dengan mutasi rekening koran.',
      division: 'Keuangan',
      attachments: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop',
      ],
      status: 'PUBLISHED',
      isClockIn: true,
      authorId: userMap['hendra'].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 hari lalu
      approvals: {
        create: [
          {
            id: 'mock-appr-105',
            approverMockId: 'mock-approver-2',
            approverName: 'Dedi Kurniawan',
            approverDivision: 'Keuangan',
            status: 'APPROVED',
            note: 'Mutasi dan rekening koran sudah klop 100%.',
            respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
          },
          {
            id: 'mock-appr-106',
            approverMockId: 'mock-approver-6',
            approverName: 'Ustadz H. Ahmad',
            approverDivision: 'Pusat',
            status: 'APPROVED',
            note: 'Disetujui. Akuntabilitas keuangan terjaga baik.',
            respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
          },
        ],
      },
    },
  });

  // Skenario 4: Pengajuan Ditolak (REJECTED)
  await prisma.report.create({
    data: {
      id: 'mock-rep-004',
      title: 'Laporan Susulan: Pengarsipan Berkas Legalitas Amil & Mitra',
      content:
        'Menginput perpanjangan berkas MoU kemitraan lembaga ke database internal sekretariat dan merapikan arsip fisik dokumen SK amil tahun berjalan.',
      division: 'Sekretariat',
      attachments: [],
      status: 'REJECTED',
      isClockIn: true,
      authorId: userMap['dewi'].id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 jam lalu
      approvals: {
        create: [
          {
            id: 'mock-appr-107',
            approverMockId: 'mock-approver-4',
            approverName: 'Ridwan Fauzi',
            approverDivision: 'Sekretariat',
            status: 'REJECTED',
            note: 'Bukti kehadiran dan tanggal tugas tidak sesuai dengan catatan absensi lapangan.',
            respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
          {
            id: 'mock-appr-108',
            approverMockId: 'mock-approver-1',
            approverName: 'Siti Rahma',
            approverDivision: 'Program',
            status: 'PENDING',
          },
        ],
      },
    },
  });

  console.log('Clock-in mock reports seeded successfully into database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
