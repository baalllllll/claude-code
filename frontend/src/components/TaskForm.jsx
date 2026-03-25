import { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';

const { TextArea } = Input;

export function TaskForm({ initial, onSubmit, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(
      initial
        ? { title: initial.title, description: initial.description, status: initial.status, priority: initial.priority }
        : { title: '', description: '', status: 'todo', priority: 'medium' }
    );
  }, [initial, form]);

  async function handleFinish(values) {
    await onSubmit(values);
    form.resetFields();
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
      <Form.Item
        label="ชื่องาน"
        name="title"
        rules={[{ required: true, message: 'กรุณาใส่ชื่องาน' }, { max: 120, message: 'ไม่เกิน 120 ตัวอักษร' }]}
      >
        <Input placeholder="ใส่ชื่องาน..." />
      </Form.Item>

      <Form.Item label="รายละเอียด" name="description">
        <TextArea placeholder="รายละเอียด (ถ้ามี)..." rows={3} maxLength={500} showCount />
      </Form.Item>

      <Space style={{ width: '100%' }} styles={{ item: { flex: 1 } }}>
        <Form.Item label="สถานะ" name="status" style={{ flex: 1 }}>
          <Select options={[
            { value: 'todo', label: 'รอดำเนินการ' },
            { value: 'in-progress', label: 'กำลังดำเนินการ' },
            { value: 'done', label: 'เสร็จแล้ว' },
          ]} />
        </Form.Item>
        <Form.Item label="ความสำคัญ" name="priority" style={{ flex: 1 }}>
          <Select options={[
            { value: 'low', label: 'ต่ำ' },
            { value: 'medium', label: 'กลาง' },
            { value: 'high', label: 'สูง' },
          ]} />
        </Form.Item>
      </Space>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button type="primary" htmlType="submit">
            {initial ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
