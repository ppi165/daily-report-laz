"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { CreateUserInput, CreateUserSchema } from '../schemas/create-user.schema';
import { createUserUseCase } from '../use-cases/create-user.use-case';

export async function createUserAction(rawInput: CreateUserInput) {
  try {
    const validated = CreateUserSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Sesi tidak valid.' };
    }

    const result = await createUserUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menambahkan amil baru.',
    };
  }
}
