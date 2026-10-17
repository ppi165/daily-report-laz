import { z } from "zod";

export const MarkAsReadSchema = z.object({
  notificationId: z.string().uuid("ID notifikasi tidak valid"),
});

export const DeleteNotificationSchema = z.object({
  notificationId: z.string().uuid("ID notifikasi tidak valid"),
});

export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;
export type DeleteNotificationInput = z.infer<typeof DeleteNotificationSchema>;
