import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award, Target, CheckCircle } from "lucide-react";
import { Button } from "react-day-picker";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "star" | "award" | "target";
  earned: boolean;
  progress: number;
}

const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Savings Master",
    description: "Save $500 in a month",
    icon: "trophy",
    earned: true,
    progress: 100,
  },
  {
    id: "2",
    name: "Challenge Champion",
    description: "Complete 5 group challenges",
    icon: "star",
    earned: false,
    progress: 60,
  },
  {
    id: "3",
    name: "Budget Pro",
    description: "Stay under budget for 30 days",
    icon: "target",
    earned: false,
    progress: 80,
  },
  {
    id: "4",
    name: "Investment Guru",
    description: "Invest in 3 different stocks",
    icon: "award",
    earned: true,
    progress: 100,
  },
  {
    id: "5",
    name: "Debt Destroyer",
    description: "Pay off $1,000 in debt",
    icon: "star",
    earned: false,
    progress: 40,
  },
  {
    id: "6",
    name: "Emergency Fund Builder",
    description: "Save $1,000 for emergencies",
    icon: "trophy",
    earned: true,
    progress: 100,
  },
];

const iconMap = {
  trophy: Trophy,
  star: Star,
  award: Award,
  target: Target,
};

// Define aiInsights or import it from another module
const aiInsights = [
  { isChallenge: true, tip: "Save more this month!" },
  { isChallenge: false, tip: "Track your expenses!" },
  { isChallenge: true, tip: "Reduce your dining out expenses!" },
  { isChallenge: true, tip: "Set a weekly budget!" },
  { isChallenge: true, tip: "Start an emergency fund!" },
];

const RewardsDisplay: React.FC = () => {
  // Define the handleChallenge function
  const handleChallenge = (tip: string) => {
    // Implement your logic here, e.g., alert the tip or update state
    alert(tip);
  };

  return (
    <Card className="bg-white p-4">
     
      <div className="space-y-6">
        <div className=" justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Achievements</h2>
            <p className="text-sm text-muted-foreground">
              Track your progress and earn rewards
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">1,250 points</span>
          </div>
        </div>

        <div className="grid gap-4">
          {mockBadges.map((badge) => {
            const IconComponent = iconMap[badge.icon];
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-4 p-4 border rounded-lg ${badge.earned ? "bg-gradient-to-r from-yellow-300 to-yellow-500" : "bg-white"}`}
              >
                <div
                  className={`p-2 rounded-full ${badge.earned ? "bg-primary/10 text-primary" : "bg-secondary/50 text-muted-foreground"}`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                    {badge.earned && (
                      <Badge variant="secondary" className="ml-2">
                        Earned
                      </Badge>
                    )}
                  </div>
                  {!badge.earned && (
                    <div className="space-y-1">
                      <Progress value={badge.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {badge.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Challenges Section */}
      <div className="p-6 bg-gradient-to-r from-pink-300 to-pink-500 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-white">Your Challenges</h3>
        <div className="space-y-4 mt-4">
          {aiInsights.map((insight, index) => (
            insight.isChallenge && (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-md">
                <span className="text-sm">{insight.tip}</span>
                <div className="flex items-center">
                  <button className="bg-white text-pink-500 border border-pink-500 rounded px-4 py-2 hover:bg-pink-500 hover:text-white transition" onClick={() => handleChallenge(insight.tip)}>
                    Do This Challenge
                  </button>
                  <CheckCircle className="h-5 w-5 text-yellow-500 ml-2" />
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      </div>
    </Card>
  );
};

export default RewardsDisplay;
