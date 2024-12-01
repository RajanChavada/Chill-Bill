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
import { loadDailyData } from "@/lib/store";
import { format, subDays, parseISO, isAfter } from "date-fns";
import { useState, useEffect } from "react";

export default function SpendingAnalysis() {
  const [insights, setInsights] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Load and process data
  useEffect(() => {
    const dailyData = loadDailyData();

    // Get dates with data, sorted from newest to oldest
    const datesWithData = Object.keys(dailyData).sort((a, b) =>
      isAfter(parseISO(a), parseISO(b)) ? -1 : 1,
    );

    // Check if we have enough data
    const hasEnoughData = datesWithData.length >= 7;

    if (!hasEnoughData) {
      return;
    }

    // Get the last 7 days of actual data
    const processedData = datesWithData
      .slice(0, 7)
      .map((date) => ({
        date: format(parseISO(date), "MMM dd"),
        spending: dailyData[date].spending,
        anxietyLevel: dailyData[date].anxietyLevel,
        mood: dailyData[date].mood,
        rawDate: date, // Keep the raw date for sorting
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate)); // Sort by date ascending

    setChartData(processedData);

    // Calculate insights
    const spendingValues = processedData.map((d) => d.spending);
    const anxietyValues = processedData.map((d) => d.anxietyLevel);
    const avgSpending =
      spendingValues.reduce((a, b) => a + b, 0) / spendingValues.length;
    const avgAnxiety =
      anxietyValues.reduce((a, b) => a + b, 0) / anxietyValues.length;

    // Group spending by day of week
    const dayPatterns = processedData.reduce(
      (acc, data) => {
        const dayOfWeek = format(parseISO(data.rawDate), "EEEE");
        if (!acc[dayOfWeek]) acc[dayOfWeek] = [];
        acc[dayOfWeek].push({
          spending: data.spending,
          anxiety: data.anxietyLevel,
        });
        return acc;
      },
      {} as Record<string, { spending: number; anxiety: number }[]>,
    );

    // Calculate averages per day
    const dayAverages = Object.entries(dayPatterns).map(([day, data]) => ({
      day,
      avgSpending: data.reduce((sum, d) => sum + d.spending, 0) / data.length,
      avgAnxiety: data.reduce((sum, d) => sum + d.anxiety, 0) / data.length,
    }));

    // Find highest spending day
    const highestSpendingDay = dayAverages.reduce((max, curr) =>
      curr.avgSpending > max.avgSpending ? curr : max,
    );

    // Find highest anxiety day
    const highestAnxietyDay = dayAverages.reduce((max, curr) =>
      curr.avgAnxiety > max.avgAnxiety ? curr : max,
    );

    // Set insights
    setInsights([
      `${highestSpendingDay.day}s show highest spending ($${highestSpendingDay.avgSpending.toFixed(2)})`,
      `Anxiety peaks on ${highestAnxietyDay.day}s (${highestAnxietyDay.avgAnxiety.toFixed(1)}/10)`,
      `Average daily spending: $${avgSpending.toFixed(2)}`,
      `Average anxiety level: ${avgAnxiety.toFixed(1)}/10`,
    ]);
  }, []);

  // If we don't have enough data, show message
  if (chartData.length < 7) {
    return (
      <Card className="p-6 bg-white shadow-sm w-full">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Spending & Anxiety Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Add at least 7 days of spending data to see your analysis
          </p>
          <p className="text-xs text-muted-foreground">
            Current entries: {chartData.length} days
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-sm w-full">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">
              Spending & Anxiety Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Last 7 days of spending and anxiety patterns
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200"
            >
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
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
      </div>
    </Card>
  );
}
