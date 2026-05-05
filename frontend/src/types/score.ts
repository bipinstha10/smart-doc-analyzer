export interface AllScores {
  notice: number;
  feedback: number;
  complaint: number;
}

export interface ScoreResult {
  // id: string;
  // fileName: string;
  // message: string;
  // uploadedAt: string;
  category: string;
  confidence_score: number;
  all_scores: Record<string, number>;
  summary: string;
  // inferenceTime: number;
  // originalLength: number;
  // summaryLength: number;
}
