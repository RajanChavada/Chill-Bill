import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Settings } from "lucide-react";
import Lottie from "lottie-react";
import AvatarCustomization from "./avatar/AvatarCustomization";

interface AvatarDisplayProps {
  level?: number;
  mood?: string;
  achievements?: string[];
  onCustomize?: () => void;
}

const defaultAchievements = [
  "Savings Starter",
  "Budget Master",
  "Mood Tracker",
];

// Animation JSON files for different moods
const moodAnimations = {
  happy: "https://assets2.lottiefiles.com/packages/lf20_ydo1amjm.json",
  neutral: "https://assets3.lottiefiles.com/packages/lf20_yzoqyyqf.json",
  sad: "https://assets3.lottiefiles.com/packages/lf20_wdqlqkhq.json",
  excited: "https://assets3.lottiefiles.com/packages/lf20_qdbb21wb.json",
  anxious: "https://assets3.lottiefiles.com/packages/lf20_dep5n5xt.json",
  stressed: "https://assets3.lottiefiles.com/packages/lf20_ky24lqwm.json",
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  level = 1,
  mood = "neutral",
  achievements = defaultAchievements,
  onCustomize = () => {},
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setCurrentMood(mood);
    // Load animation data based on mood
    fetch(
      moodAnimations[mood as keyof typeof moodAnimations] ||
        moodAnimations.neutral,
    )
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, [mood]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Avatar */}
      <div className="relative w-48 h-48">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        )}
        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 mr-1" />
          <span className="text-sm font-bold">{level}</span>
        </div>
      </div>

      {/* Mood Indicator */}
      <div className="text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Current Mood:{" "}
          {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
        </p>
      </div>

      {/* Customize Button */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-48"
            onClick={() => onCustomize()}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize Avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AvatarCustomization
            onFeatureSelect={(category, featureId) => {
              console.log("Selected:", category, featureId);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarDisplay;
