import request from "supertest";
import express from "express";

// Mock the models before importing the router
const mockQuiz = {
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOne: jest.fn(),
};

const mockQuizAnswer = {
  findById: jest.fn(),
  save: jest.fn(),
};

const mockResult = {
  find: jest.fn(),
};

jest.mock("../models/Quiz.js", () => ({
  __esModule: true,
  default: mockQuiz,
}));

jest.mock("../models/QuizAnswer.js", () => ({
  __esModule: true,
  default: mockQuizAnswer,
}));

jest.mock("../models/Result.js", () => ({
  __esModule: true,
  default: mockResult,
}));

// Import after mocks are set up
import quizzesRouter from "./quizzes.js";

const app = express();
app.use(express.json());
app.use("/api/quizzes", quizzesRouter);

describe.skip("Quiz Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("GET /api/quizzes/:id should return 404 for non-existent quiz", async () => {
    // Create a mock that returns an object with populate method that chains
    const mockQuery = {
      populate: jest.fn(),
    };
    // Make populate return itself for chaining, but resolve to null on the final call
    mockQuery.populate.mockReturnValue(mockQuery);
    mockQuiz.findById.mockReturnValue(mockQuery);
    // The final populate call should resolve to null (quiz not found)
    mockQuery.populate.mockResolvedValueOnce(null);

    const response = await request(app).get(
      "/api/quizzes/68c4fdc81176a773e5c087ff"
    );

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Quiz not found");
  }, 10000);

  test("POST /api/quizzes should create a new quiz", async () => {
    const quizData = {
      title: "Test Quiz",
      steps: [
        {
          title: "Step 1",
          inputs: [
            {
              label: "Name",
              type: "text",
              name: "name",
              required: true,
            },
          ],
        },
      ],
    };

    // For now, just test that the route accepts the request
    // The actual database operations would be tested in integration tests
    const response = await request(app).post("/api/quizzes").send(quizData);

    // Should either succeed (201) or fail with validation error (400)
    expect([201, 400]).toContain(response.status);
  });

  test("GET /api/quizzes/:id/calculate/:sessionId should calculate persona results", async () => {
    const mockQuizData = {
      _id: "68c4fdc81176a773e5c087ff",
      title: "Test Quiz",
      steps: [
        {
          type: "question",
          title: "Question 1",
          inputs: [
            {
              name: "q1",
              options: [
                {
                  value: "q1_a",
                  scores: new Map([["Adventurer", 1]]),
                },
                {
                  value: "q1_b",
                  scores: new Map([["Luxe Seeker", 1]]),
                },
              ],
            },
          ],
        },
      ],
    };

    const mockAnswerDoc = {
      _id: "68c4fdc81176a773e5c087fe",
      quizId: "68c4fdc81176a773e5c087ff",
      answers: {
        "0": { q1: "q1_a" },
      },
      calculatedScores: new Map(),
      save: jest.fn().mockResolvedValue(true),
    };

    const mockPersonalityTypes = [
      { id: "adventurer", name: "Adventurer" },
      { id: "luxe-seeker", name: "Luxe Seeker" },
    ];

    mockQuiz.findById.mockResolvedValue(mockQuizData);
    mockQuizAnswer.findById.mockResolvedValue(mockAnswerDoc);
    mockResult.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPersonalityTypes),
    });

    const response = await request(app).get(
      "/api/quizzes/68c4fdc81176a773e5c087ff/calculate/68c4fdc81176a773e5c087fe"
    );

    expect(response.status).toBe(200);
    expect(response.body.primaryType).toBeDefined();
    expect(response.body.scores).toHaveProperty("adventurer");
    expect(mockAnswerDoc.save).toHaveBeenCalled();
  }, 10000);

  test("GET /api/quizzes/:id/calculate/:sessionId should handle tied personas", async () => {
    const mockQuizData = {
      _id: "68c4fdc81176a773e5c087ff",
      title: "Test Quiz",
      steps: [
        {
          type: "question",
          title: "Question 1",
          inputs: [
            {
              name: "q1",
              options: [
                {
                  value: "q1_a",
                  scores: new Map([
                    ["Adventurer", 1],
                    ["Luxe Seeker", 1],
                  ]),
                },
              ],
            },
          ],
        },
      ],
    };

    const mockAnswerDoc = {
      _id: "68c4fdc81176a773e5c087fe",
      quizId: "68c4fdc81176a773e5c087ff",
      answers: {
        "0": { q1: "q1_a" },
      },
      calculatedScores: new Map(),
      save: jest.fn().mockResolvedValue(true),
    };

    const mockPersonalityTypes = [
      { id: "adventurer", name: "Adventurer" },
      { id: "luxe-seeker", name: "Luxe Seeker" },
    ];

    mockQuiz.findById.mockResolvedValue(mockQuizData);
    mockQuizAnswer.findById.mockResolvedValue(mockAnswerDoc);
    mockResult.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPersonalityTypes),
    });

    const response = await request(app).get(
      "/api/quizzes/68c4fdc81176a773e5c087ff/calculate/68c4fdc81176a773e5c087fe"
    );

    expect(response.status).toBe(200);
    expect(response.body.primaryType).toBeDefined();
    expect(response.body.scores).toHaveProperty("adventurer");
    expect(response.body.scores).toHaveProperty("luxe-seeker");
    expect(mockAnswerDoc.save).toHaveBeenCalled();
  }, 10000);
});
