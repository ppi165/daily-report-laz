import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthRepository {
  async findUserByUsernameOrEmail(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
  }
}
