const mongoose = require('mongoose');

const DayLogSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format YYYY-MM-DD
  mood: { type: String, enum: ['happy', 'neutral', 'sad', 'stressed', 'excited'], default: 'neutral' },
  totalTime: { type: Number, default: 0 },
  notes: { type: String },
  rounds: {
    round1: {
      completed: { type: Boolean, default: false },
      topics: [{
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        name: String,
        category: String,
        timeSpent: Number,
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
      }]
    },
    round2: {
      completed: { type: Boolean, default: false },
      topics: [{
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        name: String,
        category: String, 
        problemsCount: Number,
        mistakes: String,
        platform: String
      }]
    },
    round3: {
      completed: { type: Boolean, default: false },
      topics: [{
        topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
        name: String, 
        questionsPracticed: Boolean,
        explainedAloud: Boolean,
        tag: { type: String, enum: ['Weak', 'Strong', 'Neutral'] }
      }]
    },
    round4: {
      completed: { type: Boolean, default: false },
      activities: [{
        name: String, 
        practiced: Boolean,
        recorded: Boolean
      }]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('DayLog', DayLogSchema);
