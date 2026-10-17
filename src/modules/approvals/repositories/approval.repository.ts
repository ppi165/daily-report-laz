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
              select: { name: true, division: true, email: true, avatar: true },
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
          select: { id: true, name: true, division: true, avatar: true },
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findClockInReportsForUser(userId: string) {
    return prisma.report.findMany({
      where: {
        isClockIn: true,
        OR: [
          { authorId: userId },
          { approvals: { some: { approverId: userId } } },
        ],
      },
      include: {
        author: {
          select: { id: true, name: true, division: true, avatar: true },
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateApproval(
    id: string,
    status: string,
    note?: string,
    overrideData?: { isOverridden: boolean; respondedByName: string }
  ) {
    return prisma.reportApproval.update({
      where: { id },
      data: {
        status,
        note: note ?? null,
        respondedAt: new Date(),
        ...(overrideData
          ? {
              isOverridden: overrideData.isOverridden,
              respondedByName: overrideData.respondedByName,
            }
          : {}),
      },
    });
  }

  async updateReportStatus(reportId: string, status: string) {
    return prisma.report.update({
      where: { id: reportId },
      data: { status },
    });
  }

  async findReportById(reportId: string) {
    return prisma.report.findUnique({
      where: { id: reportId },
      include: {
        author: true,
        approvals: true,
      },
    });
  }

  async reviseReport(reportId: string, content: string, attachments?: string[]) {
    return prisma.$transaction([
      prisma.report.update({
        where: { id: reportId },
        data: {
          content,
          status: 'PENDING_APPROVAL',
          ...(attachments ? { attachments } : {}),
        },
      }),
      prisma.reportApproval.updateMany({
        where: { reportId },
        data: {
          status: 'PENDING',
          note: null,
          respondedAt: null,
          isOverridden: false,
          respondedByName: null,
        },
      }),
    ]);
  }
}

export const approvalRepository = new ApprovalRepository();
