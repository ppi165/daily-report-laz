import { prisma } from "@/src/infrastructure/prisma";

export class FeedRepository {
  async getFeedReports(division?: string, search?: string) {
    return prisma.report.findMany({
      where: {
        status: "PUBLISHED",
        AND: [
          // Filter divisi jika dipilih
          division && division !== "ALL" ? { division } : {},
          // Filter pencarian teks atau nama author
          search && search.trim() !== ""
            ? {
                OR: [
                  { content: { contains: search, mode: "insensitive" } },
                  { author: { name: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {},
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            division: true,
            position: true,
            role: true,
            avatar: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                division: true,
                role: true,
                position: true,
                avatar: true,
              },
            },
          },
        },
        approvals: {
          select: {
            id: true,
            approverName: true,
            approverDivision: true,
            status: true,
            respondedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAppreciation(reportId: string, userId: string) {
    return prisma.reportAppreciation.findUnique({
      where: {
        reportId_userId: {
          reportId,
          userId,
        },
      },
    });
  }

  async addAppreciation(reportId: string, userId: string) {
    return prisma.$transaction([
      prisma.reportAppreciation.create({
        data: {
          reportId,
          userId,
        },
      }),
      prisma.report.update({
        where: { id: reportId },
        data: {
          appreciations: {
            increment: 1,
          },
        },
      }),
    ]);
  }

  async removeAppreciation(reportId: string, userId: string) {
    return prisma.$transaction([
      prisma.reportAppreciation.delete({
        where: {
          reportId_userId: {
            reportId,
            userId,
          },
        },
      }),
      prisma.report.update({
        where: { id: reportId },
        data: {
          appreciations: {
            decrement: 1,
          },
        },
      }),
    ]);
  }

  async createComment(
    reportId: string,
    userId: string,
    content: string,
    parentId?: string | null
  ) {
    return prisma.reportComment.create({
      data: {
        reportId,
        userId,
        content,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            division: true,
            role: true,
            position: true,
            avatar: true,
          },
        },
      },
    });
  }
  async findCommentById(commentId: string) {
    return prisma.reportComment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });
  }

  async updateComment(commentId: string, content: string) {
    return prisma.reportComment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            division: true,
            role: true,
            position: true,
            avatar: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string) {
    return prisma.reportComment.delete({
      where: { id: commentId },
    });
  }
}

export const feedRepository = new FeedRepository();
