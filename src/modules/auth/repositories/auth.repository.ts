import { prisma } from '@/src/infrastructure/prisma';

export class AuthRepository {
  async findUserByIdentifier(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
    });
  }
}

export const authRepository = new AuthRepository();
