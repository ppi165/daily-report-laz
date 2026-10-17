"use server";

import { cookies } from "next/headers";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { checkDailyReminderUseCase } from "../use-cases/check-daily-reminder.use-case";

export async function checkReminderAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await getCurrentUserUseCase.execute(token);

    if (!user) {
      return { success: false, reminded: false };
    }

    const result = await checkDailyReminderUseCase.execute(user.id);
    return { success: true, ...result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengecek jadwal pengingat",
    };
  }
}
