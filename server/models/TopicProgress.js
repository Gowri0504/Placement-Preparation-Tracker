const mongoose = require('mongoose');

const TopicProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  
  status: { type: String, enum: ['Not Started', 'In Progress', 'Mastered'], default: 'Not Started' },
  confidenceScore: { type: Number, default: 0 }, // 0-100%
  
  // Advanced metrics
  accuracy: { type: Number, default: 0 },
  avgTimePerProblem: { type: Number, default: 0 },
  reattemptSuccess: { type: Number, default: 0 },
  patternMastery: { type: Number, default: 0 },
  
  totalProblemsSolved: { type: Number, default: 0 },
  lastPracticed: { type: Date },
  
  notes: { type: String }
}, { timestamps: true });

TopicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model('TopicProgress', TopicProgressSchema);
