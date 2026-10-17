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
        avatar: true,
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
        avatar: true,
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
        avatar: true,
      },
    });
  }

  async findMentionUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        division: true,
        role: true,
        avatar: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findPeersByDivision(division: string, excludeUserId: string) {
    return prisma.user.findMany({
      where: {
        division: { equals: division, mode: "insensitive" },
        id: { not: excludeUserId },
      },
      select: { id: true },
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

  async updateAvatar(id: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
      },
    });
  }

  async updateName(id: string, name: string) {
    return prisma.user.update({
      where: { id },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
      },
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
        avatar: true,
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

  async getUserPerformance(userId: string) {
    const [totalReports, onTimeReports, relationalLikes, legacyLikes] = await Promise.all([
      prisma.report.count({
        where: { authorId: userId },
      }),
      prisma.report.count({
        where: { authorId: userId, isLate: false },
      }),
      prisma.reportAppreciation.count({
        where: {
          report: { authorId: userId },
          userId: { not: userId },
        },
      }),
      prisma.report.aggregate({
        where: { authorId: userId },
        _sum: { appreciations: true },
      }),
    ]);

    const totalAppreciations = Math.max(relationalLikes, legacyLikes._sum.appreciations || 0);

    const disciplineRate = totalReports > 0 ? Math.round((onTimeReports / totalReports) * 100) : 100;

    const recentReports = await prisma.report.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        content: true,
        division: true,
        status: true,
        isLate: true,
        attachments: true,
        createdAt: true,
        appreciations: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    const formattedRecentReports = recentReports.map((r) => ({
      id: r.id,
      content: r.content,
      division: r.division,
      status: r.status,
      isLate: r.isLate,
      attachmentsCount: r.attachments?.length || 0,
      createdAt: r.createdAt.toISOString(),
      appreciations: Math.max(r.appreciations, r._count.likes),
    }));

    return {
      totalReports,
      disciplineRate,
      totalAppreciations,
      recentReports: formattedRecentReports,
    };
  }

  async createRoleAuditLog(data: {
    targetId: string;
    oldRole: string;
    newRole: string;
    actionType?: string;
    reason: string;
    actorId: string;
    actorName: string;
    actorRole: string;
  }) {
    return prisma.roleAuditLog.create({
      data: {
        targetId: data.targetId,
        oldRole: data.oldRole,
        newRole: data.newRole,
        actionType: data.actionType || "DEMOTION",
        reason: data.reason.trim(),
        actorId: data.actorId,
        actorName: data.actorName,
        actorRole: data.actorRole,
      },
    });
  }
}

export const userRepository = new UserRepository();
