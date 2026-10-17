import { Prisma } from '@prisma/client';
import { prisma } from '@/src/infrastructure/prisma';

export class ReportRepository {
  async create(data: Prisma.ReportUncheckedCreateInput) {
    return prisma.report.create({ data });
  }

  async findMany(options?: Prisma.ReportFindManyArgs) {
    return prisma.report.findMany({
      ...options,
      include: {
        author: {
          select: { name: true, division: true },
        },
        approvals: {
          select: {
            id: true,
            approverName: true,
            approverDivision: true,
            status: true,
            note: true,
            isOverridden: true,
            respondedByName: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, division: true },
        },
      },
    });
  }

  async count(options?: Prisma.ReportCountArgs) {
    return prisma.report.count(options);
  }

  async update(id: string, data: Prisma.ReportUpdateInput) {
    return prisma.report.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.report.delete({ where: { id } });
  }
}

export const reportRepository = new ReportRepository();
