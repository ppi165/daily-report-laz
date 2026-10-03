import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  async getDashboardStats() {
    try {
      const totalReports = await prisma.report.count();
      const activeUsers = await prisma.user.count({
        where: { reports: { some: {} } }
      });
      const totalUsers = await prisma.user.count();

      return {
        success: true,
        data: {
          totalReports,
          activeUsers,
          totalUsers,
          completionRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        }
      };
    } catch (error: any) {
      return { success: false, message: 'Gagal mengambil statistik', error: error.message };
    }
  }
}
