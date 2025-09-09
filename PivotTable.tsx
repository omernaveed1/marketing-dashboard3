import React, { useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import type { FlatRecord } from "../data/normalized";

export const PivotTable: React.FC<{ data: FlatRecord[] }> = ({ data }) => {
  const [pivotState, setPivotState] = useState({
    data: [
      ["Department", "Platform", "Region", "Budget", "Spend", "Leads", "Bookings", "CPL", "CPA", "Booking Rate", "Show-ups", "Show-up Rate"],
      ...data.map(d => [
        d.department, d.platform, d.region, d.budget, d.spend, d.leads, d.bookings, d.cpl, d.cpa, d.bookingRate, d.showUps, d.showUpRate
      ])
    ],
    rows: ["Platform"],
    cols: ["Region"],
    aggregatorName: "Sum",
    vals: ["Spend"],
    rendererName: "Table",
  });

  // Regenerate pivot data when input data changes
  React.useEffect(() => {
    setPivotState(ps => ({
      ...ps,
      data: [
        ["Department", "Platform", "Region", "Budget", "Spend", "Leads", "Bookings", "CPL", "CPA", "Booking Rate", "Show-ups", "Show-up Rate"],
        ...data.map(d => [
          d.department, d.platform, d.region, d.budget, d.spend, d.leads, d.bookings, d.cpl, d.cpa, d.bookingRate, d.showUps, d.showUpRate
        ])
      ]
    }));
  }, [data]);

  return (
    <div className="max-w-full overflow-x-auto bg-slate-950 rounded-lg shadow-md p-4">
      <PivotTableUI
        {...pivotState}
        onChange={s => setPivotState(s)}
        renderers={PivotTableUI.renderers}
        unusedOrientationCutoff={Infinity}
      />
    </div>
  );
};