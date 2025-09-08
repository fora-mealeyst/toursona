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
  options?: (string | QuizOption)[];
}

export interface TextBlock {
  type: string;
  content: string;
}

export interface QuestionStep {
  title: string;
  type: 'question';
  inputs: QuizField[];
}

export interface InfoStep {
  title: string;
  type: 'info';
  description: TextBlock[];
}

export type QuizStep = QuestionStep | InfoStep;

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
