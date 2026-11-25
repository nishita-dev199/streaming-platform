import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { requestLogger } from './middleware/request-logger.js';
import { healthRouter } from './modules/health/health.routes.js';
import { usersRouter } from './modules/users/users.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }));
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  app.get(env.API_PREFIX, (_req, res) => {
    res.json({ name: 'streaming-platform-api', version: '1.0.0' });
  });
  app.use(`${env.API_PREFIX}/health`, healthRouter);
  app.use(`${env.API_PREFIX}/users`, usersRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
