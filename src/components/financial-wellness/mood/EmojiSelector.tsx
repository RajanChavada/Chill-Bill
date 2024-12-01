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

/*const defaultMoods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "stressed", emoji: "😫", label: "Stressed" },
];*/

const defaultMoods = [
  { id: "happy", link: "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Riley", label: "Happy" },
  { id: "neutral", link: "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Jack", label: "Neutral" },
  { id: "sad", link: "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Aidan", label: "Sad" },
  { id: "excited", link: "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=George", label: "Excited" },
  { id: "anxious", link: "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Oliver", label: "Anxious" },
  { id: "stressed", link: "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Destiny", label: "Stressed" }
]

const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  onMoodSelect = () => {},
  selectedMood = "https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Jack",
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
              {/*<span className="text-2xl" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>*/}
              <img src={mood.link} alt="avatar"></img>
              <span className="text-[10px] font-medium">{mood.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default EmojiSelector;
