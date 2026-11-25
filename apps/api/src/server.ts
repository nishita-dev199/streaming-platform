import { createApp } from './app.js';
import { env } from './config/env.js';
import { migrate } from './db/migrate.js';
import { pool } from './db/pool.js';

async function bootstrap(): Promise<void> {
  // Zero-config local development; production runs `npm run db:migrate` explicitly.
  if (env.NODE_ENV !== 'production') await migrate();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`API ready at http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});
