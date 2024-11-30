import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import ChatMessages from "./chatbot/ChatMessages";
import ChatInput from "./chatbot/ChatInput";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: string;
}

interface ChatbotWidgetProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  initialMessages = [],
  onSendMessage = () => {},
  isLoading = false,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    onSendMessage(content);
  };

  return (
    <Card className="w-[350px] h-[500px] bg-white p-4 flex flex-col">
      <div className="flex-1 mb-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </Card>
  );
};

export default ChatbotWidget;
