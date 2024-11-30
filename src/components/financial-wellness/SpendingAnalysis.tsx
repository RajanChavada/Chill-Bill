import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";

interface SpendingAnalysisProps {}

// Mock data for spending patterns and mood correlation
const mockData = [
  { date: "2024-01-01", spending: 120, mood: "happy", anxietyLevel: 2 },
  { date: "2024-01-02", spending: 85, mood: "happy", anxietyLevel: 1 },
  { date: "2024-01-03", spending: 200, mood: "anxious", anxietyLevel: 8 },
  { date: "2024-01-04", spending: 180, mood: "stressed", anxietyLevel: 7 },
  { date: "2024-01-05", spending: 60, mood: "happy", anxietyLevel: 2 },
  { date: "2024-01-06", spending: 250, mood: "anxious", anxietyLevel: 9 },
  { date: "2024-01-07", spending: 90, mood: "neutral", anxietyLevel: 4 },
];

const tips = [
  "Tip: High spending days often correlate with increased anxiety levels",
  "Consider setting daily spending limits to manage financial stress",
  "Practice mindful spending by waiting 24 hours before large purchases",
  "Track your mood before making significant financial decisions",
];

const SpendingAnalysis: React.FC<SpendingAnalysisProps> = () => {
  return (
    <Card className="p-6 bg-white shadow-sm w-full">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">
              Spending & Anxiety Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your spending patterns and emotional correlation
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spending"
                stroke="#8884d8"
                name="Spending ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="anxietyLevel"
                stroke="#82ca9d"
                name="Anxiety Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Tips */}
        <div className="bg-primary/5 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-4 w-4" />
            <h3 className="font-medium">AI Financial Insights</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default SpendingAnalysis;
