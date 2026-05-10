export interface DocumentResponse {
  id: number;
  category: string;
  confidence_score: number;
  summary: string;
  created_at: string;
  original_content: string;
  all_scores: Record<string, number>;
  file_name?: string;
}

export interface DeleteResponse {
  message: string;
}
