import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Periksa apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' }
  });
  
  // Update atau buat admin user
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@lazpersis.or.id',
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        division: 'Pusat',
        role: 'ADMIN',
        position: 'Super Admin',
      }
    });
    console.log('Admin user created.');
  } else {
    await prisma.user.update({
      where: { username: 'admin' },
      data: {
        role: 'ADMIN',
        position: 'Super Admin',
      }
    });
    console.log('Admin user updated with ADMIN role.');
  }

  // Seed default divisions
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
