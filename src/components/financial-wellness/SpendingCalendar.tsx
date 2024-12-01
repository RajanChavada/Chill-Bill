import { useState,useEffect } from "react";
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
import { Settings, DollarSign } from "lucide-react";
import {
  loadSpendingLimits,
  saveSpendingLimits,
  loadDailyData,
  saveDailyData,
} from "@/lib/store";
import { createLinkToken, exchangePublicToken, fetchTransactions } from "@/lib/utils";
import { usePlaidLink } from "react-plaid-link";

interface DailyData {
  spending: number;
  mood: string;
}

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
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [bankAccountName, setBankAccountName] = useState<string | null>(null);


const handleCreateLinkToken = async () => {
  await createLinkToken();
};

const handleExchangePublicToken = async (publicToken: string) => {
  try {
    const data = await exchangePublicToken(publicToken);
    setAccessToken(data.access_token);
    console.log('Access Token:', data.access_token);
  } catch (error) {
    console.error('Error exchanging public token:', error);
  }
};
const handleFetchTransactions = async () => {
  if (accessToken) {
    const transactions = await fetchTransactions(accessToken);
    console.log('Transactions:', transactions);
  } else {
    console.error('Access token or selected account is not available');
  }
};
  // Calculate daily total for today
  const today = format(new Date(), "yyyy-MM-dd");
  const todayData = dailyData[today];
  const todaySpending = todayData?.spending || 0;
  const dailyProgress = (todaySpending / spendingLimits.daily) * 100;


  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const data = await createLinkToken();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };
    fetchLinkToken();
  }, []);

  const onSuccess = async (public_token: string, metadata: any) => {
    try {
      const data = await exchangePublicToken(public_token);
      setAccessToken(data.access_token);
      setBankAccountName(metadata.institution.name);
      console.log('Access Token:', data.access_token);
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };
  
  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });
  // Calculate monthly total

  const currentMonthTotal = Object.entries(dailyData)
    .filter(([date]) => date.startsWith(format(new Date(), "yyyy-MM")))
    .reduce((sum, [_, data]) => sum + data.spending, 0);

  const monthlyProgress = (currentMonthTotal / spendingLimits.monthly) * 100;

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

  const handleSaveAmount = () => {
    if (selectedDate && newAmount) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const data: DailyData = {
        spending: Number(newAmount),
        mood: "neutral",
      };
      saveDailyData(formattedDate, data);
      setDailyData(loadDailyData());
      setNewAmount("");
      setIsSpendingOpen(false);
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
        className={`w-full h-full flex flex-col items-center justify-center ${isOverLimit ? "bg-red-50" : "bg-green-50"}`}
      >
        <div className="text-lg font-medium">{date.getDate()}</div>
        <div className="text-sm font-medium">${data.spending}</div>
      </div>

    );
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
          <div className="flex space-x-2 mb-6">
            {bankAccountName ? (
              <div>{bankAccountName}</div>
            ) : (
              <Button onClick={() => open()} disabled={!ready}>Connect Bank Account</Button>
            )}
            <Button onClick={handleFetchTransactions}>Fetch Transactions</Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Daily Progress */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm font-medium">
            <span>Today's Spending</span>
            <span
              className={
                dailyProgress > 100 ? "text-destructive" : "text-primary"
              }
            >
              ${todaySpending.toLocaleString()} / $
              {spendingLimits.daily.toLocaleString()}
            </span>
          </div>
          <Progress
            value={dailyProgress}
            className="h-3 rounded-lg"
            style={{
              background:
                dailyProgress > 100 ? "var(--destructive)" : "var(--primary)",
            }}
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
            className="h-3 rounded-lg"
            style={{
              background:
                monthlyProgress > 100 ? "var(--destructive)" : "var(--primary)",
            }}
          />
        </div>
      </div>

      {/* Calendar */}
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
              How much did you spend on{" "}
              {selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""}?
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
            </div>

            <Button
              onClick={handleSaveAmount}
              className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]"
            >
              Save Amount
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
