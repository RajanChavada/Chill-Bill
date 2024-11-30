import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, PiggyBank, Brain, TrendingUp } from "lucide-react";

function LandingPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Financial Wellness & Mental Health
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Track your financial goals while maintaining your mental well-being
          </p>
          <Button
            size="lg"
            onClick={() => loginWithRedirect()}
            className="bg-white text-primary hover:bg-white/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <PiggyBank className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Financial Goal Tracking
              </h3>
              <p className="text-muted-foreground">
                Set and track your financial goals with interactive progress
                monitoring
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Mental Health Integration
              </h3>
              <p className="text-muted-foreground">
                Monitor how your financial decisions impact your mental
                well-being
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Spending Analysis</h3>
              <p className="text-muted-foreground">
                Analyze your spending patterns and their correlation with stress
                levels
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
