import mongoose, { Schema, Document } from "mongoose";
import {
  IInput,
  IInfoStep,
  IQuestionStep,
  IOption,
  ITextBlock,
} from "../types/index.js";

const TextBlockSchema = new Schema<ITextBlock>({
  type: {
    type: String,
    enum: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    default: "p",
  },
  content: {
    type: String,
    required: true,
  },
});

/**
 * Schema for quiz options with scoring and tagging capabilities
 */
const OptionSchema = new Schema<IOption>(
  {
    label: {
      type: String,
      required: true,
    }, // UI text for the option
    value: {
      type: String,
      required: true,
    }, // Stable identifier (e.g., "q1_a")
    tags: [
      {
        type: String,
        default: [],
      },
    ], // Array of behavior/interest tags
    resultScores: [
      {
        resultId: {
          type: Schema.Types.ObjectId,
          ref: "Result",
          required: true,
        }, // Reference to Result model
        score: {
          type: Number,
          required: true,
        }, // Score for this result type
      },
    ], // Array of result scores with Result references
  },
  {
    _id: false,
  }
);

/**
 * Schema for quiz input fields
 */
const InputSchema = new Schema<IInput>({
  label: {
    type: String,
    required: true,
  }, // The question prompt
  type: {
    type: String,
    required: true,
  }, // Input type (e.g., "single_choice", "text")
  name: {
    type: String,
    required: true,
  }, // Field identifier (e.g., "q1")
  required: {
    type: Boolean,
    required: true,
  },
  options: {
    type: [OptionSchema],
    default: [],
  }, // Options for choice-based inputs (with tags + scores)
});

/**
 * Base schema for quiz steps with discriminator
 */
const StepSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["question", "info"],
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    }, // Reference to the quiz this step belongs to
    order: {
      type: Number,
      required: true,
    }, // Order of the step within the quiz
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  }
);

/**
 * Discriminator schemas for different step types
 */
const QuestionStepSchema = new Schema<IQuestionStep>({
  inputs: [InputSchema],
});

const InfoStepSchema = new Schema<IInfoStep>({
  description: [TextBlockSchema],
});

// Set up discriminators for the steps array
const Step = mongoose.model("Step", StepSchema);
Step.discriminator("question", QuestionStepSchema);
Step.discriminator("info", InfoStepSchema);

export default Step;
