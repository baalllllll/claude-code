import { useState, useEffect } from 'react';

const DEFAULT = { title: '', description: '', status: 'todo', priority: 'medium' };

export function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(DEFAULT);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initial ? { ...DEFAULT, ...initial } : DEFAULT);
  }, [initial]);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('กรุณาใส่ชื่องาน');
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-group">
        <label>ชื่องาน *</label>
        <input
          name="title"
          value={form.title}
          onChange={handle}
          placeholder="ใส่ชื่องาน..."
          maxLength={120}
        />
      </div>
      <div className="form-group">
        <label>รายละเอียด</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handle}
          placeholder="รายละเอียด (ถ้ามี)..."
          rows={3}
          maxLength={500}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>สถานะ</label>
          <select name="status" value={form.status} onChange={handle}>
            <option value="todo">รอดำเนินการ</option>
            <option value="in-progress">กำลังดำเนินการ</option>
            <option value="done">เสร็จแล้ว</option>
          </select>
        </div>
        <div className="form-group">
          <label>ความสำคัญ</label>
          <select name="priority" value={form.priority} onChange={handle}>
            <option value="low">ต่ำ</option>
            <option value="medium">กลาง</option>
            <option value="high">สูง</option>
          </select>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}
        </button>
      </div>
    </form>
  );
}
