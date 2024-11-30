import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Brain, Lightbulb, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getFinancialInsights } from "@/lib/cloudflare";
import { loadDailyData } from "@/lib/store";
import { format } from "date-fns";

interface Concern {
  id: string;
  text: string;
  stressLevel: number;
  tips: string[];
  analysis?: string;
  suggestedActions?: string[];
}

const StressOMeter = () => {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [newConcern, setNewConcern] = useState("");
  const [isAddingConcern, setIsAddingConcern] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const averageStress =
    concerns.reduce((sum, concern) => sum + concern.stressLevel, 0) /
    (concerns.length || 1);

  const getCurrentMood = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const dailyData = loadDailyData();
    return dailyData[today]?.mood || "neutral";
  };

  const handleAddConcern = async () => {
    if (newConcern.trim()) {
      setIsLoading(true);
      try {
        const insights = await getFinancialInsights(
          newConcern,
          getCurrentMood(),
          averageStress,
        );

        const concern: Concern = {
          id: Date.now().toString(),
          text: newConcern,
          stressLevel: Math.round(averageStress),
          tips: insights.tips,
          analysis: insights.analysis,
          suggestedActions: insights.suggestedActions,
        };

        setConcerns([...concerns, concern]);
        setNewConcern("");
        setIsAddingConcern(false);
      } catch (error) {
        console.error("Error adding concern:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Financial Stress Monitor</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your financial anxiety
            </p>
          </div>
          <Dialog open={isAddingConcern} onOpenChange={setIsAddingConcern}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Concern
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Financial Concern</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="What's worrying you?"
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                />
                <Button
                  onClick={handleAddConcern}
                  className="w-full"
                  disabled={isLoading || !newConcern.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Add Concern"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Stress Level</span>
            <span>{Math.round(averageStress)}/10</span>
          </div>
          <Progress
            value={(averageStress / 10) * 100}
            className="h-2"
            style={{
              background: `hsl(${Math.max(0, 120 - averageStress * 12)}, 100%, 50%)`,
            }}
          />
        </div>

        <div className="space-y-4">
          {concerns.map((concern) => (
            <div key={concern.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="font-medium">{concern.text}</span>
                </div>
              </div>

              {concern.analysis && (
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {concern.analysis}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="h-4 w-4" />
                  <span>Helpful Tips:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                  {concern.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>

                {concern.suggestedActions && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-2">
                      Suggested Actions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {concern.suggestedActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StressOMeter;
