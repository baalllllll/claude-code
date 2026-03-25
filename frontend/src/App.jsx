import { useState } from 'react';
import { useTasks } from './hooks/useTasks.js';
import { FilterBar } from './components/FilterBar.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { Modal } from './components/Modal.jsx';

export default function App() {
  const { tasks, loading, error, filter, setFilter, createTask, updateTask, deleteTask } = useTasks();
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);

  async function handleCreate(form) {
    await createTask(form);
    setShowCreate(false);
  }

  async function handleEdit(form) {
    await updateTask(editTask.id, form);
    setEditTask(null);
  }

  async function handleDelete(id) {
    if (confirm('ต้องการลบงานนี้ใช่ไหม?')) {
      await deleteTask(id);
    }
  }

  async function handleStatusChange(id, status) {
    await updateTask(id, { status });
  }

  const counts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📋 Task Tracker</h1>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + เพิ่มงาน
          </button>
        </div>
        <div className="stats">
          <span className="stat status-todo">{counts.todo} รอดำเนินการ</span>
          <span className="stat status-in-progress">{counts['in-progress']} กำลังดำเนินการ</span>
          <span className="stat status-done">{counts.done} เสร็จแล้ว</span>
        </div>
      </header>

      <main className="app-main">
        <FilterBar current={filter} onChange={setFilter} />

        {loading && <div className="state-msg">กำลังโหลด...</div>}
        {error && <div className="state-msg error">เกิดข้อผิดพลาด: {error}</div>}

        {!loading && !error && tasks.length === 0 && (
          <div className="empty-state">
            <p>ยังไม่มีงาน</p>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              เพิ่มงานแรก
            </button>
          </div>
        )}

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditTask}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </main>

      {showCreate && (
        <Modal title="เพิ่มงานใหม่" onClose={() => setShowCreate(false)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {editTask && (
        <Modal title="แก้ไขงาน" onClose={() => setEditTask(null)}>
          <TaskForm initial={editTask} onSubmit={handleEdit} onCancel={() => setEditTask(null)} />
        </Modal>
      )}
    </div>
  );
}
