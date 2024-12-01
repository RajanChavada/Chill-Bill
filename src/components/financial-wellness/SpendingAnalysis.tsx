import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Brain, Lightbulb } from "lucide-react";

const WORKER_URL = "https://financial-stress-ai.jimmychavada22.workers.dev";

const SpendingAnalysis = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]); // State for AI insights

  // Hard-coded dummy data for demonstration
  const dummyChartData = [
    { date: "Jan 01", spending: 100, anxietyLevel: 3 },
    { date: "Jan 02", spending: 120, anxietyLevel: 4 },
    { date: "Jan 03", spending: 80, anxietyLevel: 2 },
    { date: "Jan 04", spending: 150, anxietyLevel: 5 },
    { date: "Jan 05", spending: 90, anxietyLevel: 3 },
    { date: "Jan 06", spending: 200, anxietyLevel: 6 },
    { date: "Jan 07", spending: 110, anxietyLevel: 4 },
  ];

  useEffect(() => {
    setChartData(dummyChartData); // Set the dummy data
    fetchAiInsights(); // Fetch AI insights when the component mounts
  }, []);

  const fetchAiInsights = async () => {
    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          concern: "I am worried about my spending habits and need advice."
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      setAiInsights(data.result?.tips || [
        "Review your spending habits regularly.",
        "Consider setting a budget for discretionary spending.",
        "Look for ways to reduce unnecessary expenses."
      ]);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setAiInsights([
        "Review your spending habits regularly.",
        "Consider setting a budget for discretionary spending.",
        "Look for ways to reduce unnecessary expenses."
      ]); // Fallback tips
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm w-full">
      <h2 className="text-lg font-semibold">Spending & Anxiety Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="spending" stroke="#8884d8" />
          <Line type="monotone" dataKey="anxietyLevel" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* AI Insights Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold">AI Insights on Spending</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span>Helpful Tips:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
          {aiInsights.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default SpendingAnalysis;
