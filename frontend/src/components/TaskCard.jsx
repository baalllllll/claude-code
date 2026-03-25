import { Card, Tag, Select, Button, Space, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const STATUS_CONFIG = {
  todo:         { color: 'gold',  label: 'รอดำเนินการ' },
  'in-progress':{ color: 'blue',  label: 'กำลังดำเนินการ' },
  done:         { color: 'green', label: 'เสร็จแล้ว' },
};

const PRIORITY_CONFIG = {
  high:   { color: 'red',    label: 'สูง' },
  medium: { color: 'blue',   label: 'กลาง' },
  low:    { color: 'default',label: 'ต่ำ' },
};

const BORDER_COLOR = { high: '#ef4444', medium: '#3b82f6', low: '#10b981' };

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const s = STATUS_CONFIG[task.status];
  const p = PRIORITY_CONFIG[task.priority];

  return (
    <Card
      size="small"
      style={{ borderLeft: `4px solid ${BORDER_COLOR[task.priority]}` }}
      styles={{ body: { padding: '14px 16px' } }}
      actions={[
        <Select
          key="status"
          value={task.status}
          size="small"
          variant="borderless"
          onChange={(val) => onStatusChange(task.id, val)}
          options={[
            { value: 'todo', label: 'รอดำเนินการ' },
            { value: 'in-progress', label: 'กำลังดำเนินการ' },
            { value: 'done', label: 'เสร็จแล้ว' },
          ]}
          style={{ width: 160 }}
        />,
        <Tooltip key="edit" title="แก้ไข">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(task)} />
        </Tooltip>,
        <Tooltip key="delete" title="ลบ">
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(task.id)} />
        </Tooltip>,
      ]}
    >
      <Space style={{ marginBottom: 8 }}>
        <Tag color={s.color}>{s.label}</Tag>
        <Tag color={p.color}>ความสำคัญ{p.label}</Tag>
      </Space>

      <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
        {task.title}
      </Text>

      {task.description && (
        <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 8, fontSize: 13 }}>
          {task.description}
        </Paragraph>
      )}

      <Space style={{ marginTop: 4 }}>
        <CalendarOutlined style={{ color: '#9ca3af', fontSize: 12 }} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(task.createdAt).toLocaleDateString('th-TH')}
        </Text>
      </Space>
    </Card>
  );
}
