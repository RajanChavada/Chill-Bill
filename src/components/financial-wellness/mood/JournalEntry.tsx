import React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface JournalEntryProps {
  onSubmit?: (entry: string) => void;
  defaultValue?: string;
  placeholder?: string;
  isSubmitting?: boolean;
}

const JournalEntry: React.FC<JournalEntryProps> = ({
  onSubmit = () => {},
  defaultValue = "",
  placeholder = "How are you feeling about your finances today?",
  isSubmitting = false,
}) => {
  const [entry, setEntry] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(entry);
  };

  return (
    <Card className="w-[280px] h-[100px] bg-white p-4">
      <form onSubmit={handleSubmit} className="h-full flex flex-col gap-2">
        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder={placeholder}
          className="flex-1 resize-none text-sm"
        />
        <Button
          type="submit"
          size="sm"
          className="self-end"
          disabled={isSubmitting || !entry.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Save Entry
        </Button>
      </form>
    </Card>
  );
};

export default JournalEntry;
