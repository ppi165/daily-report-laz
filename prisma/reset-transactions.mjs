import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- PERSIAPAN GO-LIVE: Mengosongkan Data Transaksi Pelaporan ---');
  
  // Hapus semua data transaksi
  const deletedNotifications = await prisma.notification.deleteMany({});
  const deletedApprovals = await prisma.reportApproval.deleteMany({});
  const deletedComments = await prisma.reportComment.deleteMany({});
  const deletedLikes = await prisma.reportAppreciation.deleteMany({});
  const deletedReports = await prisma.report.deleteMany({});

  console.log(`✔ Dihapus ${deletedNotifications.count} data notifikasi.`);
  console.log(`✔ Dihapus ${deletedApprovals.count} data verifikasi saksi.`);
  console.log(`✔ Dihapus ${deletedComments.count} komentar feed.`);
  console.log(`✔ Dihapus ${deletedLikes.count} like/apresiasi.`);
  console.log(`✔ Dihapus ${deletedReports.count} laporan amil.`);
  
  const userCount = await prisma.user.count();
  const divisionCount = await prisma.division.count();

  console.log(`ℹ Master data tetap utuh: ${userCount} Pengguna Amil & ${divisionCount} Divisi.`);
  console.log('--- DATABASE BERSIH & SIAP DIGUNAKAN UNTUK PRODUKSI RESMI ---');
}

main()
  .catch((e) => {
    console.error('Error saat reset data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
