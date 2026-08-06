import { z } from 'zod';

export const reportQuerySchema = z.object({
  caseId: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});
