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
}

export const dashboardRepository = new DashboardRepository();
