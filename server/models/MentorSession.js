const mongoose = require('mongoose');

const MentorSessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Mock Interview', 'Doubt Clearing', 'Career Guidance', 'Project Review'], required: true },
  status: { type: String, enum: ['Requested', 'Scheduled', 'Completed', 'Cancelled'], default: 'Requested' },
  date: { type: Date, required: true },
  duration: { type: Number, default: 45 }, // minutes
  meetingLink: { type: String },
  notes: { type: String },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('MentorSession', MentorSessionSchema);
