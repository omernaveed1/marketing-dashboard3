// Update handleGetInsights to support micro (row-level) analysis

async function handleGetInsights(data: { records: FlatRecord[] }): Promise<string> {
    const records = data.records;

    const prompt = `
You are a senior marketing analyst AI. Analyze the following marketing data slice. If many records, summarize patterns, anomalies, and trends. If only a few records (1-5), provide row-by-row micro-analysis, highlighting stand-out values, outliers, or action items for each. Always use clear, bullet-pointed markdown. If records are from a pivot, mention the grouping.

Data:
${JSON.stringify(records, null, 2)}

Respond in this format:

**🔎 Micro Analysis:**
* (Row-by-row or group-level insight here)

**📈 Patterns & Anomalies:**
* (Broad trends, exceptions, or notable points)

**💡 Recommendations:**
* (Actionable next steps, if any)

Do not use markdown headers (#, ##, etc.), only bold and bullet points.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}