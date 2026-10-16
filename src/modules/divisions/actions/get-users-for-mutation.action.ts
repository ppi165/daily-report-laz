"use server";

import { getUsersForMutationUseCase } from '../use-cases/get-users-for-mutation.use-case';

export async function getUsersForMutationAction() {
  try {
    const users = await getUsersForMutationUseCase.execute();
    return { success: true, data: users };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memuat data pegawai.',
      data: [],
    };
  }
}
