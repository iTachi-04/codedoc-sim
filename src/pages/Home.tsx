import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, BookOpen, Brain, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: "Patient Cases",
      description: "Practice diagnostic skills with real-world scenarios",
      action: () => navigate("/cases"),
    },
    {
      icon: BookOpen,
      title: "3D Anatomy",
      description: "Explore human anatomy in interactive 3D",
      action: () => navigate("/anatomy"),
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get instant answers to medical questions",
      action: () => navigate("/assistant"),
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey and achievements",
      action: () => navigate("/profile"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto medical-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">CM</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Medical Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn Medicine Interactively — Master diagnosis through hands-on simulations,
            explore 3D anatomy, and get AI-powered insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="card-hover cursor-pointer border-2 hover:border-primary"
              onClick={feature.action}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg medical-gradient flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Start Section */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to Start Learning?</h3>
                <p className="text-muted-foreground">
                  Begin your medical education journey with interactive patient cases
                </p>
              </div>
              <Button
                size="lg"
                className="medical-gradient text-white hover:opacity-90 smooth-transition shadow-lg"
                onClick={() => navigate("/cases")}
              >
                Start First Case
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
