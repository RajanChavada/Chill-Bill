import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarBase } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Settings, DollarSign } from "lucide-react";
import {
  loadSpendingLimits,
  saveSpendingLimits,
  loadDailyData,
  saveDailyData,
  DailyData,
} from "@/lib/store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SpendingCalendarProps {}

const moods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "stressed", emoji: "😫", label: "Stressed" },
];

const Calendar = CalendarBase as any;

const SpendingCalendar: React.FC<SpendingCalendarProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [spendingLimits, setSpendingLimits] = useState(loadSpendingLimits());
  const [dailyData, setDailyData] = useState(loadDailyData());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpendingOpen, setIsSpendingOpen] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [newLimits, setNewLimits] = useState(spendingLimits);

  // Calculate monthly total
  const currentMonthTotal = Object.entries(dailyData)
    .filter(([date]) => date.startsWith(format(new Date(), "yyyy-MM")))
    .reduce((sum, [_, data]) => sum + (data as DailyData).spending, 0);

  const monthlyProgress = (currentMonthTotal / spendingLimits.monthly) * 100;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const data = dailyData[formattedDate] as DailyData;
      if (data) {
        setNewAmount(data.spending.toString());
        setSelectedMood(data.mood);
      } else {
        setNewAmount("");
        setSelectedMood("neutral");
      }
      setIsSpendingOpen(true);
    }
  };

  const handleSaveData = () => {
    if (selectedDate && newAmount) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const data: DailyData = {
        spending: Number(newAmount),
        mood: selectedMood,
      };
      saveDailyData(formattedDate, data);
      setDailyData(loadDailyData());
      setNewAmount("");
      setSelectedMood("neutral");
      setIsSpendingOpen(false);
    }
  };

  const handleUpdateLimits = () => {
    setSpendingLimits(newLimits);
    saveSpendingLimits(newLimits);
    setIsSettingsOpen(false);
  };

  const renderDay = (day: Date) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    const data = dailyData[formattedDate] as DailyData;
    if (!data) return null;

    const mood = moods.find((m) => m.id === data.mood);
    const isOverLimit = data.spending > spendingLimits.daily;

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center ${isOverLimit ? "bg-red-50" : "bg-green-50"} p-1`}
      >
        <div className="text-xs font-medium">${data.spending}</div>
        <div className="text-lg">{mood?.emoji}</div>
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm w-full">
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Spending Calendar</h2>
            <p className="text-sm text-muted-foreground">
              Daily limit: ${spendingLimits.daily} | Monthly limit: $
              {spendingLimits.monthly}
            </p>
          </div>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Spending Limits</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Daily Limit ($)</Label>
                  <Input
                    type="number"
                    value={newLimits.daily}
                    onChange={(e) =>
                      setNewLimits({
                        ...newLimits,
                        daily: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Limit ($)</Label>
                  <Input
                    type="number"
                    value={newLimits.monthly}
                    onChange={(e) =>
                      setNewLimits({
                        ...newLimits,
                        monthly: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <Button onClick={handleUpdateLimits} className="w-full">
                  Save Limits
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly Progress</span>
            <span>
              ${currentMonthTotal} / ${spendingLimits.monthly}
            </span>
          </div>
          <Progress value={monthlyProgress} className="h-2" />
        </div>
      </div>

      <div className="p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="w-full"
          classNames={{
            months: "w-full",
            month: "w-full",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell:
              "w-[14.28%] h-10 flex items-center justify-center text-sm font-medium",
            row: "flex w-full mt-2",
            cell: "w-[14.28%] h-24 relative p-0 border border-border hover:bg-accent hover:text-accent-foreground focus-within:relative focus-within:z-20",
            day: "w-full h-full p-0",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "rounded-none",
            day_hidden: "invisible",
          }}
          components={{
            Day: ({ date, ...props }) => {
              const content = renderDay(date);
              return (
                <button {...props} className="w-full h-full">
                  {content || date.getDate()}
                </button>
              );
            },
          }}
        />
      </div>

      <Dialog open={isSpendingOpen} onOpenChange={setIsSpendingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Add Daily Data for{" "}
              {selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>Amount Spent ($)</Label>
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label>How are you feeling?</Label>
              <RadioGroup
                value={selectedMood}
                onValueChange={setSelectedMood}
                className="grid grid-cols-3 gap-2"
              >
                {moods.map((mood) => (
                  <div key={mood.id} className="text-center">
                    <RadioGroupItem
                      value={mood.id}
                      id={mood.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={mood.id}
                      className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-accent peer-checked:bg-accent peer-checked:text-accent-foreground cursor-pointer"
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button onClick={handleSaveData} className="w-full">
              Save Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SpendingCalendar;
