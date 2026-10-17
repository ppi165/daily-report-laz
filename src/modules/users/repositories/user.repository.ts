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
        role: true,
        position: true,
        createdAt: true,
      },
    });
  }

  async findWithPasswordById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        password: true,
        role: true,
      },
    });
  }

  async findEligibleApprovers(excludeUserId?: string) {
    return prisma.user.findMany({
      where: {
        role: { not: 'SUPERADMIN' },
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
      select: {
        id: true,
        name: true,
        division: true,
        role: true,
        position: true,
      },
      orderBy: [
        { division: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findByIds(ids: string[]) {
    return prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        division: true,
        role: true,
        position: true,
      },
    });
  }

  async count(options?: { where?: { reports?: { some?: object } } }) {
    return prisma.user.count(options);
  }

  async updatePassword(id: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async findByUsernameOrEmail(username: string, email: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase().trim() },
          { email: email.toLowerCase().trim() },
        ],
      },
    });
  }

  async findByUsernameOrEmailExcludeId(username: string, email: string, excludeId: string) {
    return prisma.user.findFirst({
      where: {
        id: { not: excludeId },
        OR: [
          { username: username.toLowerCase().trim() },
          { email: email.toLowerCase().trim() },
        ],
      },
    });
  }

  async updateUser(
    id: string,
    data: {
      name: string;
      username: string;
      email: string;
      division: string;
      position: string;
      role: string;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        username: data.username.toLowerCase().trim(),
        email: data.email.toLowerCase().trim(),
        division: data.division,
        position: data.position,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        division: true,
        position: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async createUser(data: {
    name: string;
    username: string;
    email: string;
    division: string;
    position: string;
    role: string;
    password: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        username: data.username.toLowerCase().trim(),
        email: data.email.toLowerCase().trim(),
        division: data.division,
        position: data.position,
        role: data.role,
        password: data.password,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        division: true,
        position: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUserRoleAndPosition(id: string, role: string, position: string) {
    return prisma.user.update({
      where: { id },
      data: {
        role,
        position,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        division: true,
        position: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAllWithFilters(filters?: { division?: string; role?: string; search?: string }) {
    const where: Record<string, unknown> = {};

    if (filters?.division && filters.division !== 'ALL') {
      where.division = filters.division;
    }

    if (filters?.role && filters.role !== 'ALL') {
      where.role = filters.role;
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { position: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        division: true,
        position: true,
        role: true,
        createdAt: true,
      },
      orderBy: [
        { role: 'asc' },
        { division: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async countByRoles() {
    const [total, superadmin, admin, supervisor, staff] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SUPERADMIN' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'SUPERVISOR' } }),
      prisma.user.count({ where: { role: 'STAFF' } }),
    ]);

    return { total, superadmin, admin, supervisor, staff };
  }
}

export const userRepository = new UserRepository();
