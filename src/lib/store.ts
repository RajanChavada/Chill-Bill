// Financial Goals Storage
export const saveGoals = (goals: any[]) => {
  localStorage.setItem("financial-goals", JSON.stringify(goals));
};

export const loadGoals = () => {
  const goals = localStorage.getItem("financial-goals");
  return goals ? JSON.parse(goals) : [];
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

// Daily Spending and Mood Storage
export interface SpendingItem {
  description: string;
  amount: number;
}

export interface DailyData {
  spending: number;
  items: SpendingItem[];
  mood: string;
  notes?: string;
}

export const saveDailyData = (date: string, data: DailyData) => {
  const allData = loadDailyData();
  allData[date] = data;
  localStorage.setItem("daily-data", JSON.stringify(allData));
};

export const loadDailyData = () => {
  const data = localStorage.getItem("daily-data");
  return data ? JSON.parse(data) : {};
};

// User Preferences Storage
export const saveUserPreferences = (preferences: any) => {
  localStorage.setItem("user-preferences", JSON.stringify(preferences));
};

export const loadUserPreferences = () => {
  const preferences = localStorage.getItem("user-preferences");
  return preferences ? JSON.parse(preferences) : null;
};
