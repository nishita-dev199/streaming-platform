import type { ErrorRequestHandler } from 'express';
import { ZodError, z } from 'zod';
import { env } from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'ValidationError', details: z.flattenError(error) });
    return;
  }

  // PostgreSQL unique violation.
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
    res.status(409).json({ error: 'Conflict', message: 'A record with those values already exists' });
    return;
  }

  const status = typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
    ? error.status
    : 500;
  const message = error instanceof Error ? error.message : String(error);

  if (status >= 500) console.error(error);

  res.status(status).json({
    error: status >= 500 ? 'InternalServerError' : 'RequestError',
    message: status >= 500 && env.NODE_ENV === 'production' ? 'Something went wrong' : message,
  });
};
