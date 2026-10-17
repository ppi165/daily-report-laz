import { notificationRepository } from "../repositories/notification.repository";
import { DeleteNotificationInput, DeleteNotificationSchema } from "../schemas/notification.schema";

export class DeleteNotificationUseCase {
  async execute(input: DeleteNotificationInput, userId: string) {
    const validated = DeleteNotificationSchema.parse(input);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await notificationRepository.deleteIfRead(validated.notificationId, userId);
    return {
      success: true,
      deleted: result.count > 0,
    };
  }
}

export const deleteNotificationUseCase = new DeleteNotificationUseCase();
