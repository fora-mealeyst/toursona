import { Document, Types } from "mongoose";
import { IResult } from "../models/Result.js";
import { IContent } from "../models/Content.js";

export interface IResultScore {
  resultId: Types.ObjectId;
  score: number;
}

export interface IContentSection {
  type: "image" | "text" | "video";
  content: string; // URL for images/videos, text content for text
  alt?: string; // Alt text for images
  caption?: string; // Caption for images/videos
  alignment?: "left" | "right"; // Which side this section appears on
}

export interface IOption {
  label: string;
  value: string;
  tags?: string[];
  resultScores?: IResultScore[];
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

export interface IStep extends Document {
  title: string;
  type: string;
  quizId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type StepWithInputs = IStep & IQuestionStep;
export type StepWithDescription = IStep & IInfoStep;

export interface IQuiz extends Document {
  title: string;
  slug: string;
  description?: string;
  steps: Types.ObjectId[];
  resultTypes: Types.ObjectId[];
  isActive: boolean;
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
  description?: string;
  steps?: Types.ObjectId[];
  resultTypes?: Types.ObjectId[];
  isActive?: boolean;
}

export interface CreateStepRequest {
  title: string;
  type: string;
  quizId: string;
  order: number;
  inputs?: IInput[];
  description?: ITextBlock[];
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
