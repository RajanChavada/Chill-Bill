import { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import MainLayout from "./components/layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loadUserPreferences, saveUserPreferences } from "./lib/store";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const preferences = loadUserPreferences();
      if (!preferences?.hasCompletedQuestionnaire) {
        setShowQuestionnaire(true);
      }
    }
  }, [isAuthenticated]);

  const handleQuestionnaireSubmit = () => {
    if (firstName.trim()) {
      saveUserPreferences({
        hasCompletedQuestionnaire: true,
        firstName: firstName.trim(),
        userId: user?.sub,
      });
      setShowQuestionnaire(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">
                Welcome to Chill Bill!
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Let's get to know you better
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-base">
                  What's your first name?
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="text-lg h-12"
                  autoFocus
                />
              </div>
              <Button 
                onClick={handleQuestionnaireSubmit}
                className="w-full h-12 text-lg font-medium transition-all"
                disabled={!firstName.trim()}
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </MainLayout>
      </Suspense>
    </div>
  );
}

export default App;
