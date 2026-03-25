import * as Task from '../models/task.model.js';

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.getAllTasks(req.user.id, req.query.status);
    res.json(tasks);
  } catch (err) { next(err); }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.getTaskById(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.createTask(req.body, req.user.id);
    res.status(201).json(task);
  } catch (err) { next(err); }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.updateTask(req.params.id, req.body, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
}

export async function deleteTask(req, res, next) {
  try {
    const ok = await Task.deleteTask(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
}
