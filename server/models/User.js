const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  
  // Profile Information
  profile: {
    fullName: { type: String },
    college: { type: String },
    degree: { type: String },
    graduationYear: { type: Number },
    githubProfile: { type: String },
    linkedinProfile: { type: String },
    portfolio: { type: String },
    targetRole: { type: String, default: 'Software Engineer' },
    languageProficiency: [{
      language: { type: String, enum: ['C', 'C++', 'Java', 'Python', 'JavaScript'] },
      confidence: { type: Number, default: 0 }, // 0-100
      problemSolvingComfort: { type: Number, default: 0 }, // 0-100
      interviewReadiness: { type: Number, default: 0 } // 0-100
    }]
  },

  // Gamification & Progress
  gamification: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    badges: [{ 
      name: String, 
      icon: String, 
      earnedDate: Date,
      description: String 
    }],
  },

  // Settings
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    notifications: { type: Boolean, default: true },
  },

  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
