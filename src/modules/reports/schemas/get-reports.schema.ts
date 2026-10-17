import { z } from 'zod';

export const GetReportsSchema = z.object({
  division: z.string().optional(),
  authorId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.coerce.number().optional().default(100),
  offset: z.coerce.number().optional().default(0),
});

export type GetReportsInput = z.input<typeof GetReportsSchema>;
