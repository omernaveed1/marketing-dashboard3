import React from "react";
import { getInsights } from "../services/geminiService";
import type { FlatRecord } from "../data/normalized";
import { Spinner } from "./Spinner";

export const AiInsightsSlice: React.FC<{ data: FlatRecord[] }> = ({ data }) => {
  const [insights, setInsights] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setInsights("");
    try {
      const ai = await getInsights({ records: data });
      setInsights(ai);
    } catch {
      setInsights("Failed to generate micro-analysis for this slice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 border border-blue-500/50 rounded p-4 mb-6 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-white flex items-center">
          <span role="img" aria-label="AI">🤖</span> Micro Data AI Insights
        </h3>
        <button
          className="px-4 py-2 rounded bg-brand-primary text-white"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Generate AI Insights"}
        </button>
      </div>
      {loading && <p className="text-slate-400">Analyzing...</p>}
      {insights && <div className="prose prose-invert max-w-none">{insights}</div>}
    </div>
  );
};