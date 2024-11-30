import React from "react";
import { Card } from "@/components/ui/card";
import { SmilePlus, Frown, Meh } from "lucide-react";

interface MoodTrend {
  date: string;
  mood: "happy" | "neutral" | "sad";
  count: number;
}

interface MoodTrendsProps {
  trends?: MoodTrend[];
  period?: "week" | "month";
}

const defaultTrends: MoodTrend[] = [
  { date: "Mon", mood: "happy", count: 3 },
  { date: "Tue", mood: "neutral", count: 2 },
  { date: "Wed", mood: "sad", count: 1 },
  { date: "Thu", mood: "happy", count: 4 },
  { date: "Fri", mood: "neutral", count: 2 },
  { date: "Sat", mood: "happy", count: 5 },
  { date: "Sun", mood: "happy", count: 3 },
];

const moodIcons = {
  happy: SmilePlus,
  neutral: Meh,
  sad: Frown,
};

const moodColors = {
  happy: "text-green-500",
  neutral: "text-yellow-500",
  sad: "text-red-500",
};

const MoodTrends: React.FC<MoodTrendsProps> = ({
  trends = defaultTrends,
  period = "week",
}) => {
  const maxCount = Math.max(...trends.map((trend) => trend.count));

  return (
    <Card className="w-[380px] h-[120px] bg-white p-4">
      <h3 className="text-sm font-semibold mb-3">Mood Trends This {period}</h3>
      <div className="flex items-end justify-between h-[60px]">
        {trends.map((trend, index) => {
          const IconComponent = moodIcons[trend.mood];
          const height = (trend.count / maxCount) * 100;

          return (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div
                className={`w-8 flex items-end justify-center ${moodColors[trend.mood]}`}
                style={{ height: `${height}%` }}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-xs text-muted-foreground">
                {trend.date}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MoodTrends;
