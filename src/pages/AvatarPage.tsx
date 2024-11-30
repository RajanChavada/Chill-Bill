import AvatarDisplay from "@/components/financial-wellness/AvatarDisplay";
/*import MoodTracker from "@/components/financial-wellness/MoodTracker";*/
import { Card } from "@/components/ui/card";

function AvatarPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Avatar & Mood</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Avatar Section */}
        <div className="space-y-8">
          <Card className="p-8 bg-white shadow-sm flex justify-center">
            <AvatarDisplay />
          </Card>
        </div>

        {/* Mood Section */}
        <div className="space-y-8">
          <Card className="p-8 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Mood Tracking</h2>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AvatarPage;
