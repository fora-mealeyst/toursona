import Quiz from "./Quiz.js";
import { Types } from "mongoose";

describe("Quiz Model", () => {
  test("should create a quiz with valid data", () => {
    const quizData = {
      title: "Test Quiz",
      description: "A test quiz for validation",
      steps: [new Types.ObjectId()], // Steps are now ObjectId references
      resultTypes: [new Types.ObjectId()], // Result types are now ObjectId references
      isActive: true,
    };

    const quiz = new Quiz(quizData);

    expect(quiz.title).toBe("Test Quiz");
    expect(quiz.description).toBe("A test quiz for validation");
    expect(quiz.steps).toHaveLength(1);
    expect(quiz.resultTypes).toHaveLength(1);
    expect(quiz.isActive).toBe(true);
    expect(quiz.steps[0]).toBeInstanceOf(Types.ObjectId);
    expect(quiz.resultTypes[0]).toBeInstanceOf(Types.ObjectId);
  });

  test("should handle quiz with multiple steps and result types", () => {
    const quizData = {
      title: "Multi-step Quiz",
      description: "A quiz with multiple steps and result types",
      steps: [new Types.ObjectId(), new Types.ObjectId()],
      resultTypes: [
        new Types.ObjectId(),
        new Types.ObjectId(),
        new Types.ObjectId(),
      ],
      isActive: true,
    };

    const quiz = new Quiz(quizData);

    expect(quiz.title).toBe("Multi-step Quiz");
    expect(quiz.description).toBe(
      "A quiz with multiple steps and result types"
    );
    expect(quiz.steps).toHaveLength(2);
    expect(quiz.resultTypes).toHaveLength(3);
    expect(quiz.isActive).toBe(true);

    // Verify all steps are ObjectIds
    quiz.steps.forEach((stepId) => {
      expect(stepId).toBeInstanceOf(Types.ObjectId);
    });

    // Verify all result types are ObjectIds
    quiz.resultTypes.forEach((resultTypeId) => {
      expect(resultTypeId).toBeInstanceOf(Types.ObjectId);
    });
  });

  test("should handle quiz with default values", () => {
    const quizData = {
      title: "Minimal Quiz",
      // Only title is required, other fields should use defaults
    };

    const quiz = new Quiz(quizData);

    expect(quiz.title).toBe("Minimal Quiz");
    expect(quiz.description).toBe(""); // Default empty string
    expect(quiz.steps).toEqual([]); // Default empty array
    expect(quiz.resultTypes).toEqual([]); // Default empty array
    expect(quiz.isActive).toBe(true); // Default true
    expect(quiz.createdAt).toBeInstanceOf(Date);
  });

  test("should handle quiz validation errors", async () => {
    // Test that title is required - validation happens on save
    const quizWithoutTitle = new Quiz({});
    await expect(quizWithoutTitle.save()).rejects.toThrow();

    // Test that title cannot be empty - validation happens on save
    const quizWithEmptyTitle = new Quiz({ title: "" });
    await expect(quizWithEmptyTitle.save()).rejects.toThrow();
  });
});
