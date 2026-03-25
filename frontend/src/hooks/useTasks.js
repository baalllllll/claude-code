import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/tasksApi.js';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTasks(filter);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function createTask(body) {
    const task = await api.createTask(body);
    setTasks((prev) => [task, ...prev]);
    return task;
  }

  async function updateTask(id, body) {
    const updated = await api.updateTask(id, body);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function deleteTask(id) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, loading, error, filter, setFilter, createTask, updateTask, deleteTask };
}
