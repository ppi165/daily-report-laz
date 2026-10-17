"use server";

import { cookies } from "next/headers";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { markAllNotificationsReadUseCase } from "../use-cases/mark-all-notifications-read.use-case";

export async function markAllNotificationsAsReadAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await getCurrentUserUseCase.execute(token);

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await markAllNotificationsReadUseCase.execute(user.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gagal menandai semua notifikasi telah dibaca",
    };
  }
}
