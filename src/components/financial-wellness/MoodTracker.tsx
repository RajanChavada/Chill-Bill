import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth0 } from "@auth0/auth0-react";
import { loadUserPreferences } from "@/lib/store";
import EmojiSelector from "./mood/EmojiSelector";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
  selectedMood?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodSelect = () => {},
  selectedMood = "neutral",
}) => {
  const { user } = useAuth0();
  const preferences = loadUserPreferences();
  const displayName =
    preferences?.firstName || user?.name?.split(" ")[0] || "User";
  const [text, setText] = useState("");
  
  const getGreeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else if (hour >= 18 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  }, []);

  return (
    <h2 className="text-4xl font-semibold text-primary w-full flex justify-between items-center">
      <span className="flex-grow">
        {getGreeting}, {displayName}! 👋
      </span>
    </h2>
  );
};

export default MoodTracker;
