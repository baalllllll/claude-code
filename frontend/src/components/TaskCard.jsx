const STATUS_LABEL = {
  'todo': 'รอดำเนินการ',
  'in-progress': 'กำลังดำเนินการ',
  'done': 'เสร็จแล้ว',
};

const PRIORITY_LABEL = {
  low: 'ต่ำ',
  medium: 'กลาง',
  high: 'สูง',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-card-header">
        <span className={`badge status-${task.status}`}>{STATUS_LABEL[task.status]}</span>
        <span className={`badge priority-badge priority-${task.priority}`}>
          {PRIORITY_LABEL[task.priority]}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-footer">
        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString('th-TH')}
        </span>
        <div className="task-actions">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="status-select"
          >
            <option value="todo">รอดำเนินการ</option>
            <option value="in-progress">กำลังดำเนินการ</option>
            <option value="done">เสร็จแล้ว</option>
          </select>
          <button className="btn-icon" onClick={() => onEdit(task)} title="แก้ไข">✏️</button>
          <button className="btn-icon btn-danger" onClick={() => onDelete(task.id)} title="ลบ">🗑️</button>
        </div>
      </div>
    </div>
  );
}
