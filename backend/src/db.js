import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? `file:${join(__dirname, 'data/tasks.db')}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id        TEXT PRIMARY KEY,
    username  TEXT NOT NULL UNIQUE,
    email     TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'todo',
    priority    TEXT NOT NULL DEFAULT 'medium',
    createdAt   TEXT NOT NULL,
    userId      TEXT REFERENCES users(id)
  )
`);

// migrate: add userId column if table existed before auth
try {
  await db.execute('ALTER TABLE tasks ADD COLUMN userId TEXT REFERENCES users(id)');
} catch { /* column already exists */ }

export default db;
