"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { getMentionUsersUseCase } from "../use-cases/get-mention-users.use-case";

export async function getMentionUsersAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized: Sesi tidak ditemukan", data: [] };
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return { success: false, message: "Unauthorized: Sesi tidak valid", data: [] };
    }

    const users = await getMentionUsersUseCase.execute();

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil daftar pengguna",
      data: [],
    };
  }
}
