import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages?: Message[];
  isLoading?: boolean;
}

const defaultMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content:
      "Hi! I'm your financial wellness assistant. How can I help you today?",
    timestamp: "9:00 AM",
  },
  {
    id: "2",
    type: "user",
    content: "I'm worried about my spending habits.",
    timestamp: "9:01 AM",
  },
  {
    id: "3",
    type: "bot",
    content:
      "I understand your concern. Let's look at your recent spending patterns and find ways to help you feel more confident about your finances.",
    timestamp: "9:01 AM",
  },
];

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages = defaultMessages,
  isLoading = false,
}) => {
  return (
    <Card className="w-[330px] h-[400px] bg-white p-4">
      <ScrollArea className="h-full pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar
                className={`w-8 h-8 ${message.type === "bot" ? "bg-primary" : "bg-secondary"}`}
              >
                {message.type === "bot" ? (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <User className="w-4 h-4 text-secondary-foreground" />
                )}
              </Avatar>
              <div
                className={`flex-1 rounded-lg p-3 text-sm ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-primary">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </Avatar>
              <div className="flex-1 rounded-lg p-3 bg-secondary">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-secondary-foreground/50 rounded-full"></div>
                  <div className="h-2 w-2 bg-secondary-foreground/50 rounded-full"></div>
                  <div className="h-2 w-2 bg-secondary-foreground/50 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChatMessages;
