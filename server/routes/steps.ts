import express, { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import Step from "../models/Step.js";

const router = express.Router();

// GET: Fetch all steps for a specific quiz by slug
router.get(
  "/slug/:slug/steps",
  async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findOne({ slug: req.params.slug });
      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return;
      }
      const steps = await Step.find({ quizId: quiz._id }).sort({
        order: 1,
      });
      res.json(steps);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch all steps for a specific quiz by ID
router.get(
  "/:id/steps",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const steps = await Step.find({ quizId: req.params.id }).sort({
        order: 1,
      });
      res.json(steps);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// POST: Create a new step for a specific quiz
router.post(
  "/:id/steps",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const step = new Step({
        ...req.body,
        quizId: req.params.id,
      });
      await step.save();

      // Add the step to the quiz's steps array
      await Quiz.findByIdAndUpdate(req.params.id, {
        $push: { steps: step._id },
      });

      res.status(201).json(step);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// GET: Fetch a specific step
router.get(
  "/:id/steps/:stepId",
  async (
    req: Request<{ id: string; stepId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const step = await Step.findOne({
        _id: req.params.stepId,
        quizId: req.params.id,
      });
      if (!step) {
        res.status(404).json({ error: "Step not found" });
        return;
      }
      res.json(step);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// PUT: Update a specific step
router.put(
  "/:id/steps/:stepId",
  async (
    req: Request<{ id: string; stepId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const step = await Step.findOneAndUpdate(
        { _id: req.params.stepId, quizId: req.params.id },
        req.body,
        { new: true }
      );
      if (!step) {
        res.status(404).json({ error: "Step not found" });
        return;
      }
      res.json(step);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE: Delete a specific step
router.delete(
  "/:id/steps/:stepId",
  async (
    req: Request<{ id: string; stepId: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const result = await Step.findOneAndDelete({
        _id: req.params.stepId,
        quizId: req.params.id,
      });
      if (!result) {
        res.status(404).json({ error: "Step not found" });
        return;
      }

      // Remove the step from the quiz's steps array
      await Quiz.findByIdAndUpdate(req.params.id, {
        $pull: { steps: req.params.stepId },
      });

      res.json({ message: "Step deleted" });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
