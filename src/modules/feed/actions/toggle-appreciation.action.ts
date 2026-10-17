"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { ToggleAppreciationSchema, ToggleAppreciationInput } from "../schemas/toggle-appreciation.schema";
import { toggleAppreciationUseCase } from "../use-cases/toggle-appreciation.use-case";

export async function toggleAppreciationAction(input: ToggleAppreciationInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized: Sesi tidak ditemukan" };
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return { success: false, message: "Unauthorized: Sesi tidak valid" };
    }

    const validated = ToggleAppreciationSchema.parse(input);
    const result = await toggleAppreciationUseCase.execute(validated, decoded.userId as string);

    return {
      success: true,
      liked: result.liked,
      likesCount: result.likesCount,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memproses apresiasi",
    };
  }
}
