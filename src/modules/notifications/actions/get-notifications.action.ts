"use server";

import { cookies } from "next/headers";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { getUserNotificationsUseCase } from "../use-cases/get-user-notifications.use-case";
import { checkDailyReminderUseCase } from "../use-cases/check-daily-reminder.use-case";

export async function getNotificationsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await getCurrentUserUseCase.execute(token);

    if (!user) {
      return { success: false, data: { notifications: [], unreadCount: 0 } };
    }

    // Pengecekan otomatis pengingat batas laporan (terintegrasi dalam satu action)
    await checkDailyReminderUseCase.execute(user.id).catch(() => {});

    const result = await getUserNotificationsUseCase.execute(user.id);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat notifikasi",
      data: { notifications: [], unreadCount: 0 },
    };
  }
}
