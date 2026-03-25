import { useState } from 'react';
import { Layout, Typography, Button, Modal, Spin, Alert, Empty, Row, Col, Statistic, Avatar, Dropdown, App as AntApp } from 'antd';
import { PlusOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useAuth } from './context/AuthContext.jsx';
import { useTasks } from './hooks/useTasks.js';
import { FilterBar } from './components/FilterBar.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import AuthPage from './pages/AuthPage.jsx';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function MainApp() {
  const { modal } = AntApp.useApp();
  const { user, logoutUser } = useAuth();
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

  function handleDelete(id) {
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

  const userMenu = {
    items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'ออกจากระบบ', danger: true }],
    onClick: () => logoutUser(),
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f4ff' }}>
      <Header className="app-header">
        <div className="header-content">
          <Title level={4} style={{ margin: 0, color: '#fff', letterSpacing: 1 }}>
            📋 Task Tracker
          </Title>
          <Dropdown menu={userMenu} trigger={['click']}>
            <Button type="text" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size="small" style={{ background: '#f97316' }} icon={<UserOutlined />} />
              <span className="username-text">{user?.username}</span>
              <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <ClockCircleOutlined style={{ color: '#fbbf24', fontSize: 18 }} />
            <div>
              <div className="stat-value">{counts.todo}</div>
              <div className="stat-label">รอดำเนินการ</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <SyncOutlined style={{ color: '#818cf8', fontSize: 18 }} spin={counts['in-progress'] > 0} />
            <div>
              <div className="stat-value">{counts['in-progress']}</div>
              <div className="stat-label">กำลังดำเนินการ</div>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <CheckCircleOutlined style={{ color: '#34d399', fontSize: 18 }} />
            <div>
              <div className="stat-value">{counts.done}</div>
              <div className="stat-label">เสร็จแล้ว</div>
            </div>
          </div>
        </div>
      </Header>

      <Content className="app-content">
        <div className="content-inner">
          <div className="content-toolbar">
            <FilterBar current={filter} onChange={setFilter} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)} size="large">
              เพิ่มงาน
            </Button>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>}
          {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

          {!loading && !error && tasks.length === 0 && (
            <Empty description={<Text type="secondary">ยังไม่มีงาน เริ่มสร้างงานแรกของคุณ</Text>} style={{ marginTop: 80 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
                เพิ่มงานแรก
              </Button>
            </Empty>
          )}

          <Row gutter={[16, 16]}>
            {tasks.map((task) => (
              <Col key={task.id} xs={24} sm={24} md={12} lg={8} xl={8}>
                <TaskCard
                  task={task}
                  onEdit={setEditTask}
                  onDelete={handleDelete}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Modal title="เพิ่มงานใหม่" open={showCreate} onCancel={() => setShowCreate(false)} footer={null} destroyOnHidden>
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
      <Modal title="แก้ไขงาน" open={!!editTask} onCancel={() => setEditTask(null)} footer={null} destroyOnHidden>
        <TaskForm initial={editTask} onSubmit={handleEdit} onCancel={() => setEditTask(null)} />
      </Modal>
    </Layout>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ff' }}>
      <Spin size="large" />
    </div>
  );

  return user ? <MainApp /> : <AuthPage />;
}
