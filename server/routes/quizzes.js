// server/routes/quizzes.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAnswer = require('../models/QuizAnswer');
// POST: Progressive submit for quiz answers (one step at a time)
// If a sessionId is provided, update the existing answer doc; otherwise, create a new one
router.post('/:id/answers', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const { sessionId, stepIndex, stepAnswers } = req.body;
    console.log(stepAnswers)
    let answerDoc;
    if (sessionId) {
      // Update existing answer doc for this session
      answerDoc = await QuizAnswer.findById(sessionId);
      if (!answerDoc) return res.status(404).json({ error: 'Session not found' });
      answerDoc.answers[stepIndex] = stepAnswers;
      await answerDoc.save();
    } else {
      // Create new answer doc
      answerDoc = new QuizAnswer({
        quizId: req.params.id,
        answers: { [stepIndex]: stepAnswers },
      });
      await answerDoc.save();
    }
    res.status(201).json({ message: 'Step answers submitted', sessionId: answerDoc._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: Create a new quiz
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch a quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    console.log(quiz)
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a quiz by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Quiz.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH: Partially update a quiz by ID
router.patch('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
