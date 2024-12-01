import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, Target } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  participants: number;
  daysLeft: number;
}

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Save $100 in 30 Days",
    description: "Join others in saving $100 this month!",
    targetAmount: 100,
    currentAmount: 65,
    participants: 24,
    daysLeft: 12,
  },
  {
    id: "2",
    title: "No-Spend Weekend",
    description: "Challenge yourself to a spending-free weekend",
    targetAmount: 0,
    currentAmount: 0,
    participants: 15,
    daysLeft: 3,
  },
];

const GroupChallenges = () => {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Group Challenges</h2>
          <p className="text-sm text-muted-foreground">
            Join others and achieve goals together
          </p>
        </div>
        <Button className="gap-2">
          <Trophy className="h-4 w-4" />
          View Leaderboard
        </Button>
      </div>

      <div className="space-y-6">
        {mockChallenges.map((challenge) => {
          const progress =
            challenge.targetAmount > 0
              ? (challenge.currentAmount / challenge.targetAmount) * 100
              : 0;

          return (
            <div
              key={challenge.id}
              className="border rounded-lg p-4 space-y-4"
              style={{
                backgroundColor: '#ecf87f', // Very light yellow background
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Join Challenge
                </Button>
              </div>

              {challenge.targetAmount > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Group Progress</span>
                    <span>
                      ${challenge.currentAmount} / ${challenge.targetAmount}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {challenge.participants} participants
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {challenge.daysLeft} days left
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GroupChallenges;
