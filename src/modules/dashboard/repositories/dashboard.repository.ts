import { prisma } from '@/src/infrastructure/prisma';

export class DashboardRepository {
  async countTotalReports() {
    return prisma.report.count();
  }

  async countActiveUsersToday() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return prisma.user.count({
      where: {
        reports: {
          some: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: { in: ['PUBLISHED', 'PENDING_APPROVAL'] },
          },
        },
      },
    });
  }

  async countActiveUsers() {
    return this.countActiveUsersToday();
  }

  async countTotalUsers() {
    return prisma.user.count();
  }

  async countUserMonthlyReports(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return prisma.report.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  }

  async findTodayReportByUserId(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return prisma.report.findFirst({
      where: {
        authorId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        division: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findRecentReportsByUserId(userId: string, limit = 3) {
    return prisma.report.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        status: true,
        appreciations: true,
        attachments: true,
        division: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findTeamFeeds(limit = 3) {
    return prisma.report.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
            division: true,
            role: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
