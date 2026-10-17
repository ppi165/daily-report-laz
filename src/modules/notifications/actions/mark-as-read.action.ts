"use server";

import { cookies } from "next/headers";
import { getCurrentUserUseCase } from "@/src/modules/users/use-cases/get-current-user.use-case";
import { markNotificationReadUseCase } from "../use-cases/mark-notification-read.use-case";
import { MarkAsReadInput } from "../schemas/notification.schema";

export async function markNotificationAsReadAction(input: MarkAsReadInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await getCurrentUserUseCase.execute(token);

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await markNotificationReadUseCase.execute(input, user.id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui status notifikasi",
    };
  }
}
