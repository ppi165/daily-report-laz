"use server";

import { deleteDivisionUseCase } from '../use-cases/delete-division.use-case';

export async function deleteDivisionAction(id: string) {
  try {
    await deleteDivisionUseCase.execute(id);
    return {
      success: true,
      message: 'Bidang berhasil dihapus.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menghapus bidang.',
    };
  }
}
