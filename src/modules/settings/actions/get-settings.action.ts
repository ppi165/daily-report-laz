"use server";

import { getSettingsUseCase } from '../use-cases/get-settings.use-case';

export async function getSettingsAction() {
  try {
    const data = await getSettingsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memuat pengaturan sistem.',
      data: null,
    };
  }
}
