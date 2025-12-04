import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Thermometer, Activity, ArrowRight, Plus, Loader2 } from "lucide-react";
import { CaseSimulation } from "@/components/CaseSimulation";
import { useCases, PatientCase } from "@/hooks/useCases";
import { useAuth } from "@/hooks/useAuth";
import { CaseFormDialog } from "@/components/CaseFormDialog";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Thermometer,
  Activity,
};

const PatientCases = () => {
  const { cases, loading, createCase, updateCase, deleteCase } = useCases();
  const { userRole } = useAuth();
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<PatientCase | null>(null);

  const isInstructor = userRole === "instructor";

  const handleCreateCase = async (caseData: Omit<PatientCase, "id" | "created_at" | "updated_at">) => {
    await createCase(caseData);
    setIsFormOpen(false);
  };

  const handleUpdateCase = async (caseData: Omit<PatientCase, "id" | "created_at" | "updated_at">) => {
    if (editingCase) {
      await updateCase(editingCase.id, caseData);
      setEditingCase(null);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (confirm("Are you sure you want to delete this case?")) {
      await deleteCase(id);
    }
  };

  if (selectedCase) {
    return (
      <CaseSimulation
        patientCase={selectedCase}
        onBack={() => setSelectedCase(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Patient Case Simulations</h1>
            <p className="text-muted-foreground text-lg">
              Practice your diagnostic skills with realistic medical scenarios
            </p>
          </div>
          {isInstructor && (
            <Button onClick={() => setIsFormOpen(true)} className="medical-gradient text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Case
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2">
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <Card className="border-2 text-center py-12">
            <CardContent>
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cases available</h3>
              <p className="text-muted-foreground">
                {isInstructor
                  ? "Create your first patient case to get started."
                  : "Check back later for new cases."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => {
              const IconComponent = iconMap[caseItem.icon_name || "Activity"] || Activity;
              return (
                <Card
                  key={caseItem.id}
                  className="card-hover cursor-pointer border-2 hover:border-primary smooth-transition"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg medical-gradient flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge
                        variant={
                          caseItem.difficulty === "High"
                            ? "destructive"
                            : caseItem.difficulty === "Medium"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {caseItem.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{caseItem.title}</CardTitle>
                    <CardDescription className="text-base">
                      {caseItem.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full medical-gradient text-white hover:opacity-90"
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      Start Case
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {isInstructor && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCase(caseItem);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCase(caseItem.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <CaseFormDialog
        open={isFormOpen || !!editingCase}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingCase(null);
          }
        }}
        onSubmit={editingCase ? handleUpdateCase : handleCreateCase}
        initialData={editingCase || undefined}
        mode={editingCase ? "edit" : "create"}
      />
    </div>
  );
};

export default PatientCases;
