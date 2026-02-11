const mongoose = require('mongoose');

const DayLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  
  // Daily Summary
  mood: { type: String, enum: ['happy', 'neutral', 'sad', 'stressed', 'excited', 'tired'], default: 'neutral' },
  energyLevel: { type: Number, min: 1, max: 10, default: 5 },
  totalTime: { type: Number, default: 0 }, // in minutes
  notes: { type: String },
  
  // Activities Log
  activities: [{
    type: { type: String, enum: ['Problem Solving', 'Learning', 'Project Work', 'Mock Interview', 'Revision', 'Other'], required: true },
    title: { type: String }, // e.g., "Solved 3 DP Problems"
    duration: { type: Number }, // minutes
    
    // References (Optional)
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    
    details: { type: String } // Free text details
  }],

  // Metrics for the day
  metrics: {
    problemsSolved: { type: Number, default: 0 },
    topicsCovered: { type: Number, default: 0 },
    commitsMade: { type: Number, default: 0 },
    completedRounds: [{ type: String }] // e.g. ["DSA", "Core", "Aptitude", "Projects"]
  }

}, { timestamps: true });

DayLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DayLog', DayLogSchema);
