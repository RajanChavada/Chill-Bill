import ChatbotWidget from "@/components/financial-wellness/ChatbotWidget";
import { Card } from "@/components/ui/card";

function AssistantPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">AI Financial Assistant</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="p-8 bg-white shadow-sm">
          <ChatbotWidget />
        </Card>
      </div>
    </div>
  );
}

export default AssistantPage;
