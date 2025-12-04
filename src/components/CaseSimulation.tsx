import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useSimulationLogs } from "@/hooks/useSimulationLogs";
import { usePerformance } from "@/hooks/usePerformance";
import { PatientCase } from "@/hooks/useCases";

interface CaseSimulationProps {
  patientCase: PatientCase;
  onBack: () => void;
}

export const CaseSimulation = ({ patientCase, onBack }: CaseSimulationProps) => {
  const [step, setStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { logAction } = useSimulationLogs();
  const { saveScore } = usePerformance();

  useEffect(() => {
    // Log when case is started
    logAction("started_simulation", patientCase.id, { case_title: patientCase.title });
  }, [patientCase.id]);

  const diagnosisOptions = [
    "Myocardial Infarction",
    "Viral Infection",
    "Acute Appendicitis",
    "Gastroenteritis",
    "Pneumonia",
  ];

  const handleTestSelection = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
    logAction("selected_test", patientCase.id, { test_name: test });
  };

  const handleNext = () => {
    if (step === 2 && selectedTests.length === 0) {
      toast.error("Please select at least one diagnostic test");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleSubmitDiagnosis = async () => {
    if (!selectedDiagnosis) {
      toast.error("Please select a diagnosis");
      return;
    }
    
    logAction("submitted_diagnosis", patientCase.id, { diagnosis: selectedDiagnosis });
    
    const score = calculateScore();
    await saveScore(patientCase.id, score, {
      testsSelected: selectedTests.length,
      correctDiagnosis: selectedDiagnosis === patientCase.diagnosis,
    });
    
    logAction("completed_simulation", patientCase.id, { score });
    setShowResults(true);
  };

  const calculateScore = () => {
    const correctTests = selectedTests.filter((test) =>
      patientCase.tests.includes(test)
    ).length;
    const testScore = patientCase.tests.length > 0 
      ? (correctTests / patientCase.tests.length) * 50 
      : 25;
    const diagnosisScore = selectedDiagnosis === patientCase.diagnosis ? 50 : 0;
    return Math.round(testScore + diagnosisScore);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Case Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full medical-gradient flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{score}%</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Diagnosis Accuracy: {score}%
                </h3>
                <p className="text-muted-foreground">
                  {score >= 80
                    ? "Excellent work! You demonstrated strong diagnostic skills."
                    : score >= 60
                    ? "Good effort! Review the correct approach for improvement."
                    : "Keep practicing! Medicine requires continuous learning."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    {selectedDiagnosis === patientCase.diagnosis ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <XCircle className="text-destructive" />
                    )}
                    Your Diagnosis: {selectedDiagnosis}
                  </h4>
                  <p className="text-muted-foreground">
                    Correct Diagnosis: {patientCase.diagnosis}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommended Tests:</h4>
                  <div className="flex flex-wrap gap-2">
                    {patientCase.tests.map((test) => (
                      <Badge
                        key={test}
                        variant={selectedTests.includes(test) ? "default" : "secondary"}
                      >
                        {test}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={onBack}
                className="w-full medical-gradient text-white"
              >
                Back to Cases
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cases
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">{patientCase.title}</CardTitle>
              <Badge>Step {step} of 4</Badge>
            </div>
            <CardDescription className="text-base">
              {patientCase.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Patient Presentation</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Symptoms:</h4>
                  <p className="text-muted-foreground">{patientCase.symptoms}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Blood Pressure</p>
                    <p className="text-lg font-semibold">{patientCase.vitals.bp}</p>
                  </div>
                  <div className="bg-card p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Heart Rate</p>
                    <p className="text-lg font-semibold">{patientCase.vitals.hr}</p>
                  </div>
                  <div className="bg-card p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-lg font-semibold">{patientCase.vitals.temp}</p>
                  </div>
                  <div className="bg-card p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Resp. Rate</p>
                    <p className="text-lg font-semibold">{patientCase.vitals.rr}</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Select Diagnostic Tests</h3>
                <p className="text-muted-foreground">
                  Choose the tests you would order for this patient
                </p>
                <div className="space-y-3">
                  {[
                    "ECG",
                    "Complete Blood Count",
                    "Chest X-ray",
                    "Blood Test",
                    "Troponin",
                    "Urinalysis",
                    "Ultrasound",
                    "CT Scan",
                    "Blood Culture",
                  ].map((test) => (
                    <div key={test} className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
                      <Checkbox
                        id={test}
                        checked={selectedTests.includes(test)}
                        onCheckedChange={() => handleTestSelection(test)}
                      />
                      <label
                        htmlFor={test}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {test}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Test Results</h3>
                <div className="space-y-3">
                  {selectedTests.map((test) => (
                    <div key={test} className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-1">{test}</h4>
                      <p className="text-sm text-muted-foreground">
                        {test === "ECG" && "ST-elevation in leads II, III, aVF"}
                        {test === "Complete Blood Count" && "WBC: 12,000/µL, Elevated"}
                        {test === "Chest X-ray" && "Clear lung fields, normal cardiac silhouette"}
                        {test === "Blood Test" && "Normal metabolic panel"}
                        {test === "Troponin" && "Elevated: 2.5 ng/mL (Normal <0.04)"}
                        {test === "Urinalysis" && "Normal findings"}
                        {test === "Ultrasound" && "No abnormalities detected"}
                        {test === "CT Scan" && "Appendiceal inflammation visible"}
                        {test === "Blood Culture" && "Pending - no growth at 24 hours"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Select Diagnosis</h3>
                <p className="text-muted-foreground">
                  Based on the symptoms, vitals, and test results, what is your diagnosis?
                </p>
                <div className="space-y-3">
                  {diagnosisOptions.map((diagnosis) => (
                    <div
                      key={diagnosis}
                      className={`p-4 rounded-lg border-2 cursor-pointer smooth-transition ${
                        selectedDiagnosis === diagnosis
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedDiagnosis(diagnosis)}
                    >
                      <p className="font-medium">{diagnosis}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  className="ml-auto medical-gradient text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitDiagnosis}
                  className="ml-auto medical-gradient text-white"
                >
                  Submit Diagnosis
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
