"use server";

import { moveUserDivisionUseCase } from '../use-cases/move-user-division.use-case';
import { MoveUserDivisionInput } from '../schemas/move-user-division.schema';

export async function moveUserDivisionAction(input: MoveUserDivisionInput) {
  try {
    const updated = await moveUserDivisionUseCase.execute(input);
    return {
      success: true,
      message: `Pegawai ${updated.name} berhasil dimutasikan ke unit ${updated.division}.`,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memutasikan pegawai.',
    };
  }
}
