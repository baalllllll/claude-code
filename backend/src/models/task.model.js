import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

function toObj(columns, row) {
  return Object.fromEntries(columns.map((col, i) => [col, row[i]]));
}

export async function getAllTasks(userId, statusFilter) {
  const rs = statusFilter
    ? await db.execute({ sql: 'SELECT * FROM tasks WHERE userId = ? AND status = ? ORDER BY createdAt DESC', args: [userId, statusFilter] })
    : await db.execute({ sql: 'SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC', args: [userId] });
  return rs.rows.map((r) => toObj(rs.columns, r));
}

export async function getTaskById(id, userId) {
  const rs = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ? AND userId = ?', args: [id, userId] });
  return rs.rows.length === 0 ? null : toObj(rs.columns, rs.rows[0]);
}

export async function createTask({ title, description = '', status = 'todo', priority = 'medium' }, userId) {
  const task = { id: uuidv4(), title, description, status, priority, createdAt: new Date().toISOString(), userId };
  await db.execute({
    sql: 'INSERT INTO tasks (id, title, description, status, priority, createdAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [task.id, task.title, task.description, task.status, task.priority, task.createdAt, task.userId],
  });
  return task;
}

export async function updateTask(id, updates, userId) {
  const task = await getTaskById(id, userId);
  if (!task) return null;
  const allowed = ['title', 'description', 'status', 'priority'];
  allowed.forEach((key) => { if (updates[key] !== undefined) task[key] = updates[key]; });
  await db.execute({
    sql: 'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ? AND userId = ?',
    args: [task.title, task.description, task.status, task.priority, task.id, userId],
  });
  return task;
}

export async function deleteTask(id, userId) {
  const rs = await db.execute({ sql: 'DELETE FROM tasks WHERE id = ? AND userId = ?', args: [id, userId] });
  return rs.rowsAffected > 0;
}
