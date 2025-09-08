import { Document, Types } from 'mongoose';
import { IResult } from '../models/Result.js';

export interface IOption {
  label: string;
  value: string;
  tags?: string[];
  scores?: Map<string, number>;
}

export interface IInput {
  label: string;
  type: string;
  name: string;
  required: boolean;
  options?: IOption[];
}

export interface ITextBlock {
  type: string;
  content: string;
}

export interface IQuestionStep {
  title: string;
  type: string;
  inputs: IInput[];
}

export interface IInfoStep {
  title: string;
  type: string;
  description: ITextBlock[];
}

export interface IQuiz extends Document {
  title: string;
  steps: IQuestionStep[] | IInfoStep[];
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
  steps: IQuestionStep[] | IInfoStep[];
}

export interface SubmitAnswerRequest {
  sessionId?: string;
  stepIndex: number;
  stepAnswers: Record<string, any>;
  calculatedScores?: Map<string, number>;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: string;
}

export interface PersonaScore {
  total: number;
  count: number;
  average: number;
}

export interface QuizCalculationResponse {
  primaryType: IResult;
  secondaryType?: IResult | undefined;
  isChameleon: boolean;
  scores: Record<string, number>;
  breakdown: {
    type: IResult;
    score: number;
    percentage: number;
  }[];
  totalQuestions: number;
  answeredQuestions: number;
}
