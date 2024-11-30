import ProgressDashboard from "@/components/financial-wellness/ProgressDashboard";
import GoalsOverview from "@/components/financial-wellness/progress/GoalsOverview";
import MoodTrends from "@/components/financial-wellness/progress/MoodTrends";
import { Card } from "@/components/ui/card";

function GoalsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Financial Goals</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Goals Overview */}
        <Card className="p-8 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Goals Overview</h2>
          <GoalsOverview />
        </Card>

        {/* Mood Trends */}
        <Card className="p-8 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Mood Trends</h2>
          <MoodTrends />
        </Card>

        {/* Progress Dashboard */}
        <Card className="p-8 bg-white shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold mb-6">Detailed Progress</h2>
          <ProgressDashboard />
        </Card>
      </div>
    </div>
  );
}

export default GoalsPage;
