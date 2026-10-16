import { prisma } from '@/src/infrastructure/prisma';

export class AuthRepository {
  async findUserByIdentifier(identifier: string) {
    const clean = identifier.trim();
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: clean, mode: 'insensitive' } },
          { email: { equals: clean, mode: 'insensitive' } },
        ],
      },
    });
  }
}

export const authRepository = new AuthRepository();
