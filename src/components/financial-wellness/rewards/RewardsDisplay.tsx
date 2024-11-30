import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Award, Target } from "lucide-react";

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
];

const iconMap = {
  trophy: Trophy,
  star: Star,
  award: Award,
  target: Target,
};

const RewardsDisplay = () => {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
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
                className="flex items-start gap-4 p-4 border rounded-lg"
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
      </div>
    </Card>
  );
};

export default RewardsDisplay;
