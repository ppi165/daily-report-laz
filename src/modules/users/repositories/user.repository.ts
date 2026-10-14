import { prisma } from '@/src/infrastructure/prisma';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        division: true,
        createdAt: true,
      },
    });
  }

  async count(options?: { where?: { reports?: { some?: object } } }) {
    return prisma.user.count(options);
  }
}

export const userRepository = new UserRepository();
