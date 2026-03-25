import { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';
import * as authApi from '../api/authApi.js';

const { Title, Text, Paragraph } = Typography;

function LoginForm({ onSwitch }) {
  const { loginUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onFinish(values) {
    setLoading(true);
    setError('');
    try {
      const { token } = await authApi.login(values);
      loginUser(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form-wrapper">
      <Title level={2} className="auth-title">ยินดีต้อนรับกลับ</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        เข้าสู่ระบบเพื่อจัดการงานของคุณ
      </Paragraph>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item name="email" rules={[{ required: true, message: 'กรุณาใส่อีเมล' }, { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }]}>
          <Input prefix={<MailOutlined className="input-icon" />} placeholder="อีเมล" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'กรุณาใส่รหัสผ่าน' }]}>
          <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="รหัสผ่าน" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} className="auth-submit-btn">
          เข้าสู่ระบบ
        </Button>
      </Form>
      <Divider plain><Text type="secondary">หรือ</Text></Divider>
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">ยังไม่มีบัญชี? </Text>
        <Button type="link" onClick={onSwitch} style={{ padding: 0, color: '#f97316', fontWeight: 600 }}>
          สมัครสมาชิก
        </Button>
      </div>
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const { loginUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onFinish({ username, email, password }) {
    setLoading(true);
    setError('');
    try {
      const { token } = await authApi.register({ username, email, password });
      loginUser(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-form-wrapper">
      <Title level={2} className="auth-title">สร้างบัญชีใหม่</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        เริ่มต้นจัดการงานของคุณได้เลย
      </Paragraph>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item name="username" rules={[{ required: true, message: 'กรุณาใส่ชื่อผู้ใช้' }]}>
          <Input prefix={<UserOutlined className="input-icon" />} placeholder="ชื่อผู้ใช้" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: 'กรุณาใส่อีเมล' }, { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }]}>
          <Input prefix={<MailOutlined className="input-icon" />} placeholder="อีเมล" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'กรุณาใส่รหัสผ่าน' }, { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }]}>
          <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<CheckCircleOutlined className="input-icon" />} placeholder="ยืนยันรหัสผ่าน" />
        </Form.Item>
        <Button htmlType="submit" block loading={loading} className="auth-submit-btn auth-submit-accent">
          สมัครสมาชิก
        </Button>
      </Form>
      <Divider plain><Text type="secondary">หรือ</Text></Divider>
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">มีบัญชีอยู่แล้ว? </Text>
        <Button type="link" onClick={onSwitch} style={{ padding: 0, color: '#4f46e5', fontWeight: 600 }}>
          เข้าสู่ระบบ
        </Button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo">📋</div>
          <Title level={1} style={{ color: '#fff', margin: '16px 0 8px' }}>Task Tracker</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 40 }}>
            จัดการงานของคุณให้มีประสิทธิภาพ<br />ในที่เดียว
          </Paragraph>
          <div className="auth-features">
            {['สร้างและติดตามงาน', 'จัดลำดับความสำคัญ', 'แยกบัญชีส่วนตัว', 'ซิงค์ข้อมูล cloud'].map((f) => (
              <div key={f} className="auth-feature-item">
                <CheckCircleOutlined style={{ color: '#f97316', marginRight: 8 }} />
                <Text style={{ color: '#fff' }}>{f}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel">
        {mode === 'login'
          ? <LoginForm onSwitch={() => setMode('register')} />
          : <RegisterForm onSwitch={() => setMode('login')} />
        }
      </div>
    </div>
  );
}
