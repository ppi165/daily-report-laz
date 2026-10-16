"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { getFeedReportsUseCase } from "../use-cases/get-feed-reports.use-case";

export async function getFeedReportsAction(division?: string, search?: string) {
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

    const reports = await getFeedReportsUseCase.execute(decoded.userId as string, division, search);

    return {
      success: true,
      data: reports,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat feed laporan",
      data: [],
    };
  }
}
