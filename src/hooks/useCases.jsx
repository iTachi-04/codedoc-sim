import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        vitals: c.vitals,
        tests: c.tests,
      }));
      setCases(transformedCases);
    }

    setLoading(false);
  };

  const createCase = async (caseData) => {
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

  const updateCase = async (id, caseData) => {
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

  const deleteCase = async (id) => {
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
