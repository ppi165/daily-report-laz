import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Selalu simpan instance ke globalThis baik di dev maupun production
// untuk mencegah re-instansiasi berulang pada dynamic/serverless runtime
globalForPrisma.prisma = prisma;

export default prisma;
