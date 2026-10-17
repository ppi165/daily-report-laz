"use server";

import { cookies } from "next/headers";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { clearReadNotificationsUseCase } from "../use-cases/clear-read-notifications.use-case";

export async function clearReadNotificationsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await getCurrentUserUseCase.execute(token);

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const result = await clearReadNotificationsUseCase.execute(user.id);
    return { success: true, count: result.deletedCount };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membersihkan notifikasi",
    };
  }
}
