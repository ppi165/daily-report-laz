"use server";

import { ForgotPasswordSchema, ForgotPasswordInput } from '../schemas/forgot-password.schema';
import { requestPasswordResetInfoUseCase } from '../use-cases/request-password-reset-info.use-case';

export async function requestPasswordResetInfoAction(input: ForgotPasswordInput) {
  try {
    const validated = ForgotPasswordSchema.parse(input);
    const data = await requestPasswordResetInfoUseCase.execute(validated);

    return {
      success: true,
      message: 'Akun berhasil diverifikasi',
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
    };
  }
}
