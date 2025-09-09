import React from "react";

type Option = string;

interface FilterBarProps {
  departments: Option[];
  platforms: Option[];
  regions: Option[];
  selectedDepartments: Option[];
  selectedPlatforms: Option[];
  selectedRegions: Option[];
  onChange: (filters: {
    departments: Option[];
    platforms: Option[];
    regions: Option[];
  }) => void;
}

function MultiSelect({
  label, options, selected, onChange
}: { label: string, options: Option[], selected: Option[], onChange: (v: Option[]) => void }) {
  return (
    <div className="mr-4">
      <label className="block text-xs font-semibold mb-1">{label}</label>
      <select
        multiple
        className="p-2 rounded bg-slate-800 text-slate-300 w-32 h-20"
        value={selected}
        onChange={e => {
          const values = Array.from(e.target.selectedOptions).map(o => o.value);
          onChange(values);
        }}
      >
        {options.map(opt =>
          <option key={opt} value={opt}>{opt}</option>
        )}
      </select>
    </div>
  );
}

export const FilterBar: React.FC<FilterBarProps> = ({
  departments, platforms, regions,
  selectedDepartments, selectedPlatforms, selectedRegions, onChange
}) => (
  <div className="flex gap-4 mb-6">
    <MultiSelect
      label="Department"
      options={departments}
      selected={selectedDepartments}
      onChange={depts => onChange({ departments: depts, platforms: selectedPlatforms, regions: selectedRegions })}
    />
    <MultiSelect
      label="Platform"
      options={platforms}
      selected={selectedPlatforms}
      onChange={plats => onChange({ departments: selectedDepartments, platforms: plats, regions: selectedRegions })}
    />
    <MultiSelect
      label="Region"
      options={regions}
      selected={selectedRegions}
      onChange={regs => onChange({ departments: selectedDepartments, platforms: selectedPlatforms, regions: regs })}
    />
  </div>
);