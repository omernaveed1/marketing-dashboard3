import React from "react";

interface DashboardSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const DashboardSelector: React.FC<DashboardSelectorProps> = ({ value, onChange }) => (
  <div className="mb-4 flex gap-2 items-center">
    <span className="font-semibold text-white">View By:</span>
    <select
      className="p-2 rounded bg-slate-800 text-slate-300"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="department">Department</option>
      <option value="platform">Platform</option>
      <option value="region">Region</option>
    </select>
  </div>
);