import { prisma } from '@/src/infrastructure/prisma';

export class DeleteUserRepository {
  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        division: true,
      },
    });
  }

  async countSuperadmins() {
    return prisma.user.count({
      where: { role: 'SUPERADMIN' },
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });
  }
}

export const deleteUserRepository = new DeleteUserRepository();
