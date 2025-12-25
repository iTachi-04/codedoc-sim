import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const usePerformance = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
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
      setScores(data || []);
    }
    setLoading(false);
  };

  const saveScore = async (caseId, score, metrics) => {
    if (!user) return false;

    const { error } = await supabase.from("performance_scores").insert([
      {
        user_id: user.id,
        case_id: caseId,
        score,
        metrics: metrics || null,
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
