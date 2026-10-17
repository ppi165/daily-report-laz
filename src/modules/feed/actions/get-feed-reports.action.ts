"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { getFeedReportsUseCase } from "../use-cases/get-feed-reports.use-case";

export async function getFeedReportsAction(
  optionsOrDivision?:
    | { cursor?: string; limit?: number; division?: string; search?: string }
    | string,
  legacySearch?: string
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized: Sesi tidak ditemukan",
        data: { reports: [], nextCursor: null },
      };
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return {
        success: false,
        message: "Unauthorized: Sesi tidak valid",
        data: { reports: [], nextCursor: null },
      };
    }

    const opts =
      typeof optionsOrDivision === "object" && optionsOrDivision !== null
        ? optionsOrDivision
        : {
            division: optionsOrDivision,
            search: legacySearch,
          };

    const result = await getFeedReportsUseCase.execute(
      decoded.userId as string,
      opts
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat feed laporan",
      data: { reports: [], nextCursor: null },
    };
  }
}
