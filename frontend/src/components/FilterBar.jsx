import { Segmented } from 'antd';
import { UnorderedListOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';

const OPTIONS = [
  { value: '', label: 'ทั้งหมด', icon: <UnorderedListOutlined /> },
  { value: 'todo', label: 'รอดำเนินการ', icon: <ClockCircleOutlined /> },
  { value: 'in-progress', label: 'กำลังดำเนินการ', icon: <SyncOutlined spin /> },
  { value: 'done', label: 'เสร็จแล้ว', icon: <CheckCircleOutlined /> },
];

export function FilterBar({ current, onChange }) {
  return (
    <Segmented
      options={OPTIONS}
      value={current}
      onChange={onChange}
      size="large"
      style={{ marginBottom: 24 }}
    />
  );
}
