const mongoose = require('mongoose');

const QuizAnswerSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: {}, // Store answers as a mixed object
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizAnswer', QuizAnswerSchema);
