export interface QuizOption {
  label: string;
  value: string;
  tags?: string[];
  scores?: Record<string, number>;
}

export interface QuizField {
  type: 'single_choice' | 'text';
  label: string;
  name: string;
  required?: boolean;
  options?: QuizOption[];
}

export interface QuizStep {
  title: string;
  inputs: QuizField[];
}

export interface Quiz {
  id: string;
  title: string;
  steps: QuizStep[];
}

export interface QuizAnswer {
  sessionId?: string;
  stepIndex: number;
  stepAnswers: Record<string, string>;
}

export interface QuizResponse {
  sessionId?: string;
  message?: string;
}
