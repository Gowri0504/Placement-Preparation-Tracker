const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['DSA', 'Web Dev', 'Core Subjects', 'Aptitude', 'Company Specific', 'System Design', 'DevOps', 'Languages'], required: true },
  type: { type: String, enum: ['Video', 'Article', 'PDF', 'Cheatsheet', 'Link'], default: 'Link' },
  url: { type: String, required: true },
  tags: [String],
  isPublic: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
