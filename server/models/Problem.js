const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  link: { type: String }, // LeetCode/GFG link
  platform: { type: String, enum: ['LeetCode', 'GFG', 'CodeStudio', 'HackerRank', 'Other'], default: 'LeetCode' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String }, // e.g., "Arrays", "DP"
  
  // Status tracking
  status: { type: String, enum: ['Solved', 'Attempted', 'Pending', 'Revise'], default: 'Solved' },
  timeTaken: { type: Number }, // in minutes
  isOptimal: { type: Boolean, default: false }, // Did user find optimal solution?
  patternUsed: { type: String }, // e.g., "Sliding Window", "Monotonic Stack"
  
  notes: { type: String }, // My approach/learnings
  
  // Dates
  solvedAt: { type: Date, default: Date.now },
  nextRevisionDate: { type: Date }, // For spaced repetition
  
  // Revisions
  attempts: [{
    date: { type: Date, default: Date.now },
    timeTaken: Number,
    status: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
