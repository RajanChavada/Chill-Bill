import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Concern {
  id: string;
  text: string;
  stressLevel: number;
  tips: string[];
}

const mockConcerns: Concern[] = [
  {
    id: "1",
    text: "Worried about student loans",
    stressLevel: 8,
    tips: [
      "Consider income-driven repayment plans",
      "Look into loan forgiveness programs",
      "Create a dedicated loan repayment fund",
    ],
  },
  {
    id: "2",
    text: "Anxious about retirement savings",
    stressLevel: 6,
    tips: [
      "Start with small, regular contributions",
      "Take advantage of employer matching",
      "Consider a Roth IRA for tax benefits",
    ],
  },
];

const WORKER_URL = "https://financial-stress-ai.jimmychavada22.workers.dev";

const StressOMeter = () => {
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [newConcern, setNewConcern] = useState("");
  const [isAddingConcern, setIsAddingConcern] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const averageStress =
    concerns.reduce((sum, concern) => sum + concern.stressLevel, 0) /
    concerns.length;

  const generateAIResponse = async (concern: string) => {
    try {
      if (!WORKER_URL) {
        throw new Error('Worker URL is not configured');
      }

      console.log('Attempting to fetch from:', WORKER_URL);
      
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          concern: concern
        }),
      });

      console.log('Raw response:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Parsed response:', data);
      
      return {
        tips: data.result?.tips || [
          "Take deep breaths and assess your situation calmly",
          "Consider creating a detailed budget",
          "Consult with a financial advisor"
        ],
        stressLevel: data.result?.stressLevel || 5
      };
    } catch (error) {
      console.error('Error in generateAIResponse:', error);
      return {
        tips: [
          "Take deep breaths and assess your situation calmly",
          "Consider creating a detailed budget",
          "Consult with a financial advisor"
        ],
        stressLevel: 5
      };
    }
  };

  const handleAddConcern = async () => {
    if (newConcern.trim()) {
      setIsLoading(true);
      try {
        const aiResponse = await generateAIResponse(newConcern);
        
        const concern: Concern = {
          id: Date.now().toString(),
          text: newConcern,
          stressLevel: aiResponse.stressLevel,
          tips: aiResponse.tips,
        };
        
        setConcerns([...concerns, concern]);
        setNewConcern("");
        setIsAddingConcern(false);
      } catch (error) {
        console.error('Error in handleAddConcern:', error);
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
            <DialogContent aria-describedby="concern-dialog-description">
              <DialogHeader>
                <DialogTitle>Add Financial Concern</DialogTitle>
                <p id="concern-dialog-description" className="text-sm text-muted-foreground">
                  Share your financial concern and get AI-powered advice.
                </p>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="What's worrying you?"
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleAddConcern} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin">⚪</span>
                      Analyzing...
                    </div>
                  ) : (
                    'Add'
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
            // Add color based on stress level
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
                <Badge variant="secondary">{concern.stressLevel}/10</Badge>
              </div>

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StressOMeter;
