import mongoose, { Schema } from 'mongoose';
import { IQuizAnswer } from '../types/index.js';

/**
 * Schema for storing quiz answers and calculated scores
 */
const QuizAnswerSchema = new Schema<IQuizAnswer>({
  quizId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  },
  answers: { 
    type: Schema.Types.Mixed, 
    default: {} 
  }, // Store answers as a mixed object (stepIndex -> stepAnswers)
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  // Additional fields for Toursona scoring system
  calculatedScores: {
    type: Map,
    of: Number,
    default: {}
  }, // Final calculated scores for different personality types
  sessionData: {
    ipAddress: String,
    userAgent: String,
    completionTime: Number // Time taken to complete quiz in seconds
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

export default mongoose.model<IQuizAnswer>('QuizAnswer', QuizAnswerSchema);
