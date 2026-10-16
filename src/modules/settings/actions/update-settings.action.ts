"use server";

import { updateSettingsUseCase } from '../use-cases/update-settings.use-case';
import { UpdateSettingsInput } from '../schemas/update-settings.schema';

export async function updateSettingsAction(input: UpdateSettingsInput) {
  try {
    const data = await updateSettingsUseCase.execute(input);
    return { success: true, message: 'Pengaturan sistem berhasil diperbarui.', data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memperbarui pengaturan sistem.',
    };
  }
}
