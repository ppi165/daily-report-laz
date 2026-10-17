import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('=================================================================');
  console.log('   RESET TOTAL DATABASE: BERSIH SEPERTI APLIKASI BARU FRESH DEPLOY');
  console.log('=================================================================');

  // 1. Hapus semua data transaksi
  const deletedApprovals = await prisma.reportApproval.deleteMany({});
  const deletedComments = await prisma.reportComment.deleteMany({});
  const deletedLikes = await prisma.reportAppreciation.deleteMany({});
  const deletedReports = await prisma.report.deleteMany({});

  console.log(`[✔] Dihapus ${deletedApprovals.count} data riwayat verifikasi clock-in.`);
  console.log(`[✔] Dihapus ${deletedComments.count} komentar feed.`);
  console.log(`[✔] Dihapus ${deletedLikes.count} like/apresiasi feed.`);
  console.log(`[✔] Dihapus ${deletedReports.count} laporan amil.`);

  // 2. Hapus semua jadwal kerja khusus (Special Schedules)
  const deletedSchedules = await prisma.specialSchedule.deleteMany({});
  console.log(`[✔] Dihapus ${deletedSchedules.count} jadwal khusus / event.`);

  // 3. Hapus semua divisi/bidang (Division)
  const deletedDivisions = await prisma.division.deleteMany({});
  console.log(`[✔] Dihapus ${deletedDivisions.count} master divisi/bidang.`);

  // 4. Reset pengaturan sistem ke default
  await prisma.systemSetting.deleteMany({});
  await prisma.systemSetting.create({
    data: {
      id: 'default',
      dailyDeadlineTime: '17:00',
      reminderTime: '16:00',
      clockInMaxDays: 3,
      clockInRequiredWitness: 2,
      clockInRequireReason: true,
      workDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      isRamadhanMode: false,
      ramadhanDeadlineTime: '15:30',
      requirePhoto: false,
      feedVisibility: 'ALL',
      scheduleRetentionType: 'MONTH',
      scheduleRetentionValue: 3,
    },
  });
  console.log(`[✔] Pengaturan sistem di-reset ke nilai standar operasional.`);

  // 5. Hapus semua pengguna selain SUPERADMIN
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      role: {
        not: 'SUPERADMIN',
      },
    },
  });
  console.log(`[✔] Dihapus ${deletedUsers.count} akun pengguna pengujian.`);

  // 6. Pastikan hanya ada 1 akun SUPERADMIN murni
  const superadminPassword = await bcrypt.hash('superadmin123', 10);
  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {
      name: 'Superadmin LAZ Persis',
      email: 'superadmin@lazpersis.or.id',
      role: 'SUPERADMIN',
      division: 'Pusat',
      position: 'System Administrator (Root)',
      password: superadminPassword,
      avatar: null,
    },
    create: {
      username: 'superadmin',
      email: 'superadmin@lazpersis.or.id',
      password: superadminPassword,
      name: 'Superadmin LAZ Persis',
      division: 'Pusat',
      role: 'SUPERADMIN',
      position: 'System Administrator (Root)',
      avatar: null,
    },
  });

  console.log(`[✔] Akun Utama SUPERADMIN siap digunakan (ID: ${superadmin.id}, Username: superadmin).`);

  // 7. Status akhir database
  const userCount = await prisma.user.count();
  const divisionCount = await prisma.division.count();
  const reportCount = await prisma.report.count();
  const scheduleCount = await prisma.specialSchedule.count();

  console.log('-----------------------------------------------------------------');
  console.log(`[ℹ] Status Database Bersih Total:`);
  console.log(`    - Pengguna: ${userCount} (Hanya Superadmin)`);
  console.log(`    - Divisi: ${divisionCount} (Kosong, buat dari menu Kelola Divisi)`);
  console.log(`    - Jadwal Khusus: ${scheduleCount} (Kosong)`);
  console.log(`    - Laporan: ${reportCount} (Kosong)`);
  console.log('=================================================================');
  console.log('   SIAP DIGUNAKAN SEPERTI INSTALASI BARU RESMI LAZ PERSIS');
  console.log('=================================================================');
}

main()
  .catch((e) => {
    console.error('Error saat pembersihan total:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
