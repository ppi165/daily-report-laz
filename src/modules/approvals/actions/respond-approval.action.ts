"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { respondApprovalUseCase } from '../use-cases/respond-approval.use-case';
import { RespondApprovalInput } from '../schemas/respond-approval.schema';

export async function respondApprovalAction(input: RespondApprovalInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = token ? await verifyJWT(token) : null;

    if (!decoded || !decoded.userId) {
      return {
        success: false,
        message: 'Sesi login telah berakhir. Silakan login kembali.',
      };
    }

    const result = await respondApprovalUseCase.execute(
      input,
      decoded.userId as string,
      decoded.role as string | undefined,
      decoded.name as string | undefined
    );
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memproses persetujuan.',
    };
  }
}
