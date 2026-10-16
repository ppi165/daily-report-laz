"use server";

import { createDivisionUseCase } from '../use-cases/create-division.use-case';
import { CreateDivisionInput } from '../schemas/create-division.schema';

export async function createDivisionAction(input: CreateDivisionInput) {
  try {
    const division = await createDivisionUseCase.execute(input);
    return {
      success: true,
      message: `Bidang "${division.name}" berhasil ditambahkan.`,
      data: division,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menambahkan bidang.',
    };
  }
}
