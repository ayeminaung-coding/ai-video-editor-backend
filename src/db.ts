// db.ts - PostgreSQL client using Neon (or any Postgres) via pg

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[db] DATABASE_URL is not set. Database calls will fail until this is configured.');
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async <T = any>(text: string, params?: any[]): Promise<T[]> => {
  const res = await pool.query(text, params);
  return res.rows as T[];
};
