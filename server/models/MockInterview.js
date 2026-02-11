const mongoose = require('mongoose');

const MockInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Technical', 'HR', 'System Design', 'Behavioral'], required: true },
  companyContext: { type: String }, // Target company if any
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  questions: [{
    question: { type: String, required: true },
    userAnswer: { type: String },
    feedback: { type: String },
    score: { type: Number, min: 0, max: 10 }
  }],
  overallScore: { type: Number, default: 0 },
  overallFeedback: { type: String },
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MockInterview', MockInterviewSchema);
