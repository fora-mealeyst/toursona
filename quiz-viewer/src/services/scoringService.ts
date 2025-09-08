/**
 * Personality type interface (matches backend structure)
 */
export interface PersonalityType {
  id: string;
  name: string;
  description: string;
  traits: string[];
  travelStyle: string;
  color: string;
  eyebrow: string;
  cta: string;
  advisorDescription: string;
}

/**
 * Scoring result with personality type and breakdown
 */
export interface ScoringResult {
  primaryType: PersonalityType;
  secondaryType?: PersonalityType;
  isChameleon: boolean;
  scores: Record<string, number>;
  breakdown: {
    type: PersonalityType;
    score: number;
    percentage: number;
  }[];
  totalQuestions: number;
  answeredQuestions: number;
}
