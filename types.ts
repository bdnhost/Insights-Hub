
export interface Trend {
  name: string;
  description: string;
  confidence: number; // A score from 0 to 100
}

export interface Opportunity {
  title: string;
  description: string;
  potential_score: number; // A score from 0 to 100
}

export interface AnalysisResult {
  summary: string;
  topics: string[];
  trends: Trend[];
  opportunities: Opportunity[];
}
