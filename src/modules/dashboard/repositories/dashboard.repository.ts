import { prisma } from '@/src/infrastructure/prisma';

export class DashboardRepository {
  async countTotalReports() {
    return prisma.report.count();
  }

  async countActiveUsers() {
    return prisma.user.count({
      where: { reports: { some: {} } },
    });
  }

  async countTotalUsers() {
    return prisma.user.count();
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

  async findRecentReportsByUserId(userId: string, limit = 5) {
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findTeamFeeds(limit = 10) {
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
