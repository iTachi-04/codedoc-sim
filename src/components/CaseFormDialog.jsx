import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export const CaseFormDialog = ({ open, onOpenChange, onSubmit, initialData, mode }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    symptoms: initialData?.symptoms || "",
    vitals: {
      bp: initialData?.vitals?.bp || "",
      hr: initialData?.vitals?.hr || "",
      temp: initialData?.vitals?.temp || "",
      rr: initialData?.vitals?.rr || "",
    },
    tests: initialData?.tests?.join(", ") || "",
    diagnosis: initialData?.diagnosis || "",
    difficulty: initialData?.difficulty || "Medium",
    icon_name: initialData?.icon_name || "Activity",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const caseData = {
      title: formData.title,
      description: formData.description,
      symptoms: formData.symptoms,
      vitals: formData.vitals,
      tests: formData.tests.split(",").map((t) => t.trim()).filter(Boolean),
      diagnosis: formData.diagnosis,
      difficulty: formData.difficulty,
      icon_name: formData.icon_name,
    };

    await onSubmit(caseData);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Case" : "Edit Case"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <Textarea id="symptoms" value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} rows={2} placeholder="Describe patient symptoms..." />
          </div>
          <div className="space-y-2">
            <Label>Vitals</Label>
            <div className="grid grid-cols-4 gap-2">
              <div><Label className="text-xs">BP</Label><Input value={formData.vitals.bp} onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, bp: e.target.value } })} placeholder="120/80" /></div>
              <div><Label className="text-xs">HR</Label><Input value={formData.vitals.hr} onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, hr: e.target.value } })} placeholder="72" /></div>
              <div><Label className="text-xs">Temp</Label><Input value={formData.vitals.temp} onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, temp: e.target.value } })} placeholder="37°C" /></div>
              <div><Label className="text-xs">RR</Label><Input value={formData.vitals.rr} onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, rr: e.target.value } })} placeholder="16" /></div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tests">Available Tests (comma-separated)</Label>
            <Input id="tests" value={formData.tests} onChange={(e) => setFormData({ ...formData, tests: e.target.value })} placeholder="ECG, Blood Test, X-ray" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Correct Diagnosis</Label>
              <Input id="diagnosis" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon_name} onValueChange={(v) => setFormData({ ...formData, icon_name: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activity">Activity</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Thermometer">Thermometer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 medical-gradient" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : mode === "create" ? "Create Case" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
