import express, { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import { CreateQuizRequest } from "../types";

const router = express.Router();

// POST: Create a new quiz
router.post(
  "/",
  async (
    req: Request<{}, {}, CreateQuizRequest>,
    res: Response
  ): Promise<void> => {
    try {
      console.log(req.body);
      const quiz = new Quiz(req.body);
      await quiz.save();
      res.status(201).json(quiz);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch a quiz by slug
router.get(
  "/slug/:slug",
  async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findOne({ slug: req.params.slug })
        .populate({
          path: "steps",
          options: { sort: { order: 1 } },
        })
        .populate("resultTypes");
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json(quiz);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch a quiz by ID
router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.id)
        .populate({
          path: "steps",
          options: { sort: { order: 1 } },
        })
        .populate("resultTypes");
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json(quiz);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch all quizzes
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const quizzes = await Quiz.find()
      .populate({
        path: "steps",
        options: { sort: { order: 1 } },
      })
      .populate("resultTypes")
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a quiz by ID (full update)
router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json(quiz);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// PATCH: Partially update a quiz by ID
router.patch(
  "/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json(quiz);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE: Remove a quiz by ID
router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const result = await Quiz.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      res.json({ message: "Quiz deleted" });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
