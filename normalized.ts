import type { DashboardData } from "../types";

export interface FlatRecord {
  department: string;
  platform: string;
  region: string;
  budget: number;
  spend: number;
  leads: number;
  bookings: number;
  cpl: number | string;
  cpa: number | string;
  bookingRate: string;
  showUps: number;
  showUpRate: string;
}

const platforms = [
  { key: "ppcSummary", name: "PPC" },
  { key: "metaSummary", name: "Meta" },
  { key: "tiktokSummary", name: "TikTok" },
  { key: "snapchatSummary", name: "Snapchat" }
];

export function normalizeDashboardData(data: DashboardData): FlatRecord[] {
  const records: FlatRecord[] = [];
  for (const { key, name: platform } of platforms) {
    // @ts-ignore
    const table = data[key];
    if (!table) continue;
    for (const row of table.data) {
      records.push({
        department: row.comment ?? row.region,
        platform,
        region: row.region,
        budget: Number(row.totalAllotedBudget) || 0,
        spend: Number(row.totalSpendings) || 0,
        leads: Number(row.totalLeads) || 0,
        bookings: Number(row.totalBookings) || 0,
        cpl: row.cpl,
        cpa: row.cpa,
        bookingRate: row.bookingRate,
        showUps: Number(row.totalShowUps) || 0,
        showUpRate: row.showUpRate,
      });
    }
  }
  return records;
}