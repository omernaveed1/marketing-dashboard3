import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { FlatRecord } from "../data/normalized";

export const SimpleBarChart: React.FC<{ data: FlatRecord[], xKey: keyof FlatRecord, yKey: keyof FlatRecord }> = ({ data, xKey, yKey }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey={xKey as string} />
      <YAxis />
      <Tooltip />
      <Bar dataKey={yKey as string} fill="#2563eb" />
    </BarChart>
  </ResponsiveContainer>
);