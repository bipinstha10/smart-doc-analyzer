export interface AllScores {
  notice: number;
  feedback: number;
  complaint: number;
}

export interface ScoreResult {
  category: string;
  confidence_score: number;
  all_scores: Record<string, number>;
  summary: string;
  file_name?: string;
}
