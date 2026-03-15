export interface RedFlag {
  clause: string;
  concern: string;
  severity: "low" | "medium" | "high";
}

export interface AnalysisResult {
  attention_score: number;
  score_label: string;
  contract_type: string;
  summary?: string;
  key_points: string[];
  red_flags: RedFlag[];
}

export type AnalysisStatus = "idle" | "analyzing" | "completed" | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  summary: string; // Streamed piece by piece
  result: AnalysisResult | null;
  error: string | null;
}
