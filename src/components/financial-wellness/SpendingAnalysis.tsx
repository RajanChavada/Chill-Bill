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
import { Button } from "@/components/ui/button";

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

  const aiInsights = [
    {
      tip: "Set a weekly budget and stick to it.",
      isChallenge: false,
    },
    {
      tip: "Use cash for discretionary spending to limit overspending.",
      isChallenge: true,
    },
    {
      tip: "Track your spending daily to identify patterns.",
      isChallenge: false,
    },
    {
      tip: "Challenge yourself to skip one unnecessary purchase this week.",
      isChallenge: true,
    },
    {
      tip: "Consider meal prepping to save on food costs.",
      isChallenge: false,
    },
    {
      tip: "Use student discounts at local stores like Aritzia and Lululemon.",
      isChallenge: false,
    },
    {
      tip: "Take advantage of seasonal sales and promotions.",
      isChallenge: false,
    },
    {
      tip: "Set aside a small amount each week for unexpected expenses.",
      isChallenge: false,
    },
    {
      tip: "Use budgeting apps to track your spending effectively.",
      isChallenge: false,
    },
    {
      tip: "Plan your shopping trips to avoid impulse buys.",
      isChallenge: true,
    },
  ];

  const aiSpendingInsights = [
    "Sundays show highest spending ($100.00)",
    "Anxiety peaks on Sundays (7.0/10)",
    "Pause before making impulse purchases on Sundays, considering the high anxiety level.",
    "Review and adjust your budget on Saturdays to avoid overspending on Sundays.",
  ];

  // Add this function to handle challenge button clicks
  const handleChallenge = (tip: string) => {
    // Implement your challenge logic here
    console.log(`Challenge accepted: ${tip}`);
  };

  return (
    <Card className="p-6 bg-white shadow-sm w-full">
      <div className="space-y-6">
        {/* Your content here */}
      </div>
    </Card>
  );
}
