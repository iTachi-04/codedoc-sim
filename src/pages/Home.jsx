import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  Stethoscope, 
  Users, 
  Bot, 
  ArrowRight, 
  Activity,
  TrendingUp,
  Clock,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSimulationLogs } from "@/hooks/useSimulationLogs";
import { usePerformance } from "@/hooks/usePerformance";

const Home = () => {
  const { user, userRole } = useAuth();
  const { getRecentLogs } = useSimulationLogs();
  const { scores, getAverageScore, loading: scoresLoading } = usePerformance();
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      const logs = await getRecentLogs(5);
      setRecentActivity(logs);
      setActivityLoading(false);
    };
    loadActivity();
  }, []);

  const features = [
    {
      icon: Stethoscope,
      title: "Patient Cases",
      description: "Practice diagnostic skills with realistic medical scenarios",
      href: "/cases",
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      title: "Anatomy Viewer",
      description: "Explore 3D interactive human anatomy models",
      href: "/anatomy",
      color: "bg-purple-500",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get instant answers to your medical questions",
      href: "/assistant",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Profile",
      description: "Track your progress and view achievements",
      href: "/profile",
      color: "bg-orange-500",
    },
  ];

  const quickStats = [
    {
      label: "Cases Completed",
      value: scores.length,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Avg. Score",
      value: `${getAverageScore()}%`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Recent Sessions",
      value: recentActivity.length,
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl medical-gradient flex items-center justify-center animate-pulse-glow">
                <Stethoscope className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Medical Simulator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn Medicine Interactively — Master diagnosis through hands-on simulations,
            3D anatomy exploration, and AI-powered assistance.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-sm">
              {userRole === "instructor" ? "👨‍🏫 Instructor" : "🎓 Student"}
            </Badge>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {scoresLoading || activityLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Link to={feature.href} key={index}>
              <Card className="card-hover cursor-pointer h-full border-2 hover:border-primary smooth-transition">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="p-0 h-auto text-primary">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  No recent activity. Start a simulation!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{log.action.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.patient_cases?.title || "General Activity"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
              <CardDescription>Jump right into learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/cases">
                <Button className="w-full justify-between medical-gradient text-white">
                  Start Patient Simulation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/assistant">
                <Button variant="outline" className="w-full justify-between">
                  Ask AI Assistant
                  <Bot className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/anatomy">
                <Button variant="outline" className="w-full justify-between">
                  Explore Anatomy
                  <Brain className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
