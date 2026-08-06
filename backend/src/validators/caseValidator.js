import { z } from 'zod';

export const createCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title cannot exceed 500 characters'),
  description: z.string().min(1, 'Description is required').max(50000, 'Description cannot exceed 50000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export const updateCaseSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).max(50000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']).optional(),
});

