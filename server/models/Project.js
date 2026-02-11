const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }], // ["React", "Node", "MongoDB"]
  
  // Links
  githubLink: { type: String },
  liveLink: { type: String },
  
  // Status
  status: { type: String, enum: ['Idea', 'In Progress', 'Completed', 'Deployed'], default: 'In Progress' },
  confidenceScore: { type: Number, min: 0, max: 100, default: 50 }, // How confident am I explaining this?
  
  // Interview Prep Checklist
  interviewPrep: {
    architectureExplained: { type: Boolean, default: false },
    challengesDocumented: { type: Boolean, default: false },
    futureScopeDefined: { type: Boolean, default: false },
    readmePolished: { type: Boolean, default: false }
  },
  
  features: [{ type: String }], // Key features list
  
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
