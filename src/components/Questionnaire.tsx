import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { saveUserPreferences } from "@/lib/store";

interface QuestionnaireProps {
  onComplete: () => void;
}

const Questionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    monthlyIncome: "",
    savingsGoal: "",
    financialStress: 5,
    spendingHabits: "moderate",
    primaryGoal: "",
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      saveUserPreferences({
        ...answers,
        hasCompletedQuestionnaire: true,
      });
      onComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Monthly Income</h2>
            <div className="space-y-2">
              <Label>What is your monthly income?</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={answers.monthlyIncome}
                onChange={(e) =>
                  setAnswers({ ...answers, monthlyIncome: e.target.value })
                }
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Savings Goal</h2>
            <div className="space-y-2">
              <Label>What's your target savings goal?</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={answers.savingsGoal}
                onChange={(e) =>
                  setAnswers({ ...answers, savingsGoal: e.target.value })
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Financial Stress Level</h2>
            <div className="space-y-4">
              <Label>
                How would you rate your current financial stress level?
              </Label>
              <Slider
                value={[answers.financialStress]}
                onValueChange={(value) =>
                  setAnswers({ ...answers, financialStress: value[0] })
                }
                max={10}
                step={1}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Low Stress (1)</span>
                <span>High Stress (10)</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Spending Habits</h2>
            <div className="space-y-2">
              <Label>How would you describe your spending habits?</Label>
              <RadioGroup
                value={answers.spendingHabits}
                onValueChange={(value) =>
                  setAnswers({ ...answers, spendingHabits: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">Conservative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="liberal" id="liberal" />
                  <Label htmlFor="liberal">Liberal</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Primary Financial Goal</h2>
            <div className="space-y-2">
              <Label>What's your primary financial goal?</Label>
              <RadioGroup
                value={answers.primaryGoal}
                onValueChange={(value) =>
                  setAnswers({ ...answers, primaryGoal: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emergency_fund" id="emergency_fund" />
                  <Label htmlFor="emergency_fund">Build Emergency Fund</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debt_payoff" id="debt_payoff" />
                  <Label htmlFor="debt_payoff">Pay Off Debt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="investment" id="investment" />
                  <Label htmlFor="investment">Start Investing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="major_purchase" id="major_purchase" />
                  <Label htmlFor="major_purchase">
                    Save for Major Purchase
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[500px] p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Welcome to Financial Wellness
          </h1>
          <p className="text-muted-foreground">
            Let's get to know your financial situation better
          </p>
        </div>

        {renderStep()}

        <div className="flex justify-end">
          <Button onClick={handleNext}>
            {step === 5 ? "Complete" : "Next"}
          </Button>
        </div>

        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === step ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Questionnaire;
