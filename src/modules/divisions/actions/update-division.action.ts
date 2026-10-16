"use server";

import { updateDivisionUseCase } from '../use-cases/update-division.use-case';
import { UpdateDivisionInput } from '../schemas/update-division.schema';

export async function updateDivisionAction(input: UpdateDivisionInput) {
  try {
    const division = await updateDivisionUseCase.execute(input);
    return {
      success: true,
      message: `Bidang "${division.name}" berhasil diperbarui.`,
      data: division,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memperbarui bidang.',
    };
  }
}
