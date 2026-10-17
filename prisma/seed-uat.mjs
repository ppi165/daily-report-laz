import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Memulai Seeding Dataset Riil UAT LAZ Persis ---');

  // 1. Password default untuk testing UAT
  const staffPassword = await bcrypt.hash('amil123', 10);
  const supervisorPassword = await bcrypt.hash('supervisor123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const superadminPassword = await bcrypt.hash('superadmin123', 10);

  // 2. Data Master Divisi Resmi
  const defaultDivisions = [
    { name: 'Pusat', description: 'Direksi dan Pimpinan Pusat Lembaga', leaderName: 'Ustadz H. Ahmad' },
    { name: 'Humas', description: 'Publikasi Media, Dokumentasi, & Kehumasan', leaderName: 'Aisyah Azzahra' },
    { name: 'Program', description: 'Penyaluran Zakat, Infaq, & Program Sosial', leaderName: 'Dedi Kurniawan' },
    { name: 'Keuangan', description: 'Akuntansi, Anggaran, & Audit Zakat', leaderName: 'Hendra Gunawan' },
    { name: 'Sekretariat', description: 'Tata Kelola Administrasi & Arsip Amil', leaderName: 'Dewi Lestari' },
    { name: 'SDM', description: 'Pengembangan Amil & Keorganisasian', leaderName: 'Ahmad Fauzan' },
    { name: 'IT', description: 'Teknologi Informasi & Transformasi Digital', leaderName: 'Fajar Nugraha' },
    { name: 'Marketing', description: 'Fundraising, Kemitraan Muzakki, & CRM', leaderName: 'Ilham Saputra' },
    { name: 'Administrasi', description: 'Operasional Logistik & Fasilitas Kantor', leaderName: 'Rina Marlina' },
    { name: 'Logistik', description: 'Pengelolaan Gudang Bantuan & Distribusi', leaderName: 'Bambang Sudrajat' },
  ];

  for (const div of defaultDivisions) {
    await prisma.division.upsert({
      where: { name: div.name },
      update: { description: div.description, leaderName: div.leaderName },
      create: div,
    });
  }
  console.log('✔ Master Divisi selesai disinkronkan.');

  // 3. Data Master Akun Amil (7 Akun Representatif)
  const usersData = [
    {
      username: 'superadmin',
      email: 'superadmin@lazpersis.or.id',
      password: superadminPassword,
      name: 'Admin Aplikasi',
      division: 'IT',
      role: 'SUPERADMIN',
      position: 'Administrator Sistem (Root)',
    },
    {
      username: 'admin',
      email: 'admin@lazpersis.or.id',
      password: adminPassword,
      name: 'Ustadz H. Ahmad',
      division: 'Pusat',
      role: 'ADMIN',
      position: 'Pimpinan Pusat Lembaga',
    },
    {
      username: 'supervisor',
      email: 'supervisor@lazpersis.or.id',
      password: supervisorPassword,
      name: 'Dedi Kurniawan',
      division: 'Program',
      role: 'SUPERVISOR',
      position: 'Koordinator Bidang Program',
    },
    {
      username: 'farhan',
      email: 'farhan@lazpersis.or.id',
      password: staffPassword,
      name: 'Muhammad Farhan',
      division: 'Program',
      role: 'STAFF',
      position: 'Staf Penyaluran & Tanggap Bencana',
    },
    {
      username: 'aisyah',
      email: 'aisyah@lazpersis.or.id',
      password: staffPassword,
      name: 'Aisyah Azzahra',
      division: 'Humas',
      role: 'STAFF',
      position: 'Staf Humas & Media Publikasi',
    },
    {
      username: 'hendra',
      email: 'hendra@lazpersis.or.id',
      password: staffPassword,
      name: 'Hendra Gunawan',
      division: 'Keuangan',
      role: 'STAFF',
      position: 'Staf Rekonsiliasi & Akuntansi',
    },
    {
      username: 'dewi',
      email: 'dewi@lazpersis.or.id',
      password: staffPassword,
      name: 'Dewi Lestari',
      division: 'Sekretariat',
      role: 'STAFF',
      position: 'Staf Administrasi & Arsip Legalitas',
    },
  ];

  const userMap = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        email: u.email,
        password: u.password,
        name: u.name,
        division: u.division,
        role: u.role,
        position: u.position,
      },
      create: u,
    });
    userMap[u.username] = user;
  }
  console.log('✔ Akun Amil untuk UAT selesai dibuat/diperbarui.');

  // 4. Pastikan SystemSetting Default Tersedia
  await prisma.systemSetting.upsert({
    where: { id: 'default-setting' },
    update: {
      dailyDeadlineTime: '17:00',
      clockInMaxDays: 3,
      clockInRequiredWitness: 2,
      requirePhoto: true,
      isRamadhanMode: false,
    },
    create: {
      id: 'default-setting',
      dailyDeadlineTime: '17:00',
      clockInMaxDays: 3,
      clockInRequiredWitness: 2,
      requirePhoto: true,
      isRamadhanMode: false,
    },
  });
  console.log('✔ Pengaturan Sistem default aktif.');

  // 5. Bersihkan Seluruh Transaksi Laporan Lama
  await prisma.reportApproval.deleteMany({});
  await prisma.reportComment.deleteMany({});
  await prisma.reportAppreciation.deleteMany({});
  await prisma.report.deleteMany({});
  console.log('✔ Laporan lama dan relasi transaksi berhasil dibersihkan.');

  // 6. Suntik 6 Laporan Realistis
  const now = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Laporan 1: Muhammad Farhan (Program - Hari ini, PUBLISHED)
  const rep1 = await prisma.report.create({
    data: {
      title: 'Penyaluran 50 Paket Sembako Lansia Dhuafa',
      content: `[PEKERJAAN]\nPenyaluran 50 paket sembako pangan dan perlengkapan higienis untuk lansia dhuafa serta keluarga prasejahtera di kawasan Dayeuhkolot, Bandung Selatan. Mengkoordinasikan titik kumpul relawan dan verifikasi langsung kartu identitas mustahik bersama ketua RW setempat.\n\n[HASIL / OUTPUT]\nSeluruh 50 paket terdistribusi 100% tepat sasaran, berita acara serah terima ditandatangani oleh aparat RT/RW, dan dokumentasi foto/video telah diserahkan ke tim media lembaga.`,
      division: 'Program',
      attachments: [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1080&auto=format&fit=crop',
      ],
      status: 'PUBLISHED',
      appreciations: 4,
      isClockIn: false,
      authorId: userMap.farhan.id,
      createdAt: now,
    },
  });

  // Laporan 2: Aisyah Azzahra (Humas - Hari ini, PUBLISHED)
  const rep2 = await prisma.report.create({
    data: {
      title: 'Peliputan Video Profil Beasiswa Tahfidz Al-Qur\'an',
      content: `[PEKERJAAN]\nPeliputan video profil dan wawancara mendalam santri penerima Program Beasiswa Tahfidz Al-Qur'an di Pesantren Persis. Menyusun naskah narasi reels, editing materi visual, serta publikasi infografis laporan bulanan zakat fitrah ke akun media sosial resmi lembaga.\n\n[HASIL / OUTPUT]\n1 video dokumenter pendek durasi 90 detik selesai dirender (1080p), naskah caption Instagram/TikTok siap tayang pukul 16.30 WIB, dan draf berita telah diunggah ke CMS portal berita lazpersis.or.id.`,
      division: 'Humas',
      attachments: [
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1080&auto=format&fit=crop',
      ],
      status: 'PUBLISHED',
      appreciations: 5,
      isClockIn: false,
      authorId: userMap.aisyah.id,
      createdAt: now,
    },
  });

  // Laporan 3: Hendra Gunawan (Keuangan - Kemarin, PUBLISHED)
  const rep3 = await prisma.report.create({
    data: {
      title: 'Rekonsiliasi Mutasi Harian Zakat & Infaq Digital',
      content: `[PEKERJAAN]\nRekonsiliasi mutasi harian rekening penerimaan zakat, infaq, dan sedekah digital (BSI, BCA Syariah, Muamalat) periode pekan berjalan. Melakukan pencocokan bukti transfer donasi muzakki dengan sistem CRM serta validasi faktur operasional kantor.\n\n[HASIL / OUTPUT]\nSeluruh selisih mutasi teridentifikasi 100% klop, jurnal penerimaan kas harian telah dibukukan ke software akuntansi, dan rekapitulasi diserahkan ke Pimpinan untuk paraf verifikasi.`,
      division: 'Keuangan',
      attachments: [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1080&auto=format&fit=crop',
      ],
      status: 'PUBLISHED',
      appreciations: 3,
      isClockIn: false,
      authorId: userMap.hendra.id,
      createdAt: yesterday,
    },
  });

  // Laporan 4: Muhammad Farhan (Program - Kemarin, Clock-in PENDING_APPROVAL)
  const rep4 = await prisma.report.create({
    data: {
      title: 'Clock-in: Distribusi Logistik Bencana Longsor',
      content: `[PEKERJAAN]\nLaporan susulan (clock-in) untuk piket darurat tanggap bencana alam tanah longsor di kawasan perkebunan. Koordinasi evakuasi lapangan, pembagian 75 selimut hangat, dan pendirian posko dapur umum darurat bersama tim relawan Sigab Persis.\n\n[HASIL / OUTPUT]\nPosko dapur umum aktif melayani 120 porsi makanan hangat bagi warga terdampak. Laporan terlambat diserahkan karena ketiadaan sinyal internet di lokasi pengungsian selama 2 hari.`,
      division: 'Program',
      attachments: [
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1080&auto=format&fit=crop',
      ],
      status: 'PENDING_APPROVAL',
      appreciations: 0,
      isClockIn: true,
      authorId: userMap.farhan.id,
      createdAt: yesterday,
    },
  });

  // Saksi verifikasi untuk rep4 (Ustadz Ahmad & Dedi Kurniawan)
  await prisma.reportApproval.createMany({
    data: [
      {
        reportId: rep4.id,
        approverId: userMap.admin.id,
        approverMockId: userMap.admin.id,
        approverName: userMap.admin.name,
        approverDivision: userMap.admin.division,
        status: 'PENDING',
      },
      {
        reportId: rep4.id,
        approverId: userMap.supervisor.id,
        approverMockId: userMap.supervisor.id,
        approverName: userMap.supervisor.name,
        approverDivision: userMap.supervisor.division,
        status: 'PENDING',
      },
    ],
  });

  // Laporan 5: Dewi Lestari (Sekretariat - 2 Hari lalu, Clock-in PENDING_APPROVAL)
  const rep5 = await prisma.report.create({
    data: {
      title: 'Clock-in: Pengarsipan Berkas Legalitas & Kemitraan',
      content: `[PEKERJAAN]\nInventarisasi dan digitalisasi dokumen MoU kemitraan strategis muzakki korporat serta perpanjangan sertifikat amil terdaftar untuk 4 kantor layanan cabang regional Jawa Barat.\n\n[HASIL / OUTPUT]\n24 dokumen fisik berhasil dipindai dalam format PDF beresolusi tinggi, diunggah ke Google Drive arsip lembaga, dan lembar disposisi legalitas telah disiapkan.`,
      division: 'Sekretariat',
      attachments: [
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1080&auto=format&fit=crop',
      ],
      status: 'PENDING_APPROVAL',
      appreciations: 0,
      isClockIn: true,
      authorId: userMap.dewi.id,
      createdAt: twoDaysAgo,
    },
  });

  await prisma.reportApproval.createMany({
    data: [
      {
        reportId: rep5.id,
        approverId: userMap.admin.id,
        approverMockId: userMap.admin.id,
        approverName: userMap.admin.name,
        approverDivision: userMap.admin.division,
        status: 'PENDING',
      },
      {
        reportId: rep5.id,
        approverId: userMap.supervisor.id,
        approverMockId: userMap.supervisor.id,
        approverName: userMap.supervisor.name,
        approverDivision: userMap.supervisor.division,
        status: 'PENDING',
      },
    ],
  });

  // Laporan 6: Admin Aplikasi (IT - Kemarin, PUBLISHED)
  await prisma.report.create({
    data: {
      title: 'Pemeliharaan Rutin Server Database & Keamanan Sistem',
      content: `[PEKERJAAN]\nMelakukan pemeliharaan rutin infrastruktur database PostgreSQL Supabase, penyesuaian index query laporan amil, audit log otentikasi login, serta backup otomatis snapshot data harian.\n\n[HASIL / OUTPUT]\nSeluruh endpoint API berjalan optimal dengan latency stabil di bawah 90ms, snapshot cadangan berhasil terenkripsi, dan sistem dalam kondisi 100% normal.`,
      division: 'IT',
      attachments: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1080&auto=format&fit=crop',
      ],
      status: 'PUBLISHED',
      appreciations: 2,
      isClockIn: false,
      authorId: userMap.superadmin.id,
      createdAt: yesterday,
    },
  });

  console.log('✔ 6 Laporan realistis beserta relasi saksi verifikasi berhasil dibuat.');

  // 7. Suntik Like (Apresiasi) pada Laporan 1 & 2
  await prisma.reportAppreciation.createMany({
    data: [
      { reportId: rep1.id, userId: userMap.admin.id },
      { reportId: rep1.id, userId: userMap.supervisor.id },
      { reportId: rep1.id, userId: userMap.aisyah.id },
      { reportId: rep1.id, userId: userMap.hendra.id },
      { reportId: rep2.id, userId: userMap.admin.id },
      { reportId: rep2.id, userId: userMap.supervisor.id },
      { reportId: rep2.id, userId: userMap.farhan.id },
      { reportId: rep2.id, userId: userMap.hendra.id },
      { reportId: rep2.id, userId: userMap.dewi.id },
    ],
  });
  console.log('✔ Apresiasi like pada laporan berhasil disuntik.');

  // 8. Suntik Threaded Comments pada Laporan 2 (Aisyah - Humas)
  const comment1 = await prisma.reportComment.create({
    data: {
      reportId: rep2.id,
      userId: userMap.supervisor.id,
      content: 'Masya Allah, liputan profil santri tahfidz ini sangat menyentuh dan informatif. Jazakallahu khair tim Humas!',
    },
  });

  // Balasan dari Aisyah (parentId: comment1.id)
  await prisma.reportComment.create({
    data: {
      reportId: rep2.id,
      userId: userMap.aisyah.id,
      parentId: comment1.id,
      content: 'Wa jazakallahu khairan Ustadz Dedi! Insya Allah teaser video versi reels siap tayang sore ini juga.',
    },
  });

  // Komentar dari Farhan
  await prisma.reportComment.create({
    data: {
      reportId: rep2.id,
      userId: userMap.farhan.id,
      content: 'Keren mba Aisyah! Nanti kalau butuh data testimoni dari wali santri di pelosok kabari tim Program ya.',
    },
  });

  console.log('✔ Komentar bertingkat (threaded comments) berhasil disuntik.');
  console.log('--- SEEDING UAT BERHASIL SELESAI ---');
}

main()
  .catch((e) => {
    console.error('Error saat seeding UAT:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
