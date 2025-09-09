import React, { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { AiInsightsSlice } from "./components/AiInsightsSlice";
import { PivotTable } from "./components/PivotTable";
import { ExportButton } from "./components/ExportButton";
import { SimpleBarChart } from "./components/SimpleBarChart";
import { normalizeDashboardData } from "./data/normalized";
import { DASHBOARD_DATA } from "./data";
import type { FlatRecord } from "./data/normalized";
import { parseDocument } from "./services/geminiService";

const App: React.FC = () => {
  const [dashboardData, setDashboardData] = useState(DASHBOARD_DATA);
  const [normalizedData, setNormalizedData] = useState<FlatRecord[]>(normalizeDashboardData(DASHBOARD_DATA));
  const [filters, setFilters] = useState({
    departments: [] as string[],
    platforms: [] as string[],
    regions: [] as string[],
  });

  // File import handler (PDF, Excel, CSV)
  const handleFileImport = async (file: File) => {
    try {
      let textContent = "";
      if (file.type === "application/pdf") {
        const pdfjsLib = await import("pdfjs-dist/build/pdf");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs";
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        textContent = fullText;
      } else if (
        file.type.includes("spreadsheetml") ||
        file.type.includes("excel") ||
        file.name.endsWith(".csv")
      ) {
        // Excel or CSV
        const XLSX = (window as any).XLSX
          ? (window as any).XLSX
          : await import("xlsx");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
        let fullText = "";
        workbook.SheetNames.forEach((sheetName: string) => {
          fullText += `Sheet: ${sheetName}\n\n`;
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          jsonData.forEach((row: any[]) => {
            fullText += row.join("\t") + "\n";
          });
          fullText += "\n";
        });
        textContent = fullText;
      } else {
        alert("Unsupported file type. Please upload PDF, Excel, or CSV.");
        return;
      }
      // Parse with Gemini backend, then normalize
      const newDashboardData = await parseDocument(textContent);
      setDashboardData(newDashboardData);
      setNormalizedData(normalizeDashboardData(newDashboardData));
    } catch (e) {
      alert("Error importing file: " + (e as Error).message);
    }
  };

  const departments = useMemo(() => Array.from(new Set(normalizedData.map(r => r.department).filter(Boolean))).sort(), [normalizedData]);
  const platforms = useMemo(() => Array.from(new Set(normalizedData.map(r => r.platform).filter(Boolean))).sort(), [normalizedData]);
  const regions = useMemo(() => Array.from(new Set(normalizedData.map(r => r.region).filter(Boolean))).sort(), [normalizedData]);

  const filtered = useMemo(() => normalizedData.filter(r =>
    (filters.departments.length === 0 || filters.departments.includes(r.department)) &&
    (filters.platforms.length === 0 || filters.platforms.includes(r.platform)) &&
    (filters.regions.length === 0 || filters.regions.includes(r.region))
  ), [normalizedData, filters]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans">
      <Header onFileImport={handleFileImport} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <FilterBar
          departments={departments}
          platforms={platforms}
          regions={regions}
          selectedDepartments={filters.departments}
          selectedPlatforms={filters.platforms}
          selectedRegions={filters.regions}
          onChange={setFilters}
        />
        <AiInsightsSlice data={filtered} />
        <section className="my-6">
          <PivotTable data={filtered} />
        </section>
        <section className="my-6">
          <SimpleBarChart data={filtered} xKey="department" yKey="spend" />
        </section>
        <ExportButton data={filtered} />
      </main>
    </div>
  );
};

export default App;