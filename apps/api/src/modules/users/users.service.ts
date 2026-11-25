import type { CreateUserInput, User } from '@repo/shared';
import { query } from '../../db/pool.js';

const COLUMNS = 'id, name, email, created_at';

export async function listUsers(): Promise<User[]> {
  const { rows } = await query<User>(`SELECT ${COLUMNS} FROM users ORDER BY id DESC`);
  return rows;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { rows } = await query<User>(
    `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING ${COLUMNS}`,
    [input.name, input.email],
  );
  return rows[0];
}
