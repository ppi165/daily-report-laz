"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { DeleteCommentSchema, DeleteCommentInput } from "../schemas/delete-comment.schema";
import { deleteCommentUseCase } from "../use-cases/delete-comment.use-case";

export async function deleteCommentAction(input: DeleteCommentInput) {
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

    const validated = DeleteCommentSchema.parse(input);
    await deleteCommentUseCase.execute(validated, decoded.userId as string, decoded.role as string);

    return {
      success: true,
      message: "Komentar berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus komentar",
    };
  }
}
