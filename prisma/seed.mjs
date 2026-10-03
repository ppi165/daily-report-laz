import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Periksa apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' }
  });
  
  if (existingAdmin) {
    console.log('Admin user already exists!');
    return;
  }
  
  // Buat password yang dihash
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Buat admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lazpersis.or.id',
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      division: 'Pusat'
    }
  });
  
  console.log('Seeding finished. Admin created:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
