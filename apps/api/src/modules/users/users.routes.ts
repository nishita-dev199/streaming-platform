import { createUserSchema } from '@repo/shared';
import { Router } from 'express';
import { createUser, listUsers } from './users.service.js';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res) => {
  res.json({ data: await listUsers() });
});

usersRouter.post('/', async (req, res) => {
  const input = createUserSchema.parse(req.body);
  const user = await createUser(input);
  res.status(201).json({ data: user });
});
