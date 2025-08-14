export interface QuizField {
  type: 'radio' | 'text';
  label: string;
  name: string;
  required?: boolean;
  options?: string[];
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
