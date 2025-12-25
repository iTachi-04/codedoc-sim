import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Calendar, Award, TrendingUp, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePerformance } from "@/hooks/usePerformance";
import { useCases } from "@/hooks/useCases";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

const Profile = () => {
  const { user, userRole, signOut } = useAuth();
  const { scores, loading: scoresLoading } = usePerformance();
  const { cases } = useCases();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const completedCases = scores.length;
  const totalCases = cases.length || 10;
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) 
    : 0;

  const achievements = [
    { name: "First Diagnosis", icon: Award, earned: completedCases >= 1 },
    { name: "Perfect Score", icon: TrendingUp, earned: scores.some(s => s.score === 100) },
    { name: "Case Master", icon: BookOpen, earned: completedCases >= 5 },
  ];

  const recentScores = scores.slice(0, 5).map(score => {
    const patientCase = cases.find(c => c.id === score.case_id);
    return {
      name: patientCase?.title || "Unknown Case",
      score: score.score,
      date: format(new Date(score.created_at), "MMM d, yyyy"),
    };
  });

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Student";
  const joinDate = user?.created_at ? format(new Date(user.created_at), "MMMM yyyy") : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground text-lg">
            Track your learning progress and achievements
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="border-2 lg:col-span-1">
            <CardHeader>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full medical-gradient flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-center text-2xl">{userName}</CardTitle>
              <CardDescription className="text-center capitalize">
                {userRole || "Student"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {joinDate}</span>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Progress & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Progress */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your journey in medical education</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Cases Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {completedCases} / {totalCases}
                    </span>
                  </div>
                  <Progress value={(completedCases / totalCases) * 100} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary">{completedCases}</p>
                    <p className="text-sm text-muted-foreground mt-1">Cases Done</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-accent">{averageScore}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Avg Score</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-success">
                      {achievements.filter(a => a.earned).length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 text-center smooth-transition ${
                        achievement.earned
                          ? "border-primary bg-primary/5"
                          : "border-dashed border-muted-foreground/30 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          achievement.earned ? "medical-gradient" : "bg-muted"
                        }`}
                      >
                        <achievement.icon
                          className={`h-6 w-6 ${
                            achievement.earned ? "text-white" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <p className="text-sm font-medium">{achievement.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Cases */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Your latest diagnostic simulations</CardDescription>
              </CardHeader>
              <CardContent>
                {scoresLoading ? (
                  <p className="text-muted-foreground text-center py-4">Loading...</p>
                ) : recentScores.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No cases completed yet. Start a simulation to see your progress!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentScores.map((caseItem, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{caseItem.name}</p>
                          <p className="text-sm text-muted-foreground">{caseItem.date}</p>
                        </div>
                        <Badge
                          variant={
                            caseItem.score >= 80
                              ? "default"
                              : caseItem.score >= 60
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {caseItem.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
