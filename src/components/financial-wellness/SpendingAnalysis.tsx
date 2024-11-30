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
import { Info, Loader2 } from "lucide-react";
import { loadDailyData } from "@/lib/store";
import { format, subDays, parseISO, isAfter } from "date-fns";
import { useState, useEffect, useRef } from "react";

export default function SpendingAnalysis() {
  // Load data
  const dailyData = loadDailyData();
  
  // Get dates with data, sorted from newest to oldest
  const datesWithData = Object.keys(dailyData)
    .sort((a, b) => isAfter(parseISO(a), parseISO(b)) ? -1 : 1);

  // Check if we have enough data
  const hasEnoughData = datesWithData.length >= 7;

  if (!hasEnoughData) {
    return (
      <Card className="p-6 bg-white shadow-sm w-full">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Spending & Anxiety Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Add at least 7 days of spending data to see your analysis
          </p>
          <p className="text-xs text-muted-foreground">
            Current entries: {datesWithData.length} days
          </p>
        </div>
      </Card>
    );
  }

  // Get the last 7 days of actual data
  const chartData = datesWithData
    .slice(0, 7)
    .map(date => ({
      date: format(parseISO(date), "MMM dd"),
      spending: dailyData[date].spending,
      anxietyLevel: dailyData[date].anxietyLevel,
      mood: dailyData[date].mood,
      rawDate: date // Keep the raw date for sorting
    }))
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate)); // Sort by date ascending

  // Calculate correlations for insights
  const spendingValues = chartData.map(d => d.spending);
  const anxietyValues = chartData.map(d => d.anxietyLevel);
  const avgSpending = spendingValues.reduce((a, b) => a + b, 0) / spendingValues.length;
  const avgAnxiety = anxietyValues.reduce((a, b) => a + b, 0) / anxietyValues.length;

  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiCallCount = useRef(0);
  const maxApiCalls = 5;

  // Add this function to analyze patterns
  const analyzePatterns = async () => {
    // Don't proceed if we've hit the API call limit
    if (apiCallCount.current >= maxApiCalls) {
      return;
    }

    setIsLoading(true);
    
    // Group spending by day of week
    const dayPatterns = chartData.reduce((acc, data) => {
      const dayOfWeek = format(parseISO(data.rawDate), 'EEEE');
      if (!acc[dayOfWeek]) acc[dayOfWeek] = [];
      acc[dayOfWeek].push({ spending: data.spending, anxiety: data.anxietyLevel });
      return acc;
    }, {} as Record<string, { spending: number; anxiety: number; }[]>);

    // Calculate averages per day
    const dayAverages = Object.entries(dayPatterns).map(([day, data]) => ({
      day,
      avgSpending: data.reduce((sum, d) => sum + d.spending, 0) / data.length,
      avgAnxiety: data.reduce((sum, d) => sum + d.anxiety, 0) / data.length
    }));

    // Find highest spending day
    const highestSpendingDay = dayAverages.reduce((max, curr) => 
      curr.avgSpending > max.avgSpending ? curr : max
    );

    // Find highest anxiety day
    const highestAnxietyDay = dayAverages.reduce((max, curr) => 
      curr.avgAnxiety > max.avgAnxiety ? curr : max
    );

    try {
      const prompt = `You are a financial advisor analyzing spending patterns. Based on this data:
- Highest spending: ${highestSpendingDay.day} ($${highestSpendingDay.avgSpending.toFixed(2)})
- Highest anxiety: ${highestAnxietyDay.day} (${highestAnxietyDay.avgAnxiety.toFixed(1)}/10)
- Average spending: $${avgSpending.toFixed(2)} daily
- Average anxiety: ${avgAnxiety.toFixed(1)}/10

Provide exactly 4 short tips to help manage spending and anxiety. Each tip must be:
- One sentence only
- Start with an action verb
- No JSON or special formatting
- No bullet points or dashes (I'll add those)

Example tips:
Create a weekend spending budget
Practice mindful shopping on Saturdays
Set up automatic savings transfers
Use breathing exercises before large purchases`;

      const response = await fetch("https://financial-stress-ai.jimmychavada22.workers.dev", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concern: prompt })
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      apiCallCount.current += 1;

      // Clean up the response
      const cleanTips = data.result.tips
        .map((tip: string) => {
          // Remove any JSON, brackets, or special characters
          const cleaned = tip
            .replace(/[{}\[\]"]/g, '')
            .replace(/^[-•*]\s*/, '')
            .replace(/^\d+\.\s*/, '')
            .trim();
          
          // Take only the first sentence if multiple exist
          return cleaned.split(/[.!?](?:\s|$)/)[0].trim() + '.';
        })
        .filter((tip: string) => 
          tip.length > 0 && 
          !tip.includes('{') && 
          !tip.includes('}')
        );

      setInsights([
        `${highestSpendingDay.day}s show highest spending ($${highestSpendingDay.avgSpending.toFixed(2)})`,
        `Anxiety peaks on ${highestAnxietyDay.day}s (${highestAnxietyDay.avgAnxiety.toFixed(1)}/10)`,
        ...cleanTips.slice(0, 4)
      ]);
    } catch (error) {
      console.error('Error getting insights:', error);
      setInsights([
        `${highestSpendingDay.day}s show highest spending ($${highestSpendingDay.avgSpending.toFixed(2)})`,
        `Anxiety peaks on ${highestAnxietyDay.day}s (${highestAnxietyDay.avgAnxiety.toFixed(1)}/10)`,
        "Set a strict budget for high-spending days",
        "Practice mindful spending on anxiety-prone days"
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Call analyzePatterns only once when data is available
  useEffect(() => {
    if (hasEnoughData && insights.length === 0) {
      analyzePatterns();
    }
  }, [hasEnoughData]);

  return (
    <Card className="p-6 bg-white shadow-sm w-full">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">Spending & Anxiety Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Last 7 days of spending and anxiety levels
            </p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Spending ($)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 10]}
                label={{ value: 'Anxiety Level', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border">
                        <p className="text-sm font-medium">{payload[0].payload.date}</p>
                        <p className="text-sm">Spending: ${payload[0].value}</p>
                        <p className="text-sm">Anxiety: {payload[1].value}/10</p>
                        <p className="text-xl text-center">{payload[0].payload.mood}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="spending"
                stroke="#8884d8"
                name="Spending ($)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="anxietyLevel"
                stroke="#82ca9d"
                name="Anxiety Level"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-primary/5 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-4 w-4" />
            <h3 className="font-medium">Spending Insights</h3>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-4 space-x-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Analyzing your spending patterns...</span>
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {insights.slice(0, 4).map((insight, index) => (
                <li key={index} className="transition-all hover:text-primary">
                  {insight}
                </li>
              ))}
            </ul>
          )}
          {apiCallCount.current >= maxApiCalls && (
            <p className="text-xs text-muted-foreground mt-2">
              Insights are based on your current data patterns
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
