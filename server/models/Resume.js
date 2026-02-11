const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String },
  content: { type: String }, // Parsed text content
  atsScore: { type: Number, default: 0 },
  analysis: {
    strengths: [String],
    weaknesses: [String],
    missingKeywords: [String],
    formattingTips: [String]
  },
  skillMatch: [{
    skill: String,
    matchLevel: { type: Number, min: 0, max: 100 }
  }],
  lastAnalyzed: { type: Date, default: Date.now },
  versions: [{
    versionName: String,
    url: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
