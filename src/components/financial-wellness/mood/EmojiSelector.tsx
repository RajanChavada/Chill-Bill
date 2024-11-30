import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface EmojiSelectorProps {
  onMoodSelect?: (mood: string) => void;
  selectedMood?: string;
  moods?: Array<{
    id: string;
    emoji: string;
    label: string;
  }>;
}

useEffect(() => {

}, [])

const defaultMoods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "stressed", emoji: "😫", label: "Stressed" },
];

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  onMoodSelect = () => {},
  selectedMood = "neutral",
  moods = defaultMoods,
}) => {
  return (
    <div className="w-full bg-white rounded-lg p-4">
      <RadioGroup
        defaultValue={selectedMood}
        onValueChange={onMoodSelect}
        className="grid grid-cols-6 gap-2"
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
              className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-accent peer-checked:bg-accent peer-checked:text-accent-foreground cursor-pointer transition-all"
            >
              <span className="text-2xl" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>
              <span className="text-[10px] font-medium">{mood.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default EmojiSelector;
