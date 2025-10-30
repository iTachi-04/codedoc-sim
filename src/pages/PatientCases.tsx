import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Thermometer, Activity, ArrowRight } from "lucide-react";
import { CaseSimulation } from "@/components/CaseSimulation";

const cases = [
  {
    id: 1,
    title: "Chest Pain Emergency",
    description: "45-year-old male presenting with acute chest pain",
    difficulty: "High",
    icon: Heart,
    symptoms: "Severe chest pain radiating to left arm, shortness of breath, sweating",
    vitals: { bp: "150/95", hr: "105", temp: "37.2°C", rr: "22" },
    tests: ["ECG", "Troponin", "Chest X-ray", "Blood Test"],
    diagnosis: "Myocardial Infarction",
  },
  {
    id: 2,
    title: "Persistent Fever",
    description: "28-year-old female with fever and fatigue for 5 days",
    difficulty: "Medium",
    icon: Thermometer,
    symptoms: "Fever (39°C), fatigue, joint pain, mild headache",
    vitals: { bp: "118/76", hr: "92", temp: "39.1°C", rr: "18" },
    tests: ["Complete Blood Count", "Blood Culture", "Urinalysis", "Chest X-ray"],
    diagnosis: "Viral Infection",
  },
  {
    id: 3,
    title: "Abdominal Pain",
    description: "32-year-old male with acute abdominal pain",
    difficulty: "Medium",
    icon: Activity,
    symptoms: "Right lower quadrant pain, nausea, loss of appetite, low-grade fever",
    vitals: { bp: "125/80", hr: "88", temp: "37.8°C", rr: "16" },
    tests: ["Ultrasound", "Complete Blood Count", "Urinalysis", "CT Scan"],
    diagnosis: "Acute Appendicitis",
  },
];

const PatientCases = () => {
  const [selectedCase, setSelectedCase] = useState<typeof cases[0] | null>(null);

  if (selectedCase) {
    return (
      <CaseSimulation
        patientCase={selectedCase}
        onBack={() => setSelectedCase(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Patient Case Simulations</h1>
          <p className="text-muted-foreground text-lg">
            Practice your diagnostic skills with realistic medical scenarios
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="card-hover cursor-pointer border-2 hover:border-primary"
              onClick={() => setSelectedCase(caseItem)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg medical-gradient flex items-center justify-center">
                    <caseItem.icon className="h-6 w-6 text-white" />
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
              <CardContent>
                <Button className="w-full medical-gradient text-white hover:opacity-90">
                  Start Case
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientCases;
