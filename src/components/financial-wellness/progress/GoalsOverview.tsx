import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Wallet, TrendingUp } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  category: string;
  icon: "target" | "wallet" | "trending-up";
}

interface GoalsOverviewProps {
  goals?: Goal[];
  onGoalClick?: (goalId: string) => void;
}

const defaultGoals: Goal[] = [
  {
    id: "savings",
    name: "Emergency Fund",
    currentAmount: 2500,
    targetAmount: 5000,
    category: "Savings",
    icon: "wallet",
  },
  {
    id: "investment",
    name: "Investment Goal",
    currentAmount: 1000,
    targetAmount: 10000,
    category: "Investment",
    icon: "trending-up",
  },
  {
    id: "debt",
    name: "Debt Payoff",
    currentAmount: 3000,
    targetAmount: 5000,
    category: "Debt",
    icon: "target",
  },
];

const iconMap = {
  target: Target,
  wallet: Wallet,
  "trending-up": TrendingUp,
};

const GoalsOverview: React.FC<GoalsOverviewProps> = ({
  goals = defaultGoals,
  onGoalClick = () => {},
}) => {
  return (
    <Card className="w-[380px] h-[150px] bg-white p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3">Financial Goals</h3>
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const IconComponent = iconMap[goal.icon];

          return (
            <div
              key={goal.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-accent/10 p-2 rounded-lg transition-colors"
              onClick={() => onGoalClick(goal.id)}
            >
              <div className="p-2 rounded-full bg-primary/10">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ${goal.currentAmount.toLocaleString()} / $
                    {goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GoalsOverview;
