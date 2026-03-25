const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export function validateTask(req, res, next) {
  const { title, status, priority } = req.body;
  const isCreate = req.method === 'POST';

  if (isCreate && (!title || typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }
  if (title && title.length > 120) {
    return res.status(400).json({ error: 'title must be 120 characters or fewer' });
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }
  next();
}
