import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JournalEntryProps {
  onSubmit?: (entry: string) => void;
  defaultValue?: string;
  isSubmitting?: boolean;
}

const JournalEntry: React.FC<JournalEntryProps> = ({
  onSubmit = () => {},
  defaultValue = "",
  isSubmitting = false,
}) => {
  const [entry, setEntry] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim()) {
      onSubmit(entry);
      setEntry("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Share your thoughts about your financial journey..."
        className="min-h-[100px] resize-none"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !entry.trim()}
      >
        Save Entry
      </Button>
    </form>
  );
};

export default JournalEntry;
