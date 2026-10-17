import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('=================================================================');
  console.log('   PERSIAPAN TESTING / GO-LIVE: RESET BERSIH MENYISAKAN SUPERADMIN');
  console.log('=================================================================');

  // 1. Hapus seluruh data transaksi
  const deletedApprovals = await prisma.reportApproval.deleteMany({});
  const deletedComments = await prisma.reportComment.deleteMany({});
  const deletedLikes = await prisma.reportAppreciation.deleteMany({});
  const deletedReports = await prisma.report.deleteMany({});

  console.log(`[✔] Dihapus ${deletedApprovals.count} data riwayat verifikasi clock-in.`);
  console.log(`[✔] Dihapus ${deletedComments.count} komentar feed.`);
  console.log(`[✔] Dihapus ${deletedLikes.count} like/apresiasi feed.`);
  console.log(`[✔] Dihapus ${deletedReports.count} laporan amil.`);

  // 2. Hapus seluruh user dummy/staf pengujian kecuali SUPERADMIN
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: {
        not: 'SUPERADMIN',
      },
    },
  });
  console.log(`[✔] Dihapus ${deletedUsers.count} akun pengguna pengujian (Admin, Supervisor, Staf).`);

  // 3. Pastikan akun SUPERADMIN tetap ada & aktif
  const superadminPassword = await bcrypt.hash('superadmin123', 10);
  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {
      role: 'SUPERADMIN',
      password: superadminPassword,
    },
    create: {
      username: 'superadmin',
      email: 'superadmin@lazpersis.or.id',
      password: superadminPassword,
      name: 'Superadmin LAZ Persis',
      division: 'IT',
      role: 'SUPERADMIN',
      position: 'System Administrator (Root)',
    },
  });
  console.log(`[✔] Akun Utama SUPERADMIN terverifikasi aktif (ID: ${superadmin.id}, Username: ${superadmin.username}).`);

  // 4. Verifikasi data master tetap aman
  const remainingUsers = await prisma.user.count();
  const divisionCount = await prisma.division.count();
  const settingCount = await prisma.systemSetting.count();

  console.log('-----------------------------------------------------------------');
  console.log(`[ℹ] Status Database Saat Ini:`);
  console.log(`    - Total Pengguna: ${remainingUsers} (Hanya Superadmin)`);
  console.log(`    - Master Divisi: ${divisionCount} Bidang`);
  console.log(`    - Pengaturan Sistem: ${settingCount} Aturan`);
  console.log('=================================================================');
  console.log('   DATABASE BERSIH & SIAP UNTUK SIMULASI PENGUJIAN SKENARIO NYATA');
  console.log('=================================================================');
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat pembersihan database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
