import express, { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

const router = express.Router();

// GET: Fetch all result types for a specific quiz by slug
router.get(
  "/slug/:slug/results",
  async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findOne({ slug: req.params.slug }).populate({
        path: "resultTypes",
        populate: {
          path: "content",
        },
      });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json(quiz.resultTypes);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch all result types for a specific quiz by ID
router.get(
  "/:id/results",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.id).populate({
        path: "resultTypes",
        populate: {
          path: "content",
        },
      });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json(quiz.resultTypes);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch only result IDs for a specific quiz
router.get(
  "/:id/results/ids",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.id).populate({
        path: "resultTypes",
        populate: {
          path: "content",
        },
      });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      // Return just the IDs in a simple format
      const resultIds = quiz.resultTypes.map((result: any) => ({
        id: result.id,
        name: result.name,
      }));

      res.json(resultIds);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// POST: Create a new result type for a specific quiz
router.post(
  "/:id/results",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      // First, verify the quiz exists
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      // Create a new Result
      const result = new Result(req.body);
      await result.save();

      // Add the Result ID to the quiz's resultTypes array
      await Quiz.findByIdAndUpdate(req.params.id, {
        $push: { resultTypes: result._id },
      });

      res.status(201).json(result);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// PUT: Update a result type for a specific quiz
router.put(
  "/:id/results/:resultId",
  async (
    req: Request<{ id: string; resultId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      // Check if the result ID is in the quiz's resultTypes array
      const resultExists = quiz.resultTypes.some(
        (r) => r.toString() === req.params.resultId
      );

      if (!resultExists) {
        res.status(404).json({ error: "Result not found in this quiz" });
        return;
      }

      // Update the Result directly
      const result = await Result.findByIdAndUpdate(
        req.params.resultId,
        req.body,
        { new: true }
      );

      if (!result) {
        res.status(404).json({ error: "Result not found" });
        return;
      }

      res.json(result);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE: Delete a result type for a specific quiz
router.delete(
  "/:id/results/:resultId",
  async (
    req: Request<{ id: string; resultId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }

      // Check if the result ID is in the quiz's resultTypes array
      const resultExists = quiz.resultTypes.some(
        (r) => r.toString() === req.params.resultId
      );

      if (!resultExists) {
        res.status(404).json({ error: "Result not found in this quiz" });
        return;
      }

      // Remove the result ID from the quiz's resultTypes array
      await Quiz.findByIdAndUpdate(req.params.id, {
        $pull: { resultTypes: req.params.resultId },
      });

      // Delete the Result
      await Result.findByIdAndDelete(req.params.resultId);

      res.json({ message: "Result deleted" });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
