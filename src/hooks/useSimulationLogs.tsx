import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";

type LogAction = 
  | "opened_case"
  | "started_simulation"
  | "selected_test"
  | "submitted_diagnosis"
  | "asked_ai"
  | "completed_simulation";

interface LogMetadata {
  case_title?: string;
  test_name?: string;
  diagnosis?: string;
  question?: string;
  score?: number;
  [key: string]: string | number | boolean | undefined;
}

export const useSimulationLogs = () => {
  const { user } = useAuth();

  const logAction = async (
    action: LogAction,
    caseId?: string,
    metadata?: LogMetadata
  ) => {
    if (!user) return;

    const { error } = await supabase.from("simulation_logs").insert([
      {
        user_id: user.id,
        case_id: caseId || null,
        action,
        metadata: metadata ? (metadata as unknown as Json) : null,
      },
    ]);

    if (error) {
      console.error("Failed to log action:", error);
    }
  };

  const getRecentLogs = async (limit = 5) => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("simulation_logs")
      .select("*, patient_cases(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch logs:", error);
      return [];
    }

    return data || [];
  };

  const getAllStudentLogs = async () => {
    const { data, error } = await supabase
      .from("simulation_logs")
      .select("*, patient_cases(title), profiles(name, email)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Failed to fetch student logs:", error);
      return [];
    }

    return data || [];
  };

  return {
    logAction,
    getRecentLogs,
    getAllStudentLogs,
  };
};
