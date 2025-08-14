import mongoose, { Schema } from 'mongoose';
import { IQuiz, IInput, IStep } from '../types/index.js';

/**
 * Schema for quiz options with scoring and tagging capabilities
 */
const OptionSchema = new Schema({
  label: { 
    type: String, 
    required: true 
  }, // UI text for the option
  value: { 
    type: String, 
    required: true 
  }, // Stable identifier (e.g., "q1_a")
  tags: [{ 
    type: String, 
    default: [] 
  }], // Array of behavior/interest tags
  scores: { 
    type: Map, 
    of: Number, 
    default: {} 
  }, // Toursona score weights, e.g. { Adventurer: 1 }
}, { 
  _id: false 
});

/**
 * Schema for quiz input fields
 */
const InputSchema = new Schema<IInput>({
  label: { 
    type: String, 
    required: true 
  }, // The question prompt
  type: { 
    type: String, 
    required: true 
  }, // Input type (e.g., "single_choice", "text")
  name: { 
    type: String, 
    required: true 
  }, // Field identifier (e.g., "q1")
  required: { 
    type: Boolean, 
    required: true 
  },
  options: { 
    type: [OptionSchema], 
    default: [] 
  } // Options for choice-based inputs (with tags + scores)
});

/**
 * Schema for quiz steps
 */
const StepSchema = new Schema<IStep>({
  title: { 
    type: String, 
    required: true 
  },
  inputs: [InputSchema]
});

/**
 * Main Quiz schema
 */
const QuizSchema = new Schema<IQuiz>({
  title: { 
    type: String, 
    required: true 
  },
  steps: [StepSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
