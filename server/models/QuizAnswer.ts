import mongoose, { Schema } from 'mongoose';
import { IQuizAnswer } from '../types/index.js';

const QuizAnswerSchema = new Schema<IQuizAnswer>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: { type: Schema.Types.Mixed, default: {} }, // Store answers as a mixed object
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuizAnswer>('QuizAnswer', QuizAnswerSchema);
