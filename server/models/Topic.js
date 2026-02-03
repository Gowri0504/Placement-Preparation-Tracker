const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  round: { type: Number, required: true }, // 1, 2, 3, 4
  section: { type: String }, // e.g., "Quantitative Aptitude", "Data Structures"
  isCompleted: { type: Boolean, default: false }, // "Mark as Mastered"
  timesPracticed: { type: Number, default: 0 }
});

module.exports = mongoose.model('Topic', TopicSchema);
