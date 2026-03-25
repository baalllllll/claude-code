import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

function toObj(columns, row) {
  return Object.fromEntries(columns.map((col, i) => [col, row[i]]));
}

export async function getAllTasks(statusFilter) {
  const rs = statusFilter
    ? await db.execute({ sql: 'SELECT * FROM tasks WHERE status = ? ORDER BY createdAt DESC', args: [statusFilter] })
    : await db.execute('SELECT * FROM tasks ORDER BY createdAt DESC');
  return rs.rows.map((r) => toObj(rs.columns, r));
}

export async function getTaskById(id) {
  const rs = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [id] });
  if (rs.rows.length === 0) return null;
  return toObj(rs.columns, rs.rows[0]);
}

export async function createTask({ title, description = '', status = 'todo', priority = 'medium' }) {
  const task = { id: uuidv4(), title, description, status, priority, createdAt: new Date().toISOString() };
  await db.execute({
    sql: 'INSERT INTO tasks (id, title, description, status, priority, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    args: [task.id, task.title, task.description, task.status, task.priority, task.createdAt],
  });
  return task;
}

export async function updateTask(id, updates) {
  const task = await getTaskById(id);
  if (!task) return null;
  const allowed = ['title', 'description', 'status', 'priority'];
  allowed.forEach((key) => { if (updates[key] !== undefined) task[key] = updates[key]; });
  await db.execute({
    sql: 'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ? WHERE id = ?',
    args: [task.title, task.description, task.status, task.priority, task.id],
  });
  return task;
}

export async function deleteTask(id) {
  const rs = await db.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [id] });
  return rs.rowsAffected > 0;
}
