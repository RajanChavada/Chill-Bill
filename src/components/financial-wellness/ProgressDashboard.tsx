import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalsOverview from "./progress/GoalsOverview";
import MoodTrends from "./progress/MoodTrends";
import { BarChart, TrendingUp } from "lucide-react";

interface ProgressDashboardProps {
  goals?: Array<{
    id: string;
    name: string;
    currentAmount: number;
    targetAmount: number;
    category: string;
    icon: "target" | "wallet" | "trending-up";
  }>;
  moodTrends?: Array<{
    date: string;
    mood: "happy" | "neutral" | "sad";
    count: number;
  }>;
  onGoalClick?: (goalId: string) => void;
  period?: "week" | "month";
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  goals,
  moodTrends,
  onGoalClick = () => {},
  period = "week",
}) => {
  return (
    <Card className="w-[400px] h-[300px] bg-white p-4">
      <Tabs defaultValue="goals" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Financial Goals
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Mood Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="mt-0 h-[calc(100%-60px)]">
          <GoalsOverview goals={goals} onGoalClick={onGoalClick} />
        </TabsContent>

        <TabsContent value="mood" className="mt-0 h-[calc(100%-60px)]">
          <MoodTrends trends={moodTrends} period={period} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProgressDashboard;
