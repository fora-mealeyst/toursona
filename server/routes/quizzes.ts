import express, { Request, Response } from 'express';
import Quiz from '../models/Quiz.js';
import QuizAnswer from '../models/QuizAnswer.js';
import { CreateQuizRequest, SubmitAnswerRequest } from '../types';

const router = express.Router();

// POST: Progressive submit for quiz answers (one step at a time)
// If a sessionId is provided, update the existing answer doc; otherwise, create a new one
router.post('/:id/answers', async (req: Request<{ id: string }, {}, SubmitAnswerRequest>, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const { sessionId, stepIndex, stepAnswers, calculatedScores } = req.body;

    let answerDoc;
    if (sessionId) {
      // Update existing answer doc for this session
      answerDoc = await QuizAnswer.findById(sessionId);
      if (!answerDoc) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      answerDoc.answers[stepIndex] = stepAnswers;
      if (calculatedScores) {
        answerDoc.calculatedScores = calculatedScores;
      }
      await answerDoc.save();
    } else {
      // Create new answer doc
      answerDoc = new QuizAnswer({
        quizId: req.params.id,
        answers: { [stepIndex]: stepAnswers },
        calculatedScores: calculatedScores || {},
      });
      await answerDoc.save();
    }

    res.status(201).json({ 
      message: 'Step answers submitted', 
      sessionId: answerDoc._id 
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// POST: Create a new quiz
router.post('/', async (req: Request<{}, {}, CreateQuizRequest>, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch a quiz by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    console.log(quiz);
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }
    res.json(quiz);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove a quiz by ID
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const result = await Quiz.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// PATCH: Partially update a quiz by ID
router.patch('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }
    res.json(quiz);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all answers for a specific quiz
router.get('/:id/answers', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const answers = await QuizAnswer.find({ quizId: req.params.id }).sort({ submittedAt: -1 });
    res.json(answers);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch answers by session ID
router.get('/:id/answers/:sessionId', async (req: Request<{ id: string; sessionId: string }>, res: Response): Promise<void> => {
  try {
    const answerDoc = await QuizAnswer.findById(req.params.sessionId);
    if (!answerDoc) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.json(answerDoc);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch all quizzes
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a quiz by ID (full update)
router.put('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }
    res.json(quiz);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

export default router;
