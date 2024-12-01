import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Settings, DollarSign, Trophy, CheckCircle } from "lucide-react";
import {
  loadSpendingLimits,
  saveSpendingLimits,
  loadDailyData,
  saveDailyData,
} from "@/lib/store";
import {
  createLinkToken,
  exchangePublicToken,
  fetchTransactions,
} from "@/lib/utils";
import { usePlaidLink } from "react-plaid-link";

interface DailyData {
  spending: number;
  mood: "😊" | "🙂" | "😐" | "😕" | "😫";
  anxietyLevel: number;
}

const moodOptions = [
  { emoji: "😊", label: "Very Calm", anxietyLevel: 1 },
  { emoji: "🙂", label: "Relaxed", anxietyLevel: 3 },
  { emoji: "😐", label: "Neutral", anxietyLevel: 5 },
  { emoji: "😕", label: "Anxious", anxietyLevel: 7 },
  { emoji: "😫", label: "Very Anxious", anxietyLevel: 9 },
] as const;

const aiInsights = [
  {
    tip: "Set a weekly budget and stick to it.",
    isChallenge: false,
  },
  {
    tip: "Use cash for discretionary spending to limit overspending.",
    isChallenge: true,
  },
  {
    tip: "Track your spending daily to identify patterns.",
    isChallenge: false,
  },
  {
    tip: "Challenge yourself to skip one unnecessary purchase this week.",
    isChallenge: true,
  },
  {
    tip: "Consider meal prepping to save on food costs.",
    isChallenge: false,
  },
  {
    tip: "Use student discounts at local stores like Aritzia and Lululemon.",
    isChallenge: false,
  },
  {
    tip: "Take advantage of seasonal sales and promotions.",
    isChallenge: false,
  },
  {
    tip: "Set aside a small amount each week for unexpected expenses.",
    isChallenge: false,
  },
  {
    tip: "Use budgeting apps to track your spending effectively.",
    isChallenge: false,
  },
  {
    tip: "Plan your shopping trips to avoid impulse buys.",
    isChallenge: true,
  },
  // Additional challenges
  {
    tip: "Try a no-spend day once a week.",
    isChallenge: true,
  },
  {
    tip: "Save your spare change in a jar.",
    isChallenge: true,
  },
  {
    tip: "Limit dining out to once a week.",
    isChallenge: true,
  },
];

