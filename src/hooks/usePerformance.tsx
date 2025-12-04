import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface PerformanceScore {
  id: string;
  user_id: string;
  case_id: string;
  score: number;
  metrics: {
    testsSelected?: number;
    correctDiagnosis?: boolean;
    timeSpent?: number;
    [key: string]: string | number | boolean | undefined;
  } | null;
  created_at: string;
  patient_cases?: {
    title: string;
  };
}

export const usePerformance = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<PerformanceScore[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("performance_scores")
      .select("*, patient_cases(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch scores:", error);
    } else {
      setScores((data as PerformanceScore[]) || []);
    }
    setLoading(false);
  };

  const saveScore = async (
    caseId: string,
    score: number,
    metrics?: PerformanceScore["metrics"]
  ) => {
    if (!user) return false;

    const { error } = await supabase.from("performance_scores").insert([
      {
        user_id: user.id,
        case_id: caseId,
        score,
        metrics: metrics ? (metrics as unknown as Json) : null,
      },
    ]);

    if (error) {
      toast.error("Failed to save score");
      return false;
    }

    toast.success("Score saved!");
    await fetchScores();
    return true;
  };

  const getAllScores = async () => {
    const { data, error } = await supabase
      .from("performance_scores")
      .select("*, patient_cases(title), profiles(name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch all scores:", error);
      return [];
    }

    return data || [];
  };

  const getAverageScore = () => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(total / scores.length);
  };

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user]);

  return {
    scores,
    loading,
    saveScore,
    getAllScores,
    getAverageScore,
    fetchScores,
  };
};
