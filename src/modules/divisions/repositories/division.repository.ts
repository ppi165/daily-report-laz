import { prisma } from '@/src/infrastructure/prisma';
import { Prisma } from '@prisma/client';

export class DivisionRepository {
  async findAllWithMemberCount() {
    const divisions = await prisma.division.findMany({
      orderBy: { name: 'asc' },
    });

    const userCounts = await prisma.user.groupBy({
      by: ['division'],
      _count: {
        _all: true,
      },
    });

    const countMap = new Map<string, number>();
    for (const uc of userCounts) {
      countMap.set(uc.division, uc._count._all);
    }

    return divisions.map((div) => ({
      ...div,
      memberCount: countMap.get(div.name) || 0,
    }));
  }

  async findByName(name: string) {
    return prisma.division.findUnique({
      where: { name },
    });
  }

  async findById(id: string) {
    return prisma.division.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.DivisionCreateInput) {
    return prisma.division.create({ data });
  }

  async update(id: string, data: Prisma.DivisionUpdateInput) {
    return prisma.division.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.division.delete({
      where: { id },
    });
  }

  async countUsersInDivision(divisionName: string) {
    return prisma.user.count({
      where: { division: divisionName },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        division: true,
        role: true,
        position: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async updateUserDivision(userId: string, newDivision: string, newPosition?: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        division: newDivision,
        ...(newPosition ? { position: newPosition } : {}),
      },
    });
  }
}

export const divisionRepository = new DivisionRepository();
