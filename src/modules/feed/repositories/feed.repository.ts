import { prisma } from "@/src/infrastructure/prisma";

export class FeedRepository {
  async getFeedReports(division?: string, search?: string) {
    return prisma.report.findMany({
      where: {
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
              },
            },
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

  async createComment(reportId: string, userId: string, content: string) {
    return prisma.reportComment.create({
      data: {
        reportId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            division: true,
            role: true,
            position: true,
          },
        },
      },
    });
  }
}

export const feedRepository = new FeedRepository();
