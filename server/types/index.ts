import { Document, Types } from 'mongoose';

export interface IInput {
  label: string;
  type: string;
  name: string;
  required: boolean;
  options?: string[];
}

export interface IStep {
  title: string;
  inputs: IInput[];
}

export interface IQuiz extends Document {
  title: string;
  steps: IStep[];
  createdAt: Date;
}

export interface IQuizAnswer extends Document {
  quizId: Types.ObjectId;
  answers: Record<string, any>;
  submittedAt: Date;
  calculatedScores?: Map<string, number>;
  sessionData?: {
    ipAddress?: string;
    userAgent?: string;
    completionTime?: number;
  };
}

export interface CreateQuizRequest {
  title: string;
  steps: IStep[];
}

export interface SubmitAnswerRequest {
  sessionId?: string;
  stepIndex: number;
  stepAnswers: Record<string, any>;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: string;
}