export default function SpendingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [spendingLimits, setSpendingLimits] = useState(loadSpendingLimits());
  const [dailyData, setDailyData] =
    useState<Record<string, DailyData>>(loadDailyData());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpendingOpen, setIsSpendingOpen] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newLimits, setNewLimits] = useState(spendingLimits);

  const [selectedMood, setSelectedMood] = useState<DailyData['mood']>('😐');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [achievementMessage, setAchievementMessage] = useState<string | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);


  // Calculate daily total for today
  const today = format(new Date(), "yyyy-MM-dd");
  const todayData = dailyData[today];
  const todaySpending = todayData?.spending || 0;
  const dailyProgress = (todaySpending / spendingLimits.daily) * 100;

  // Calculate monthly total
  const currentMonthTotal = Object.entries(dailyData)
    .filter(([date]) => date.startsWith(format(new Date(), "yyyy-MM")))
    .reduce((sum, [_, data]) => sum + data.spending, 0);

  const monthlyProgress = (currentMonthTotal / spendingLimits.monthly) * 100;

  const handleCreateLinkToken = async () => {
    await createLinkToken();
  };

  const handleExchangePublicToken = async (publicToken: string) => {
    try {
      const data = await exchangePublicToken(publicToken);
      setAccessToken(data.access_token);
      console.log("Access Token:", data.access_token);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  const handleFetchTransactions = async () => {
    if (accessToken) {
      try {
        setIsProcessingTransactions(true);
        console.log("Fetching transactions...");
        const transactionData = await fetchTransactions(accessToken);
        console.log("Received transaction data:", transactionData);

        // Get existing data
        const existingData = { ...loadDailyData() };
        console.log("Existing data:", existingData);

        // Process transactions and merge with existing data
        if (transactionData?.transactions) {
          transactionData.transactions.forEach((transaction) => {
            console.log("Processing transaction:", transaction);
            const date = transaction.authorized_date;
            if (date) {
              if (!existingData[date]) {
                existingData[date] = {
                  spending: 0,
                  mood: "😐",
                  anxietyLevel: 5,
                };
              }
              // Add to the spending amount for that date
              existingData[date].spending += Math.abs(transaction.amount);
              console.log(`Updated data for ${date}:`, existingData[date]);
            }
          });

          // Save merged data and refresh calendar
          console.log("Final data to save:", existingData);
          Object.entries(existingData).forEach(([date, data]) => {
            saveDailyData(date, data);
          });
          setDailyData(existingData);
        } else {
          console.error("No transactions found in response");
        }
      } catch (error) {
        console.error("Error processing transactions:", error);
      } finally {
        setIsProcessingTransactions(false);
      }
    } else {
      console.error("Access token or selected account is not available");
    }
  };

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const data = await createLinkToken();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, []);

  const onSuccess = async (public_token: string, metadata: any) => {
    try {
      const data = await exchangePublicToken(public_token);
      setAccessToken(data.access_token);
      setBankAccountName(metadata.institution.name);
      console.log("Access Token:", data.access_token);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });

  const getProgressBarColor = (progress: number) => {
    if (progress < 50) return "bg-green-500";
    if (progress < 100) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const data = dailyData[formattedDate];
      if (data) {
        setNewAmount(data.spending.toString());
      } else {
        setNewAmount("");
      }
      setIsSpendingOpen(true);
    }
  };

  const fetchRandomTip = async () => {
    try {
      const response = await fetch("https://your-ai-worker-url.com/get-tip"); // Replace with your actual endpoint
      if (!response.ok) throw new Error('Failed to fetch tip');
      const data = await response.json();
      setAiTip(data.tip); // Assuming the response contains a 'tip' field
    } catch (error) {
      console.error('Error fetching AI tip:', error);
      setAiTip("Stay mindful of your spending!"); // Fallback tip
    }
  };

  const handleSaveAmount = () => {
    if (selectedDate && newAmount) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const selectedMoodData = moodOptions.find(
        (m) => m.emoji === selectedMood,
      )!;

      const data: DailyData = {
        spending: Number(newAmount),
        mood: selectedMood,
        anxietyLevel: selectedMoodData.anxietyLevel,
      };

      saveDailyData(formattedDate, data);
      setDailyData(loadDailyData());
      setNewAmount("");
      setSelectedMood("😐");
      setIsSpendingOpen(false);

      // Check spending against limits
      const todaySpending = data.spending;
      const dailyLimit = spendingLimits.daily;

      if (todaySpending < dailyLimit) {
        setAchievementMessage("Great job! You're under budget! 🎉");
        setRewardPoints(prev => prev + 10); // Reward points for staying under budget
        setAiTip(null); // Clear AI tip
      } else if (todaySpending > dailyLimit) {
        setAchievementMessage("Oops! You've exceeded your budget. 😢");
        setRewardPoints(prev => prev - 5); // Deduct points for exceeding budget
        fetchRandomTip(); // Fetch a random tip when exceeding budget
      } else {
        setAchievementMessage("You've met your budget! Keep it up! 🏆");
        setRewardPoints(prev => prev + 5); // Reward points for meeting the budget
        setAiTip(null); // Clear AI tip
      }
    }
  };

  const handleUpdateLimits = () => {
    setSpendingLimits(newLimits);
    saveSpendingLimits(newLimits);
    setIsSettingsOpen(false);
  };

  const renderDay = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const data = dailyData[formattedDate];
    if (!data) return date.getDate();

    const isOverLimit = data.spending > spendingLimits.daily;

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center ${
          isOverLimit ? "bg-red-50" : "bg-green-50"
        }`}
      >
        <div className="text-lg font-medium">{date.getDate()}</div>
        <div className="text-sm font-medium">${data.spending}</div>
        <div className="text-xl mt-1">{data.mood}</div>
      </div>
    );
  };

  const handleChallenge = (tip: string) => {
    // Logic to handle the challenge, e.g., mark it as completed or log it
    console.log(`Challenge accepted: ${tip}`);
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl w-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-primary">
              Spending Calendar
            </h2>
            <p className="text-sm text-muted-foreground">
              Daily limit: ${spendingLimits.daily.toLocaleString()} | Monthly
              limit: ${spendingLimits.monthly.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-2">
            {bankAccountName ? (
              <div>{bankAccountName}</div>
            ) : (
              <Button
                onClick={() => open()}
                disabled={!ready || isProcessingTransactions}
              >
                Connect Bank Account
              </Button>
            )}
            <Button
              onClick={handleFetchTransactions}
              disabled={!accessToken || isProcessingTransactions}
            >
              {isProcessingTransactions
                ? "Processing..."
                : "Fetch Transactions"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm font-medium">
            <span>Today's Spending</span>
            <span
              className={
                todaySpending > spendingLimits.daily
                  ? "text-destructive"
                  : "text-primary"
              }
            >
              ${todaySpending.toLocaleString()} / $
              {spendingLimits.daily.toLocaleString()}
            </span>
          </div>
          <Progress
            value={dailyProgress}
            className={`h-2 ${getProgressBarColor(dailyProgress)}`}
          />
        </div>

        {/* Monthly Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span>Monthly Progress</span>
            <span
              className={
                monthlyProgress > 100 ? "text-destructive" : "text-primary"
              }
            >
              ${currentMonthTotal.toLocaleString()} / $
              {spendingLimits.monthly.toLocaleString()}
            </span>
          </div>
          <Progress
            value={monthlyProgress}
            className={`h-2 ${getProgressBarColor(monthlyProgress)}`}
          />
        </div>
      </div>

      {/* Achievement Notification */}
      {achievementMessage && (
        <div
          className={`flex items-center justify-between p-4 rounded-lg mb-4 ${
            dailyData[format(selectedDate, "yyyy-MM-dd")]?.spending > spendingLimits.daily ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
          }`}
        >
          <div className="flex items-center">
            {dailyData[format(selectedDate, "yyyy-MM-dd")]?.spending > spendingLimits.daily ? (
              <span className="h-6 w-6 text-red-500 mr-2">❗</span> // Red exclamation mark when over limit
            ) : (
              <span className="h-6 w-6 text-yellow-500 mr-2">🏆</span> // Trophy icon only if within limit
            )}
            <span className="text-sm font-medium">{achievementMessage}</span>
          </div>
          <span className="text-sm font-medium">Current Amount: ${dailyData[format(selectedDate, "yyyy-MM-dd")]?.spending}</span>
        </div>
      )}

      {/* Display AI Tip if available */}
      {aiTip && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg mb-4">
          <p className="text-sm text-red-600">{aiTip}</p>
        </div>
      )}

      

      {/* Daily Progress and Calendar */}
      <div className="p-6">
        <style>
          {`
            .rdp {
              --rdp-cell-size: 100px !important;
              margin: 0;
              width: 100%;
            }
            .rdp-table {
              width: 100%;
              max-width: none;
            }
            .rdp-caption {
              padding: 0 0 24px 0;
            }
            .rdp-cell {
              height: 100px;
              width: calc(100% / 7);
            }
            .rdp-head_cell {
              height: 40px;
              font-weight: 500;
              color: var(--muted-foreground);
            }
            .rdp-day {
              width: 100%;
              height: 100%;
              border-radius: 0;
              font-size: 1rem;
              cursor: pointer;
            }
          `}
        </style>
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
            Day: ({ date }) => (
              <button
                onClick={() => handleDateSelect(date)}
                className="w-full h-full transition-colors hover:bg-accent/10"
              >
                {renderDay(date)}
              </button>
            ),
          }}
        />
      </div>

      {/* Daily Spending Dialog */}
      <Dialog open={isSpendingOpen} onOpenChange={setIsSpendingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Add your spending for{" "}
              {selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-center text-2xl h-16 font-medium"
              />

              <div className="space-y-2">
                <Label className="text-center block">
                  How anxious do you feel about this spending?
                </Label>
                <div className="flex justify-center gap-4">
                  {moodOptions.map(({ emoji, label }) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedMood(emoji)}
                      className={`p-3 text-2xl rounded-full transition-all ${
                        selectedMood === emoji
                          ? "bg-accent scale-110"
                          : "hover:bg-accent/50"
                      }`}
                      title={label}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveAmount}
              className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]"
              disabled={!newAmount || !selectedMood}
            >
              Save Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Spending Limits
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="font-medium">Daily Limit ($)</Label>
              <Input
                type="number"
                value={newLimits.daily}
                onChange={(e) =>
                  setNewLimits({ ...newLimits, daily: Number(e.target.value) })
                }
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Monthly Limit ($)</Label>
              <Input
                type="number"
                value={newLimits.monthly}
                onChange={(e) =>
                  setNewLimits({
                    ...newLimits,
                    monthly: Number(e.target.value),
                  })
                }
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleUpdateLimits}
              className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]"
            >
              Save Limits
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
