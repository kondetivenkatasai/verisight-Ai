import { z } from 'zod';

export const createCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(10000),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export const updateCaseSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(10000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']).optional(),
});
