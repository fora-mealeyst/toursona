// server/models/Quiz.js
const mongoose = require('mongoose');

const InputSchema = new mongoose.Schema({
  label: String,
  type: String,
  name: String,
  required: Boolean,
  options: [String]
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  steps: [{
    title: String,
    inputs: [InputSchema]
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', QuizSchema);
