const BASE = '/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const getTasks = (status) =>
  request(status ? `${BASE}?status=${status}` : BASE);

export const createTask = (body) =>
  request(BASE, { method: 'POST', body: JSON.stringify(body) });

export const updateTask = (id, body) =>
  request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteTask = (id) =>
  request(`${BASE}/${id}`, { method: 'DELETE' });
