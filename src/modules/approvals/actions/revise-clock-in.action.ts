"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/src/infrastructure/auth";
import { ReviseClockInSchema, ReviseClockInInput } from "../schemas/revise-clock-in.schema";
import { reviseClockInUseCase } from "../use-cases/revise-clock-in.use-case";

export async function reviseClockInAction(input: ReviseClockInInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "Sesi login tidak ditemukan. Silakan login kembali." };
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return { success: false, message: "Sesi tidak valid." };
    }

    const validated = ReviseClockInSchema.parse(input);
    const result = await reviseClockInUseCase.execute(validated, decoded.userId as string);

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal merevisi laporan clock-in.",
    };
  }
}
