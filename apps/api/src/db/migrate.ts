import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { pool } from './pool.js';

const migrationsDir = resolve(process.cwd(), 'migrations');

/** Applies every .sql file in apps/api/migrations exactly once. */
export async function migrate(): Promise<void> {
  if (!existsSync(migrationsDir)) {
    console.warn(`No migrations directory found at ${migrationsDir}`);
    return;
  }

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name        TEXT PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const { rows } = await client.query<{ name: string }>('SELECT name FROM schema_migrations');
    const applied = new Set(rows.map((row) => row.name));
    const files = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) continue;

      const sql = readFileSync(resolve(migrationsDir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        count += 1;
        console.log(`  applied ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log(count ? `Migrations complete (${count} applied).` : 'Database is up to date.');
  } finally {
    client.release();
  }
}

// Allow `npm run db:migrate` to execute this file directly.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  migrate()
    .then(() => pool.end())
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
