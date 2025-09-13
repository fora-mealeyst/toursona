import mongoose, { Schema } from "mongoose";
import { IQuiz } from "../types/index.js";

/**
 * Main Quiz schema - now simplified to reference steps and result types
 */
const QuizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    }, // URL-friendly identifier (e.g., "honeymoon-match")
    description: {
      type: String,
      default: "",
    }, // Optional description of the quiz
    steps: [
      {
        type: Schema.Types.ObjectId,
        ref: "Step",
      },
    ], // Reference to steps for this quiz
    resultTypes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Result",
      },
    ], // References to Result model for result types
    isActive: {
      type: Boolean,
      default: true,
    }, // Whether the quiz is active and can be taken
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Add index for slug field for better performance
QuizSchema.index({ slug: 1 });

const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
