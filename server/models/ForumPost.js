const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'DSA', 'Interview Experience', 'Placement News', 'Referrals'], default: 'General' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  isAnonymous: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', ForumPostSchema);
