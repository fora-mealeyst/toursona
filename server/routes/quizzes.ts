import express, { Request, Response } from 'express';
import Quiz from '../models/Quiz.js';
import QuizAnswer from '../models/QuizAnswer.js';
import Result, { IResult } from '../models/Result.js';
import { CreateQuizRequest, SubmitAnswerRequest, QuizCalculationResponse } from '../types';

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
      // Merge the new step answers with existing answers
      answerDoc.answers = { ...answerDoc.answers, [stepIndex]: stepAnswers };
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

// GET: Calculate quiz results and return travel persona
router.get('/:id/calculate/:sessionId', async (req: Request<{ id: string; sessionId: string }>, res: Response): Promise<void> => {
  try {
    // Get the quiz and answer data
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const answerDoc = await QuizAnswer.findById(req.params.sessionId);
    if (!answerDoc) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // Calculate persona scores
    const personaScores: Record<string, { total: number; count: number; average: number }> = {};
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    // Iterate through all quiz steps to find question steps
    quiz.steps.forEach((step, stepIndex) => {
      if (step.type === 'question' && 'inputs' in step) {
        const stepAnswers = answerDoc.answers[stepIndex.toString()];
        if (stepAnswers) {
          // Process each input in the step
          step.inputs.forEach((input: any) => {
            totalQuestions++;
            const selectedValue = stepAnswers[input.name];
            if (selectedValue) {
              answeredQuestions++;
              // Find the selected option
              const selectedOption = input.options?.find((option: any) => option.value === selectedValue);
              if (selectedOption && selectedOption.scores) {
                // Add scores to persona totals
                selectedOption.scores.forEach((score: number, persona: string) => {
                  if (!personaScores[persona]) {
                    personaScores[persona] = { total: 0, count: 0, average: 0 };
                  }
                  personaScores[persona].total += score;
                  personaScores[persona].count += 1;
                });
              }
            }
          });
        }
      }
    });

    // Calculate averages for display purposes
    Object.keys(personaScores).forEach(persona => {
      const data = personaScores[persona];
      if (data) {
        data.average = data.count > 0 ? data.total / data.count : 0;
      }
    });

    // Find the highest total score
    const totalsArray = Object.values(personaScores).map(data => data?.total || 0);
    const maxTotal = totalsArray.length > 0 ? Math.max(...totalsArray) : 0;
    
    // Fetch all personality types from the database
    const personalityTypes = await Result.find({}).lean() as IResult[];

    // Convert scores to simple format and create breakdown
    const simpleScores: Record<string, number> = {};
    const breakdown = personalityTypes.map(type => {
      const scoreData = personaScores[type.name];
      const score = scoreData ? scoreData.total : 0;
      simpleScores[type.id] = score;
      
      const percentage = answeredQuestions > 0 ? (score / answeredQuestions) * 100 : 0;
      return {
        type: type, // Include full personality type object
        score,
        percentage: Math.round(percentage * 10) / 10
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Determine primary and secondary types
    const primaryType = breakdown[0]?.type;
    const secondaryType = (breakdown[1]?.percentage || 0) > 70 ? breakdown[1]?.type : undefined;

    // Check if user is a Chameleon (has multiple high scores)
    const highScores = breakdown.filter(item => item.percentage > 30);
    const isChameleon = highScores.length >= 3 && 
      (breakdown[0]?.percentage || 0) < 40 && 
      (breakdown[1]?.percentage || 0) > 25;

    // If Chameleon, use the Chameleon personality type
    const finalPrimaryType = isChameleon ? 
      (personalityTypes.find(type => type.id === 'chameleon') || primaryType) : 
      primaryType;

    // Update the answer document with calculated scores (using totals)
    answerDoc.calculatedScores = new Map(Object.entries(personaScores).map(([persona, data]) => [persona, data.total]));
    await answerDoc.save();

    // Create response in the format the frontend expects
    const response: QuizCalculationResponse = {
      primaryType: finalPrimaryType!,
      secondaryType,
      isChameleon,
      scores: simpleScores,
      breakdown,
      totalQuestions: answeredQuestions,
      answeredQuestions
    };

    res.json(response);
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
