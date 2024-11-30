import AvatarDisplay from "./financial-wellness/AvatarDisplay";
import MoodTracker from "./financial-wellness/MoodTracker";
import ProgressDashboard from "./financial-wellness/ProgressDashboard";
import ChatbotWidget from "./financial-wellness/ChatbotWidget";
import { Card } from "./ui/card";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
        <h1 className="text-xl font-semibold text-primary">
          Financial Wellness Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex justify-center py-8">
          <AvatarDisplay />
        </div>

        {/* Progress and Tracking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Mood Tracking */}
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Mood Tracking</h2>
            <MoodTracker />
          </Card>

          {/* Progress Dashboard */}
          <Card className="p-6 bg-white shadow-sm xl:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
            <ProgressDashboard />
          </Card>

          {/* AI Assistant */}
          <Card className="p-6 bg-white shadow-sm xl:col-span-3">
            <h2 className="text-lg font-semibold mb-4">
              AI Financial Assistant
            </h2>
            <div className="flex justify-center">
              <ChatbotWidget />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
