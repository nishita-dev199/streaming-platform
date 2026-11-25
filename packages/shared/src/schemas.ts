import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(100),
  email: z.email('a valid email is required').max(255),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
