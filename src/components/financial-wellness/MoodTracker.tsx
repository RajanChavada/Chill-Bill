import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth0 } from "@auth0/auth0-react";
import { loadUserPreferences } from "@/lib/store";
import EmojiSelector from "./mood/EmojiSelector";

interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
  selectedMood?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
<<<<<<< HEAD
  onMoodSelect = () => {},
=======
  onMoodSelect = () => { },
  onJournalSubmit = () => { },
>>>>>>> e34969c750fa7d27350f5d90875322fce5fd3629
  selectedMood = "neutral",
}) => {
  const { user } = useAuth0();
  const preferences = loadUserPreferences();
  const displayName =
    preferences?.firstName || user?.name?.split(" ")[0] || "User";

  const getGreeting = () => {
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
  };

  return (
<<<<<<< HEAD
    <Card className="w-[400px] bg-white p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">
          {getGreeting()}, {displayName}!
        </h2>
        <Label className="text-lg font-medium block">
=======
    <Card className="w-[325px] h-[300px] bg-white p-5 space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">
>>>>>>> e34969c750fa7d27350f5d90875322fce5fd3629
          How are you feeling?
        </Label>
      </div>
      <EmojiSelector onMoodSelect={onMoodSelect} selectedMood={selectedMood} />
    </Card>
  );
};

export default MoodTracker;
