import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import EmojiSelector from "./mood/EmojiSelector";
import JournalEntry from "./mood/JournalEntry";

interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
  onJournalSubmit?: (entry: string) => void;
  selectedMood?: string;
  defaultJournalEntry?: string;
  isSubmitting?: boolean;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodSelect = () => { },
  onJournalSubmit = () => { },
  selectedMood = "neutral",
  defaultJournalEntry = "",
  isSubmitting = false,
}) => {
  return (
    <Card className="w-[325px] h-[300px] bg-white p-5 space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">
          How are you feeling?
        </Label>
        <EmojiSelector
          onMoodSelect={onMoodSelect}
          selectedMood={selectedMood}
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Tell us more</Label>
        <JournalEntry
          onSubmit={onJournalSubmit}
          defaultValue={defaultJournalEntry}
          isSubmitting={isSubmitting}
        />
      </div>
    </Card>
  );
};

export default MoodTracker;
