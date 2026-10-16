"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { AddCommentSchema, AddCommentInput } from "../schemas/add-comment.schema";
import { addCommentUseCase } from "../use-cases/add-comment.use-case";

export async function addCommentAction(input: AddCommentInput) {
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

    const validated = AddCommentSchema.parse(input);
    const comment = await addCommentUseCase.execute(validated, decoded.userId as string);

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menambahkan komentar",
    };
  }
}
