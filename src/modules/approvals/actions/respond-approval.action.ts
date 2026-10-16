"use server";

import { respondApprovalUseCase } from '../use-cases/respond-approval.use-case';
import { RespondApprovalInput } from '../schemas/respond-approval.schema';

export async function respondApprovalAction(input: RespondApprovalInput) {
  try {
    const result = await respondApprovalUseCase.execute(input);
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memproses persetujuan.',
    };
  }
}
