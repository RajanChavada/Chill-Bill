// Types for spending items
export interface SpendingItem {
  description: string;
  amount: number;
}

// Types for daily data
export interface DailyData {
  spending: number;
  mood: string;
}

// Types for goals
export interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  category: string;
}

// Goals Storage
export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem("financial-goals", JSON.stringify(goals));
};

export const loadGoals = () => {
  const goals = localStorage.getItem("financial-goals");
  return goals ? JSON.parse(goals) : [];
};

// Daily Data Storage
export const saveDailyData = (date: string, data: DailyData) => {
  const allData = loadDailyData();
  allData[date] = data;
  localStorage.setItem("daily-data", JSON.stringify(allData));
};

export const loadDailyData = () => {
  const data = localStorage.getItem("daily-data");
  return data ? JSON.parse(data) : {};
};

// Spending Limits Storage
export const saveSpendingLimits = (limits: any) => {
  localStorage.setItem("spending-limits", JSON.stringify(limits));
};

export const loadSpendingLimits = () => {
  const limits = localStorage.getItem("spending-limits");
  return limits
    ? JSON.parse(limits)
    : {
        daily: 50,
        monthly: 1500,
      };
};

// User Preferences Storage
interface UserPreferences {
  hasCompletedQuestionnaire: boolean;
  preferredName?: string;
  userId?: string;
}

export const saveUserPreferences = (preferences: UserPreferences) => {
  localStorage.setItem("user-preferences", JSON.stringify(preferences));
};

export const loadUserPreferences = () => {
  const preferences = localStorage.getItem("user-preferences");
  return preferences ? JSON.parse(preferences) : null;
};
