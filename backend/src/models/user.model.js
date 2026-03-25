import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

function toObj(columns, row) {
  return Object.fromEntries(columns.map((col, i) => [col, row[i]]));
}

export async function findByEmail(email) {
  const rs = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
  if (rs.rows.length === 0) return null;
  return toObj(rs.columns, rs.rows[0]);
}

export async function findByUsername(username) {
  const rs = await db.execute({ sql: 'SELECT * FROM users WHERE username = ?', args: [username] });
  if (rs.rows.length === 0) return null;
  return toObj(rs.columns, rs.rows[0]);
}

export async function createUser({ username, email, password }) {
  const user = { id: uuidv4(), username, email, password, createdAt: new Date().toISOString() };
  await db.execute({
    sql: 'INSERT INTO users (id, username, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
    args: [user.id, user.username, user.email, user.password, user.createdAt],
  });
  const { password: _, ...safe } = user;
  return safe;
}
