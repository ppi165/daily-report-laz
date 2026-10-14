import { z } from 'zod';

export const GetReportsSchema = z.object({
  division: z.string().optional(),
  authorId: z.string().optional(),
  limit: z.number().optional().default(50),
  offset: z.number().optional().default(0),
});

export type GetReportsInput = z.input<typeof GetReportsSchema>;
