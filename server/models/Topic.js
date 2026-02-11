const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Binary Tree"
  category: { type: String, required: true }, // e.g., "DSA", "Core Subjects", "Web Dev"
  subCategory: { type: String }, // e.g., "Trees", "DBMS", "Frontend"
  
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  
  description: { type: String },
  conceptNotes: { type: String }, // Long form Markdown content
  interviewInsights: [{
    point: String,
    type: { type: String, enum: ['Trap', 'Edge Case', 'Variation', 'Cheat Sheet'] }
  }],
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['Video', 'Article', 'Course', 'Doc'] }
  }],
  
  // Tag for filtering
  tags: [{ type: String }] 
});

// Compound index to ensure unique topics within a category
TopicSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Topic', TopicSchema);
