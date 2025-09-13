import express, { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import Step from "../models/Step.js";
import QuizAnswer from "../models/QuizAnswer.js";
import Result from "../models/Result.js";
import Content from "../models/Content.js";
import {
  SubmitAnswerRequest,
  QuizCalculationResponse,
  IQuestionStep,
  IInput,
  IOption,
  IResultScore,
  StepWithInputs,
} from "../types/index.js";

const router = express.Router();

// POST: Progressive submit for quiz answers (one step at a time)
// If a sessionId is provided, update the existing answer doc; otherwise, create a new one
router.post(
  "/:id/answers",
  async (
    req: Request<{ id: string }, {}, SubmitAnswerRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      const { sessionId, stepIndex, stepAnswers, calculatedScores } = req.body;

      let answerDoc;
      if (sessionId) {
        // Update existing answer doc for this session
        answerDoc = await QuizAnswer.findById(sessionId);
        if (!answerDoc) {
          res.status(404).json({ error: "Session not found" });
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
        message: "Step answers submitted",
        sessionId: answerDoc._id,
      });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// POST: Progressive submit for quiz answers (one step at a time) - SLUG VERSION
// If a sessionId is provided, update the existing answer doc; otherwise, create a new one
router.post(
  "/slug/:slug/answers",
  async (
    req: Request<{ slug: string }, {}, SubmitAnswerRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const quiz = await Quiz.findOne({ slug: req.params.slug });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      const { sessionId, stepIndex, stepAnswers, calculatedScores } = req.body;

      let answerDoc;
      if (sessionId) {
        // Update existing answer doc for this session
        answerDoc = await QuizAnswer.findById(sessionId);
        if (!answerDoc) {
          res.status(404).json({ error: "Session not found" });
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
          quizId: quiz._id,
          answers: { [stepIndex]: stepAnswers },
          calculatedScores: calculatedScores || {},
        });
        await answerDoc.save();
      }

      res.status(201).json({
        message: "Step answers submitted",
        sessionId: answerDoc._id,
      });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch all answers for a specific quiz
router.get(
  "/:id/answers",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const answers = await QuizAnswer.find({ quizId: req.params.id }).sort({
        submittedAt: -1,
      });
      res.json(answers);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch answers by session ID
router.get(
  "/:id/answers/:sessionId",
  async (
    req: Request<{ id: string; sessionId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const answerDoc = await QuizAnswer.findById(req.params.sessionId);
      if (!answerDoc) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      res.json(answerDoc);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Calculate quiz results and return travel persona by slug
router.get(
  "/slug/:slug/calculate/:sessionId",
  async (
    req: Request<{ slug: string; sessionId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      // Get the quiz and answer data
      const quiz = await Quiz.findOne({ slug: req.params.slug });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      const answerDoc = await QuizAnswer.findById(req.params.sessionId);
      if (!answerDoc) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      // Calculate persona scores
      const personaScores: Record<
        string,
        { total: number; count: number; average: number }
      > = {};
      let totalQuestions = 0;
      let answeredQuestions = 0;

      // Get all steps for this quiz, sorted by order, with populated personality scores
      const steps = await Step.find({ quizId: quiz._id })
        .populate("inputs.options.resultScores.resultId")
        .sort({ order: 1 });

      // Iterate through all quiz steps to find question steps
      steps.forEach((step, stepIndex) => {
        if (step.type === "question" && "inputs" in step) {
          const questionStep = step as StepWithInputs;

          // Skip steps that contain text inputs (like contact information)
          const hasTextInputs = questionStep.inputs.some(
            (input: IInput) => input.type === "text"
          );
          if (hasTextInputs) {
            return; // Skip this step entirely
          }

          // Get answers for this step using stepIndex
          const stepAnswers = answerDoc.answers[stepIndex.toString()];

          if (stepAnswers) {
            // Process each input in the step
            questionStep.inputs.forEach((input: IInput) => {
              totalQuestions++;
              // Get the answer for this specific input from stepAnswers
              const inputValue = stepAnswers[input.name];

              if (inputValue) {
                answeredQuestions++;
                // Find the selected option
                const selectedOption = input.options?.find(
                  (option: IOption) => option.value === inputValue
                );
                if (selectedOption && selectedOption.resultScores) {
                  // Add scores to persona totals using Result IDs
                  selectedOption.resultScores.forEach((resultScore: any) => {
                    const resultId = resultScore.resultId._id.toString();
                    if (!personaScores[resultId]) {
                      personaScores[resultId] = {
                        total: 0,
                        count: 0,
                        average: 0,
                      };
                    }
                    personaScores[resultId].total += resultScore.score;
                    personaScores[resultId].count += 1;
                  });
                }
              }
            });
          }
        }
      });

      // Calculate averages for display purposes
      Object.keys(personaScores).forEach((persona) => {
        const data = personaScores[persona];
        if (data) {
          data.average = data.count > 0 ? data.total / data.count : 0;
        }
      });

      // Find the highest total score
      const totalsArray = Object.values(personaScores).map(
        (data) => data?.total || 0
      );
      const maxTotal = totalsArray.length > 0 ? Math.max(...totalsArray) : 0;

      // Get result types from the quiz (populated Result references with content)
      const resultTypes = await Result.find({
        _id: { $in: quiz.resultTypes },
      }).populate("content");

      // Convert scores to simple format and create breakdown
      const simpleScores: Record<string, number> = {};
      const breakdown = resultTypes
        .map((type) => {
          const scoreData = personaScores[type._id.toString()];
          const score = scoreData ? scoreData.total : 0;
          simpleScores[type.id] = score;

          const percentage =
            answeredQuestions > 0 ? (score / answeredQuestions) * 100 : 0;
          return {
            type: type, // Include full Result object
            score,
            percentage: Math.round(percentage * 10) / 10,
          };
        })
        .sort((a, b) => b.percentage - a.percentage);

      // Determine primary and secondary types
      const primaryType = breakdown[0]?.type;
      const secondaryType =
        (breakdown[1]?.percentage || 0) > 70 ? breakdown[1]?.type : undefined;

      // Check if user is a Chameleon (has multiple high scores or tied results)
      const highScores = breakdown.filter((item) => item.percentage > 30);

      // Check for tied results (same percentage)
      const topScore = breakdown[0]?.percentage || 0;
      const tiedResults = breakdown.filter(
        (item) => item.percentage === topScore
      );

      const isChameleon =
        // Original logic: 3+ high scores with balanced distribution
        (highScores.length >= 3 &&
          (breakdown[0]?.percentage || 0) < 40 &&
          (breakdown[1]?.percentage || 0) > 25) ||
        // New logic: 2+ tied results at the top
        (tiedResults.length >= 2 && topScore > 0);

      // If Chameleon, use the Chameleon result type (if it exists for this quiz)
      const finalPrimaryType = isChameleon
        ? resultTypes.find((type) => type.id === "chameleon") || primaryType
        : primaryType;

      // Update the answer document with calculated scores (using totals)
      answerDoc.calculatedScores = new Map(
        Object.entries(personaScores).map(([persona, data]) => [
          persona,
          data.total,
        ])
      );
      await answerDoc.save();

      // Create response in the format the frontend expects
      const response: QuizCalculationResponse = {
        primaryType: finalPrimaryType!,
        secondaryType,
        isChameleon,
        scores: simpleScores,
        breakdown,
        totalQuestions: answeredQuestions,
        answeredQuestions,
      };

      res.json(response);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Calculate quiz results and return travel persona by ID
router.get(
  "/:id/calculate/:sessionId",
  async (
    req: Request<{ id: string; sessionId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      // Get the quiz and answer data
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      const answerDoc = await QuizAnswer.findById(req.params.sessionId);
      if (!answerDoc) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      // Calculate persona scores
      const personaScores: Record<
        string,
        { total: number; count: number; average: number }
      > = {};
      let totalQuestions = 0;
      let answeredQuestions = 0;

      // Get all steps for this quiz, sorted by order, with populated personality scores
      const steps = await Step.find({ quizId: req.params.id })
        .populate("inputs.options.resultScores.resultId")
        .sort({ order: 1 });

      // Iterate through all quiz steps to find question steps
      steps.forEach((step, stepIndex) => {
        if (step.type === "question" && "inputs" in step) {
          const questionStep = step as StepWithInputs;

          // Skip steps that contain text inputs (like contact information)
          const hasTextInputs = questionStep.inputs.some(
            (input: IInput) => input.type === "text"
          );
          if (hasTextInputs) {
            return; // Skip this step entirely
          }

          // Get answers for this step using stepIndex
          const stepAnswers = answerDoc.answers[stepIndex.toString()];

          if (stepAnswers) {
            // Process each input in the step
            questionStep.inputs.forEach((input: IInput) => {
              totalQuestions++;
              // Get the answer for this specific input from stepAnswers
              const inputValue = stepAnswers[input.name];

              if (inputValue) {
                answeredQuestions++;
                // Find the selected option
                const selectedOption = input.options?.find(
                  (option: IOption) => option.value === inputValue
                );
                if (selectedOption && selectedOption.resultScores) {
                  // Add scores to persona totals using Result IDs
                  selectedOption.resultScores.forEach((resultScore: any) => {
                    const resultId = resultScore.resultId._id.toString();
                    if (!personaScores[resultId]) {
                      personaScores[resultId] = {
                        total: 0,
                        count: 0,
                        average: 0,
                      };
                    }
                    personaScores[resultId].total += resultScore.score;
                    personaScores[resultId].count += 1;
                  });
                }
              }
            });
          }
        }
      });

      // Calculate averages for display purposes
      Object.keys(personaScores).forEach((persona) => {
        const data = personaScores[persona];
        if (data) {
          data.average = data.count > 0 ? data.total / data.count : 0;
        }
      });

      // Get the totals array for percentage calculations
      const totalsArray = Object.values(personaScores).map(
        (data) => data?.total || 0
      );
      const maxTotal = totalsArray.length > 0 ? Math.max(...totalsArray) : 0;

      // Get result types from the quiz (populated Result references with content)
      const resultTypes = await Result.find({
        _id: { $in: quiz.resultTypes },
      }).populate("content");

      // Convert scores to simple format and create breakdown
      const simpleScores: Record<string, number> = {};
      const breakdown = resultTypes
        .map((type) => {
          const scoreData = personaScores[type._id.toString()];
          const score = scoreData ? scoreData.total : 0;
          simpleScores[type.id] = score;

          const percentage =
            answeredQuestions > 0 ? (score / answeredQuestions) * 100 : 0;
          return {
            type: type, // Include full Result object
            score,
            percentage: Math.round(percentage * 10) / 10,
          };
        })
        .sort((a, b) => b.percentage - a.percentage);

      // Determine primary and secondary types
      const primaryType = breakdown[0]?.type;
      const secondaryType =
        (breakdown[1]?.percentage || 0) > 70 ? breakdown[1]?.type : undefined;

      // Check if user is a Chameleon (has multiple high scores or tied results)
      const highScores = breakdown.filter((item) => item.percentage > 30);

      // Check for tied results (same percentage)
      const topScore = breakdown[0]?.percentage || 0;
      const tiedResults = breakdown.filter(
        (item) => item.percentage === topScore
      );

      const isChameleon =
        // Original logic: 3+ high scores with balanced distribution
        (highScores.length >= 3 &&
          (breakdown[0]?.percentage || 0) < 40 &&
          (breakdown[1]?.percentage || 0) > 25) ||
        // New logic: 2+ tied results at the top
        (tiedResults.length >= 2 && topScore > 0);

      // If Chameleon, use the Chameleon result type (if it exists for this quiz)
      const finalPrimaryType = isChameleon
        ? resultTypes.find((type) => type.id === "chameleon") || primaryType
        : primaryType;

      // Update the answer document with calculated scores (using totals)
      answerDoc.calculatedScores = new Map(
        Object.entries(personaScores).map(([persona, data]) => [
          persona,
          data.total,
        ])
      );
      await answerDoc.save();

      // Return the calculated result
      res.json({
        primaryType: finalPrimaryType,
        secondaryType,
        breakdown,
        answers: answerDoc.answers,
        isChameleon,
        totalQuestions,
        answeredQuestions,
        completionRate:
          totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
      });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
