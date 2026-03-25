import { useState } from 'react';
import { Layout, Typography, Button, Modal, Spin, Alert, Empty, Row, Col, Statistic, App as AntApp } from 'antd';
import { PlusOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTasks } from './hooks/useTasks.js';
import { FilterBar } from './components/FilterBar.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskForm } from './components/TaskForm.jsx';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const { modal } = AntApp.useApp();
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
    modal.confirm({
      title: 'ลบงาน',
      content: 'ต้องการลบงานนี้ใช่ไหม?',
      okText: 'ลบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: () => deleteTask(id),
    });
  }

  const counts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', height: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 12px' }}>
          <Title level={3} style={{ margin: 0, color: '#4f46e5' }}>📋 Task Tracker</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
            เพิ่มงาน
          </Button>
        </div>
        <Row gutter={32} style={{ paddingBottom: 12 }}>
          <Col>
            <Statistic
              title="รอดำเนินการ"
              value={counts.todo}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: 20 }}
            />
          </Col>
          <Col>
            <Statistic
              title="กำลังดำเนินการ"
              value={counts['in-progress']}
              prefix={<SyncOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff', fontSize: 20 }}
            />
          </Col>
          <Col>
            <Statistic
              title="เสร็จแล้ว"
              value={counts.done}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: 20 }}
            />
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <FilterBar current={filter} onChange={setFilter} />

        {loading && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <Spin size="large" tip="กำลังโหลด..." />
          </div>
        )}

        {error && <Alert type="error" message={`เกิดข้อผิดพลาด: ${error}`} showIcon style={{ marginBottom: 16 }} />}

        {!loading && !error && tasks.length === 0 && (
          <Empty description="ยังไม่มีงาน" style={{ marginTop: 80 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
              เพิ่มงานแรก
            </Button>
          </Empty>
        )}

        <Row gutter={[16, 16]}>
          {tasks.map((task) => (
            <Col key={task.id} xs={24} sm={12} lg={8}>
              <TaskCard
                task={task}
                onEdit={setEditTask}
                onDelete={handleDelete}
                onStatusChange={(id, status) => updateTask(id, { status })}
              />
            </Col>
          ))}
        </Row>
      </Content>

      <Modal
        title="เพิ่มงานใหม่"
        open={showCreate}
        onCancel={() => setShowCreate(false)}
        footer={null}
        destroyOnHidden
      >
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal
        title="แก้ไขงาน"
        open={!!editTask}
        onCancel={() => setEditTask(null)}
        footer={null}
        destroyOnHidden
      >
        <TaskForm initial={editTask} onSubmit={handleEdit} onCancel={() => setEditTask(null)} />
      </Modal>
    </Layout>
  );
}
