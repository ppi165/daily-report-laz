import { prisma } from '@/src/infrastructure/prisma';

export interface CreateApprovalItem {
  approverId?: string;
  approverMockId?: string;
  approverName: string;
  approverDivision?: string;
}

export class ApprovalRepository {
  async createManyForReport(reportId: string, approvers: CreateApprovalItem[]) {
    return prisma.reportApproval.createMany({
      data: approvers.map((app) => ({
        reportId,
        approverId: app.approverId || app.approverMockId,
        approverMockId: app.approverMockId || app.approverId,
        approverName: app.approverName,
        approverDivision: app.approverDivision || '',
        status: 'PENDING',
      })),
    });
  }

  async findById(id: string) {
    return prisma.reportApproval.findUnique({
      where: { id },
      include: {
        report: {
          include: {
            author: {
              select: { name: true, division: true, email: true },
            },
            approvals: true,
          },
        },
      },
    });
  }

  async findByReportId(reportId: string) {
    return prisma.reportApproval.findMany({
      where: { reportId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllClockInReports() {
    return prisma.report.findMany({
      where: { isClockIn: true },
      include: {
        author: {
          select: { name: true, division: true },
        },
        approvals: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateApproval(id: string, status: string, note?: string) {
    return prisma.reportApproval.update({
      where: { id },
      data: {
        status,
        note: note ?? null,
        respondedAt: new Date(),
      },
    });
  }

  async updateReportStatus(reportId: string, status: string) {
    return prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
  }
}

export const approvalRepository = new ApprovalRepository();
