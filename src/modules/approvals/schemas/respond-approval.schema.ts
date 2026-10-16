import { z } from 'zod';

export const RespondApprovalSchema = z.object({
  approvalId: z.string().min(1, 'ID Approval wajib diisi'),
  action: z.enum(['APPROVE', 'REJECT']),
  note: z.string().optional(),
});

export type RespondApprovalInput = z.infer<typeof RespondApprovalSchema>;
