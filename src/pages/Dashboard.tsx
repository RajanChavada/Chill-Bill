import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Target, Edit2, Trash2 } from "lucide-react";
import SpendingCalendar from "@/components/financial-wellness/SpendingCalendar";
import SpendingAnalysis from "@/components/financial-wellness/SpendingAnalysis";
import AvatarDisplay from "@/components/financial-wellness/AvatarDisplay";
import MoodTracker from "@/components/financial-wellness/MoodTracker";
import { loadGoals, saveGoals } from "@/lib/store";

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  category: string;
}

function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
  });

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        currentAmount: Number(newGoal.currentAmount) || 0,
        targetAmount: Number(newGoal.targetAmount),
        category: "Custom",
      };
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setNewGoal({ name: "", targetAmount: "", currentAmount: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditGoal = () => {
    if (selectedGoal && newGoal.name && newGoal.targetAmount) {
      const updatedGoals = goals.map((goal) => {
        if (goal.id === selectedGoal.id) {
          return {
            ...goal,
            name: newGoal.name,
            currentAmount: Number(newGoal.currentAmount),
            targetAmount: Number(newGoal.targetAmount),
          };
        }
        return goal;
      });
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setNewGoal({ name: "", targetAmount: "", currentAmount: "" });
      setSelectedGoal(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const openEditDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Avatar and Mood Section */}
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <AvatarDisplay />
        <div className="w-[300px]">
          <MoodTracker />
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Financial Goals</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Financial Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={newGoal.name}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, name: e.target.value })
                    }
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Current Amount ($)</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, currentAmount: e.target.value })
                    }
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount ($)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, targetAmount: e.target.value })
                    }
                    placeholder="5000"
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Add Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6 bg-white shadow-sm">
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">{goal.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        ${goal.currentAmount.toLocaleString()} / $
                        {goal.targetAmount.toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(goal)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Financial Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Goal Name</Label>
              <Input
                id="edit-name"
                value={newGoal.name}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-current">Current Amount ($)</Label>
              <Input
                id="edit-current"
                type="number"
                value={newGoal.currentAmount}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, currentAmount: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-target">Target Amount ($)</Label>
              <Input
                id="edit-target"
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, targetAmount: e.target.value })
                }
              />
            </div>
            <Button onClick={handleEditGoal} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spending Calendar */}
      <SpendingCalendar />

      {/* Spending Analysis */}
      <SpendingAnalysis />
    </div>
  );
}

export default Dashboard;
