import mongoose, { Schema } from 'mongoose';
import { IQuiz, IInput, IStep } from '../types/index.js';

const InputSchema = new Schema<IInput>({
  label: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  required: { type: Boolean, required: true },
  options: [{ type: String }]
});

const StepSchema = new Schema<IStep>({
  title: { type: String, required: true },
  inputs: [InputSchema]
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  steps: [StepSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
