import React, { useState } from "react";
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
  initialGoals?: Goal[];
  onGoalClick?: (goalId: string) => void;
}

const iconMap = {
  target: Target,
  wallet: Wallet,
  "trending-up": TrendingUp,
};

const GoalsOverview: React.FC<GoalsOverviewProps> = ({
  initialGoals = [],
  onGoalClick = () => {},
}) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState(0);
  const [newGoalTarget, setNewGoalTarget] = useState(0);

  const handleAddGoal = () => {
    if (newGoalName && newGoalTarget > 0) {
      const newGoal: Goal = {
        id: Date.now().toString(), // Unique ID based on timestamp
        name: newGoalName,
        currentAmount: newGoalAmount,
        targetAmount: newGoalTarget,
        category: "Savings", // Default category, can be modified
        icon: "wallet", // Default icon, can be modified
      };
      setGoals([...goals, newGoal]);
      setNewGoalName("");
      setNewGoalAmount(0);
      setNewGoalTarget(0);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddGoal();
    }
  };

  return (
    <Card className="w-[380px] bg-white p-4 overflow-y-auto">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold mb-3">Financial Goals</h3>
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const IconComponent = iconMap[goal.icon];

          return (
            <div
              key={goal.id}
              className={`flex items-center space-x-3 cursor-pointer hover:bg-accent/10 p-2 rounded-lg transition-colors ${goal.currentAmount === goal.targetAmount ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' : 'bg-white'}`}
              onClick={() => onGoalClick(goal.id)}
            >
              <div className="p-2 rounded-full bg-primary/10">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Goal Name"
          className="border rounded p-1 w-full mb-2"
        />
        <input
          type="number"
          value={newGoalTarget}
          onChange={(e) => setNewGoalTarget(Number(e.target.value))}
          onKeyPress={handleKeyPress}
          placeholder="Target Amount"
          className="border rounded p-1 w-full mb-2"
        />
        <button
          onClick={handleAddGoal}
          className="bg-blue-500 text-white rounded px-4 py-2 w-full"
        >
          Add Goal
        </button>
      </div>
    </Card>
  );
};

export default GoalsOverview;
