const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  tier: { type: String, enum: ['Tier 1', 'Tier 2', 'Tier 3', 'Startup', 'MNC'], default: 'Tier 1' },
  
  // Status
  status: { type: String, enum: ['Target', 'Applied', 'OA Received', 'Interview Scheduled', 'Offer', 'Rejected'], default: 'Target' },
  
  // Preparation
  readinessScore: { type: Number, default: 0 }, // 0-100%
  targetDate: { type: Date },
  
  // Specific requirements
  notes: { type: String }, // "Focus on DP", "Asks about projects"
  
  // Checklist
  checklist: [{
    task: String,
    isCompleted: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
