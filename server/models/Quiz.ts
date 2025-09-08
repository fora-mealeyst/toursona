import mongoose, { Schema } from 'mongoose';
import { IQuiz, IInput, IInfoStep, IQuestionStep, IOption } from '../types/index.js';

const TextBlockSchema = new Schema({
  type: {
    type: String,
    enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
    default: 'p'
  },
  content: {
    type: String,
    required: true
  },
});

/**
 * Schema for quiz options with scoring and tagging capabilities
 */
const OptionSchema = new Schema<IOption>({
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
 * Base schema for quiz steps with discriminator
 */
const StepSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['question', 'info'],
    required: true 
  }
}, {
  discriminatorKey: 'type'
});

/**
 * Discriminator schemas for different step types
 */
const QuestionStepSchema = new Schema<IQuestionStep>({
  inputs: [InputSchema]
});

const InfoStepSchema = new Schema<IInfoStep>({
  description: [TextBlockSchema]
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

// Set up discriminators for the steps array
const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
const stepsPath = QuizSchema.path('steps') as any;
stepsPath.discriminator('question', QuestionStepSchema);
stepsPath.discriminator('info', InfoStepSchema);

export default Quiz;
