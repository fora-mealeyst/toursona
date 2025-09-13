import express from "express";
import quizRoutes from "./quiz.js";
import quizStepsRoutes from "./steps.js";
import resultsRoutes from "./results.js";
import quizAnswersRoutes from "./answers.js";

const router = express.Router();

// Mount all the sub-routers
router.use("/", quizRoutes);
router.use("/", quizStepsRoutes);
router.use("/", resultsRoutes);
router.use("/", quizAnswersRoutes);

export default router;
