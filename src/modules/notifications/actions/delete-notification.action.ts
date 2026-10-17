"use server";

import { cookies } from "next/headers";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { deleteNotificationUseCase } from "../use-cases/delete-notification.use-case";
import { DeleteNotificationInput } from "../schemas/notification.schema";

export async function deleteNotificationAction(input: DeleteNotificationInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await getCurrentUserUseCase.execute(token);

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const result = await deleteNotificationUseCase.execute(input, user.id);
    return { success: true, deleted: result.deleted };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus notifikasi",
    };
  }
}
