import React from "react";
import type { FlatRecord } from "../data/normalized";

function toCSV(data: FlatRecord[]): string {
  if (!data.length) return "";
  const headers = Object.keys(data[0] || {}).join(",");
  const rows = data.map(row => Object.values(row).join(","));
  return [headers, ...rows].join("\n");
}

export const ExportButton: React.FC<{ data: FlatRecord[] }> = ({ data }) => {
  const handleExport = () => {
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      className="px-4 py-2 rounded bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700"
      onClick={handleExport}
      disabled={data.length === 0}
    >
      Export CSV
    </button>
  );
};