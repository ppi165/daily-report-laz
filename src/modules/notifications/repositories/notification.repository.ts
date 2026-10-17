import { prisma } from "@/src/infrastructure/prisma";
import { Prisma } from "@prisma/client";

export class NotificationRepository {
  async findByUserId(userId: string, limit = 40) {
    return prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: { id: true, name: true, avatar: true, division: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async findAppreciationNotification(userId: string, reportId: string) {
    return prisma.notification.findFirst({
      where: {
        userId,
        reportId,
        type: "APPRECIATION",
      },
    });
  }

  async findExistingReminderToday(userId: string, startOfDay: Date) {
    return prisma.notification.findFirst({
      where: {
        userId,
        type: "REMINDER",
        createdAt: { gte: startOfDay },
      },
    });
  }

  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string | null;
    reportId?: string | null;
    actorId?: string | null;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        reportId: data.reportId,
        actorId: data.actorId,
        metadata: data.metadata,
      },
    });
  }

  async update(
    id: string,
    data: {
      message?: string;
      link?: string | null;
      actorId?: string | null;
      isRead?: boolean;
      readAt?: Date | null;
      metadata?: Prisma.InputJsonValue;
      updatedAt?: Date;
    }
  ) {
    return prisma.notification.update({
      where: { id },
      data,
    });
  }

  async createMany(
    notifications: Array<{
      userId: string;
      type: string;
      title: string;
      message: string;
      link?: string | null;
      reportId?: string | null;
      actorId?: string | null;
      metadata?: Prisma.InputJsonValue;
    }>
  ) {
    if (notifications.length === 0) return { count: 0 };
    return prisma.notification.createMany({
      data: notifications,
    });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  }

  async deleteByCommentId(commentId: string) {
    return prisma.notification.deleteMany({
      where: {
        metadata: {
          path: ["commentId"],
          equals: commentId,
        },
      },
    });
  }

  async deleteIfRead(id: string, userId: string) {
    return prisma.notification.deleteMany({
      where: {
        id,
        userId,
        isRead: true, // Proteksi: Hanya bisa dihapus jika sudah dibaca
      },
    });
  }

  async clearAllRead(userId: string) {
    return prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true, // Proteksi: Hanya notifikasi yang sudah dibaca yang dibersihkan
      },
    });
  }

  async deleteReminderForReportSubmitted(userId: string, startOfDay: Date) {
    return prisma.notification.deleteMany({
      where: {
        userId,
        type: "REMINDER",
        createdAt: { gte: startOfDay },
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
