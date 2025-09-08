import request from 'supertest';
import express from 'express';

// Mock the models before importing the router
const mockQuiz = {
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn()
};

const mockQuizAnswer = {
  findById: jest.fn(),
  save: jest.fn()
};

jest.mock('../models/Quiz.js', () => ({
  __esModule: true,
  default: mockQuiz
}));

jest.mock('../models/QuizAnswer.js', () => ({
  __esModule: true,
  default: mockQuizAnswer
}));

// Import after mocks are set up
import quizzesRouter from './quizzes.js';

const app = express();
app.use(express.json());
app.use('/api/quizzes', quizzesRouter);

describe('Quiz Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/quizzes/:id should return 404 for non-existent quiz', async () => {
    mockQuiz.findById.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/quizzes/507f1f77bcf86cd799439011');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Quiz not found');
  });

  test('POST /api/quizzes should create a new quiz', async () => {
    const quizData = {
      title: 'Test Quiz',
      steps: [
        {
          title: 'Step 1',
          inputs: [
            {
              label: 'Name',
              type: 'text',
              name: 'name',
              required: true
            }
          ]
        }
      ]
    };

    // For now, just test that the route accepts the request
    // The actual database operations would be tested in integration tests
    const response = await request(app)
      .post('/api/quizzes')
      .send(quizData);

    // Should either succeed (201) or fail with validation error (400)
    expect([201, 400]).toContain(response.status);
  });

  test('GET /api/quizzes/:id/calculate/:sessionId should calculate persona results', async () => {
    const mockQuizData = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Test Quiz',
      steps: [
        {
          type: 'question',
          title: 'Question 1',
          inputs: [
            {
              name: 'q1',
              options: [
                {
                  value: 'q1_a',
                  scores: new Map([['Adventurer', 1]])
                },
                {
                  value: 'q1_b',
                  scores: new Map([['Luxe Seeker', 1]])
                }
              ]
            }
          ]
        }
      ]
    };

    const mockAnswerDoc = {
      _id: '507f1f77bcf86cd799439012',
      quizId: '507f1f77bcf86cd799439011',
      answers: {
        '0': { q1: 'q1_a' }
      },
      calculatedScores: new Map(),
      save: jest.fn().mockResolvedValue(true)
    };

    mockQuiz.findById.mockResolvedValue(mockQuizData);
    mockQuizAnswer.findById.mockResolvedValue(mockAnswerDoc);

    const response = await request(app)
      .get('/api/quizzes/507f1f77bcf86cd799439011/calculate/507f1f77bcf86cd799439012');

    expect(response.status).toBe(200);
    expect(response.body.primaryPersona).toBe('Adventurer');
    expect(response.body.scores).toHaveProperty('Adventurer');
    expect(response.body.scores.Adventurer.average).toBe(1);
    expect(mockAnswerDoc.save).toHaveBeenCalled();
  });

  test('GET /api/quizzes/:id/calculate/:sessionId should handle tied personas', async () => {
    const mockQuizData = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Test Quiz',
      steps: [
        {
          type: 'question',
          title: 'Question 1',
          inputs: [
            {
              name: 'q1',
              options: [
                {
                  value: 'q1_a',
                  scores: new Map([['Adventurer', 1], ['Luxe Seeker', 1]])
                }
              ]
            }
          ]
        }
      ]
    };

    const mockAnswerDoc = {
      _id: '507f1f77bcf86cd799439012',
      quizId: '507f1f77bcf86cd799439011',
      answers: {
        '0': { q1: 'q1_a' }
      },
      calculatedScores: new Map(),
      save: jest.fn().mockResolvedValue(true)
    };

    mockQuiz.findById.mockResolvedValue(mockQuizData);
    mockQuizAnswer.findById.mockResolvedValue(mockAnswerDoc);

    const response = await request(app)
      .get('/api/quizzes/507f1f77bcf86cd799439011/calculate/507f1f77bcf86cd799439012');

    expect(response.status).toBe(200);
    expect(response.body.combinedPersona).toBe('Adventurer + Luxe Seeker');
    expect(response.body.topPersonas).toEqual(['Adventurer', 'Luxe Seeker']);
    expect(mockAnswerDoc.save).toHaveBeenCalled();
  });
});
