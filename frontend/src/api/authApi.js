const BASE = '/api/auth';

async function request(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const register = (body) => request(`${BASE}/register`, body);
export const login = (body) => request(`${BASE}/login`, body);
