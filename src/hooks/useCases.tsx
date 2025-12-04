import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PatientCase {
  id: string;
  title: string;
  description: string | null;
  symptoms: string;
  vitals: { bp: string; hr: string; temp: string; rr: string };
  tests: string[];
  diagnosis: string | null;
  difficulty: string | null;
  icon_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCases = () => {
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("patient_cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      toast.error("Failed to load patient cases");
    } else {
      const transformedCases = (data || []).map((c) => ({
        ...c,
        symptoms: typeof c.symptoms === "string" ? c.symptoms : JSON.stringify(c.symptoms).replace(/"/g, ""),
        vitals: c.vitals as PatientCase["vitals"],
        tests: c.tests as string[],
      }));
      setCases(transformedCases);
    }

    setLoading(false);
  };

  const createCase = async (caseData: Omit<PatientCase, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("patient_cases")
      .insert([{
        ...caseData,
        symptoms: JSON.stringify(caseData.symptoms),
      }])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create case: " + error.message);
      return null;
    }

    toast.success("Case created successfully");
    await fetchCases();
    return data;
  };

  const updateCase = async (id: string, caseData: Partial<PatientCase>) => {
    const { error } = await supabase
      .from("patient_cases")
      .update({
        ...caseData,
        symptoms: caseData.symptoms ? JSON.stringify(caseData.symptoms) : undefined,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update case: " + error.message);
      return false;
    }

    toast.success("Case updated successfully");
    await fetchCases();
    return true;
  };

  const deleteCase = async (id: string) => {
    const { error } = await supabase
      .from("patient_cases")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete case: " + error.message);
      return false;
    }

    toast.success("Case deleted successfully");
    await fetchCases();
    return true;
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    loading,
    error,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};
