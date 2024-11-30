import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import AvatarCustomization from "./avatar/AvatarCustomization";
import MoodTracker from "./MoodTracker";

interface AvatarDisplayProps {
  level?: number;
  mood?: string;
  achievements?: string[];
  onCustomize?: () => void;
}

// Define mood options with color palettes
const moodOptions = [
  { emoji: '😊', label: 'Very Happy', positiveColor: 'bg-green-200', negativeColor: 'bg-red-200' },
  { emoji: '🙂', label: 'Good', positiveColor: 'bg-blue-200', negativeColor: 'bg-yellow-200' },
  { emoji: '😐', label: 'Neutral', positiveColor: 'bg-gray-200', negativeColor: 'bg-gray-400' },
  { emoji: '😕', label: 'Sad', positiveColor: 'bg-yellow-200', negativeColor: 'bg-red-300' },
  { emoji: '😫', label: 'Stressed', positiveColor: 'bg-red-300', negativeColor: 'bg-red-500' },
] as const;

const defaultAchievements = [
  "Savings Starter",
  "Budget Master",
  "Mood Tracker",
];

// Use static emoji instead of Lottie animations for now
const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😕',
  excited: '🤗',
  anxious: '😰',
  stressed: '😫',
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  mood = "😐",
  achievements = defaultAchievements,
  onCustomize = () => {},
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);
  const [selectedMood, setSelectedMood] = useState<string>(moodOptions[2].emoji);

  // Handle mood selection with animation and color change
  const handleMoodSelect = (emoji: string) => {
    setSelectedMood(emoji);
    setCurrentMood(emoji);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <MoodTracker />
      <h1 className="text-2xl">How are you feeling?</h1>
      {/* Simplified Avatar Display */}
      <div className="w-48 h-48 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood}
            initial={{ 
              scale: 0.5, 
              opacity: 0, 
              rotate: -180 
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0 
            }}
            exit={{ 
              scale: 0.5, 
              opacity: 0, 
              rotate: 180 
            }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="text-6xl"
          >
            {currentMood}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mood Selection Grid */}
      <div className="text-center w-full max-w-md">
        <div className="grid grid-cols-5 gap-3">
          {moodOptions.map(({ emoji, label }) => (
            <motion.button
              key={emoji}
              onClick={() => handleMoodSelect(emoji)}
              className={`
                p-4 rounded-xl transition-all
                ${selectedMood === emoji ? 'bg-transparent' : 'bg-transparent'}
                flex flex-col items-center gap-2
                shadow-md hover:shadow-lg
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: selectedMood === emoji ? 1.1 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
              }}
              title={label}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      {/*
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-48 shadow-md hover:shadow-lg transition-all"
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
      </motion.div>
      */}
      {/* Achievements */}
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">
            Recent Achievements
          </h3>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <motion.span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {achievement}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarDisplay;
