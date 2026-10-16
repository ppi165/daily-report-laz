import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with 4 RBAC Roles and Divisions...');

  // 1. Seed Default Divisions
  const defaultDivisions = [
    { name: 'Pusat', description: 'Direksi dan Pimpinan Pusat Lembaga', leaderName: 'Ustadz H. Ahmad' },
    { name: 'Humas', description: 'Publikasi Media, Dokumentasi, & Kehumasan', leaderName: 'Nabila Putri' },
    { name: 'Program', description: 'Penyaluran Zakat, Infaq, & Program Sosial', leaderName: 'Siti Rahma' },
    { name: 'Keuangan', description: 'Akuntansi, Anggaran, & Audit Zakat', leaderName: 'Dedi Kurniawan' },
    { name: 'Sekretariat', description: 'Tata Kelola Administrasi & Arsip Amil', leaderName: 'Ridwan Fauzi' },
    { name: 'SDM', description: 'Pengembangan Amil & Keorganisasian', leaderName: 'Ahmad Fauzan' },
    { name: 'IT', description: 'Teknologi Informasi & Transformasi Digital', leaderName: 'Fajar Nugraha' },
    { name: 'Marketing', description: 'Fundraising, Kemitraan Muzakki, & CRM', leaderName: 'Ilham Saputra' },
    { name: 'Administrasi', description: 'Operasional Logistik & Fasilitas Kantor', leaderName: 'Dewi Lestari' },
  ];

  for (const div of defaultDivisions) {
    await prisma.division.upsert({
      where: { name: div.name },
      update: { description: div.description, leaderName: div.leaderName },
      create: div,
    });
  }
  console.log('Default divisions seeded successfully.');

  // 2. Seed 4 Primary Accounts with distinct RBAC Roles
  const primaryAccounts = [
    {
      username: 'superadmin',
      email: 'superadmin@lazpersis.or.id',
      plainPassword: 'superadmin123',
      name: 'Admin Aplikasi',
      division: 'IT',
      role: 'SUPERADMIN',
      position: 'System Administrator (Root)',
    },
    {
      username: 'admin',
      email: 'admin@lazpersis.or.id',
      plainPassword: 'admin123',
      name: 'Ustadz H. Ahmad',
      division: 'Pusat',
      role: 'ADMIN',
      position: 'Pimpinan Pusat',
    },
    {
      username: 'supervisor',
      email: 'supervisor@lazpersis.or.id',
      plainPassword: 'supervisor123',
      name: 'Dedi Kurniawan',
      division: 'Program',
      role: 'SUPERVISOR',
      position: 'Koordinator Program',
    },
    {
      username: 'staff',
      email: 'staff@lazpersis.or.id',
      plainPassword: 'staff123',
      name: 'Siti Rahma',
      division: 'Humas',
      role: 'STAFF',
      position: 'Staf Humas & Media',
    },
  ];

  for (const acc of primaryAccounts) {
    const hashedPassword = await bcrypt.hash(acc.plainPassword, 10);
    await prisma.user.upsert({
      where: { username: acc.username },
      update: {
        email: acc.email,
        name: acc.name,
        division: acc.division,
        role: acc.role,
        position: acc.position,
        password: hashedPassword,
      },
      create: {
        username: acc.username,
        email: acc.email,
        name: acc.name,
        division: acc.division,
        role: acc.role,
        position: acc.position,
        password: hashedPassword,
      },
    });
    console.log(`User [${acc.role}] ${acc.name} (${acc.username}) seeded successfully.`);
  }

  // 3. Seed Default System Setting
  await prisma.systemSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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
  console.log('Default system setting seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
