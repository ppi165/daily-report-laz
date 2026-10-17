"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { UpdateCommentSchema, UpdateCommentInput } from "../schemas/update-comment.schema";
import { updateCommentUseCase } from "../use-cases/update-comment.use-case";

export async function updateCommentAction(input: UpdateCommentInput) {
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

    const validated = UpdateCommentSchema.parse(input);
    const updated = await updateCommentUseCase.execute(validated, decoded.userId as string);

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui komentar",
    };
  }
}
