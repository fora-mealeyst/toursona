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

export interface IQuiz {
  _id: string;
  title: string;
  steps: IStep[];
  createdAt: string;
}

export interface IQuizAnswer {
  _id: string;
  quizId: string;
  answers: Record<string, any>;
  submittedAt: string;
}

export interface QuizWithAnswers extends IQuiz {
  answers: IQuizAnswer[];
}

export interface CreateQuizRequest {
  title: string;
  steps: IStep[];
}
