import { prisma } from "@/src/infrastructure/prisma";

export class FeedRepository {
  async getFeedReports(options?: {
    cursor?: string;
    limit?: number;
    division?: string;
    search?: string;
  }) {
    const limit = options?.limit ?? 10;
    const cursor = options?.cursor;
    const division = options?.division;
    const search = options?.search;
    const take = limit + 1;

    const reports = await prisma.report.findMany({
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
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
          take: 10, // Capping initial comments untuk kecepatan transfer data
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
        _count: {
          select: {
            likes: true,
            comments: true,
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

    let nextCursor: string | null = null;
    let paginatedReports = reports;

    if (reports.length > limit) {
      const nextItem = reports[limit];
      nextCursor = nextItem.id;
      paginatedReports = reports.slice(0, limit);
    }

    return {
      reports: paginatedReports,
      nextCursor,
    };
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

  async addAppreciation(reportId: string, userId: string): Promise<number> {
    return prisma.$transaction(async (tx) => {
      // 1. Upsert record like agar idempotent & bebas error constraint
      await tx.reportAppreciation.upsert({
        where: {
          reportId_userId: {
            reportId,
            userId,
          },
        },
        create: {
          reportId,
          userId,
        },
        update: {},
      });

      // 2. Hitung jumlah like riil di database
      const totalCount = await tx.reportAppreciation.count({
        where: { reportId },
      });

      // 3. Sinkronisasi kolom Report.appreciations
      await tx.report.update({
        where: { id: reportId },
        data: {
          appreciations: totalCount,
        },
      });

      return totalCount;
    });
  }

  async removeAppreciation(reportId: string, userId: string): Promise<number> {
    return prisma.$transaction(async (tx) => {
      // 1. Hapus jika ada
      try {
        await tx.reportAppreciation.delete({
          where: {
            reportId_userId: {
              reportId,
              userId,
            },
          },
        });
      } catch {
        // Abaikan jika sudah tidak ada
      }

      // 2. Hitung jumlah like riil di database
      const totalCount = await tx.reportAppreciation.count({
        where: { reportId },
      });

      // 3. Sinkronisasi kolom Report.appreciations (tidak akan pernah negatif)
      const nonNegativeCount = Math.max(0, totalCount);
      await tx.report.update({
        where: { id: reportId },
        data: {
          appreciations: nonNegativeCount,
        },
      });

      return nonNegativeCount;
    });
  }

  async countAppreciations(reportId: string) {
    return prisma.reportAppreciation.count({
      where: { reportId },
    });
  }

  async findLatestAppreciation(reportId: string) {
    return prisma.reportAppreciation.findFirst({
      where: { reportId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findSecondAppreciation(reportId: string, excludeUserId: string) {
    return prisma.reportAppreciation.findFirst({
      where: {
        reportId,
        userId: { not: excludeUserId },
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
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
