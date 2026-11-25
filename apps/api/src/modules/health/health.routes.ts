import { Router } from 'express';
import { query } from '../../db/pool.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const { rows } = await query<{ ok: boolean }>('SELECT 1 AS ok');

  res.json({
    status: 'ok',
    database: rows[0]?.ok ? 'connected' : 'unknown',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
