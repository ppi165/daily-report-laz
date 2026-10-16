"use server";

import { getDivisionsUseCase } from '../use-cases/get-divisions.use-case';

export async function getDivisionsAction() {
  try {
    const data = await getDivisionsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memuat divisi.',
      data: [],
    };
  }
}
