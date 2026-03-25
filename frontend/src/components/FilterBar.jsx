const FILTERS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'todo', label: 'รอดำเนินการ' },
  { value: 'in-progress', label: 'กำลังดำเนินการ' },
  { value: 'done', label: 'เสร็จแล้ว' },
];

export function FilterBar({ current, onChange }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${current === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
