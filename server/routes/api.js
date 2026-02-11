const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Topic = require('../models/Topic');
const TopicProgress = require('../models/TopicProgress');
const DayLog = require('../models/DayLog');
const Problem = require('../models/Problem');
const Project = require('../models/Project');
const Company = require('../models/Company');
const Resume = require('../models/Resume');
const MockInterview = require('../models/MockInterview');
const Resource = require('../models/Resource');
const MentorSession = require('../models/MentorSession');
const ForumPost = require('../models/ForumPost');

const { protect, authorize } = require('../middleware/authMiddleware');

// --- HELPER: Generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// --- HELPER: Award Badges ---
const checkAndAwardBadges = async (user) => {
  const badges = [];
  const existingBadges = user.gamification?.badges?.map(b => b.name) || [];

  // 1. First Problem Badge
  const problemCount = await Problem.countDocuments({ userId: user._id, status: 'Solved' });
  if (problemCount >= 1 && !existingBadges.includes('First Step')) {
    badges.push({ name: 'First Step', icon: '🎯', description: 'Solved your first problem!', earnedDate: new Date() });
  }

  // 2. 10 Problems Badge
  if (problemCount >= 10 && !existingBadges.includes('Problem Solver')) {
    badges.push({ name: 'Problem Solver', icon: '⚔️', description: 'Solved 10 problems!', earnedDate: new Date() });
  }

  // 3. High Readiness Badge
  // (We'll assume readiness is calculated elsewhere, but for now check if they have high XP)
  if (user.gamification?.xp >= 500 && !existingBadges.includes('Rising Star')) {
    badges.push({ name: 'Rising Star', icon: '⭐', description: 'Reached 500 XP!', earnedDate: new Date() });
  }

  if (badges.length > 0) {
    user.gamification.badges.push(...badges);
    user.gamification.xp += badges.length * 50; // Bonus XP for badges
    await user.save();
    return badges;
  }
  return [];
};

// ==========================================
// AUTH & USER ROUTES
// ==========================================

router.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gamification: user.gamification,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/auth/me', protect, async (req, res) => {
  res.json(req.user);
});

router.put('/user/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profile = { ...user.profile, ...req.body };
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// TOPICS & PROGRESS ROUTES
// ==========================================

// Get all topics (Public catalog)
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ category: 1, subCategory: 1, name: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Progress on Topics
router.get('/topics/progress', protect, async (req, res) => {
  try {
    const progress = await TopicProgress.find({ userId: req.user._id }).populate('topicId');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Topic Progress
router.post('/topics/progress', protect, async (req, res) => {
  try {
    const { topicId, status, confidenceScore } = req.body;
    
    const progress = await TopicProgress.findOneAndUpdate(
      { userId: req.user._id, topicId },
      { 
        $set: { status, confidenceScore, lastPracticed: new Date() },
        $inc: { totalProblemsSolved: 0 } // Increment logic can be added separately
      },
      { new: true, upsert: true }
    );

    // Update Gamification
    const user = await User.findById(req.user._id);
    user.gamification.xp += status === 'Completed' ? 50 : 5; // 50 XP for completion, 5 for starting
    await checkAndAwardBadges(user);

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// DAY LOG ROUTES
// ==========================================

router.get('/daylog/:date', protect, async (req, res) => {
  try {
    const log = await DayLog.findOne({ 
      date: req.params.date,
      userId: req.user._id 
    }).populate('activities.problems activities.topics activities.project');
    
    if (!log) return res.json(null); // Return null if no log exists for that day
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/daylog', protect, async (req, res) => {
  try {
    const { date, mood, activities, notes, metrics } = req.body;
    
    // Check if exists
    let log = await DayLog.findOne({ date, userId: req.user._id });
    
    if (log) {
      log.mood = mood || log.mood;
      log.activities = activities || log.activities;
      log.notes = notes || log.notes;
      log.metrics = metrics || log.metrics;
      log.totalTime = (activities || []).reduce((acc, curr) => acc + (curr.duration || 0), 0);
      await log.save();
    } else {
      log = await DayLog.create({
        userId: req.user._id,
        date,
        mood,
        activities,
        notes,
        metrics,
        totalTime: (activities || []).reduce((acc, curr) => acc + (curr.duration || 0), 0)
      });
      
      // Update User Streak
      // (Simple logic: if yesterday had a log, increment streak, else reset)
      // Implementation omitted for brevity, but recommended for full gamification
    }
    
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/daylogs/all', protect, async (req, res) => {
  try {
    // Get all logs for heatmap
    const logs = await DayLog.find({ userId: req.user._id }, { date: 1, metrics: 1, totalTime: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// PROBLEMS, PROJECTS, COMPANIES ROUTES
// ==========================================

// PROBLEMS
router.get('/problems', protect, async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user._id }).sort({ solvedAt: -1 });
    res.json(problems);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/problems', protect, async (req, res) => {
  try {
    const problem = await Problem.create({ ...req.body, userId: req.user._id });
    
    // Update Gamification
    const user = await User.findById(req.user._id);
    user.gamification.xp += 10; // 10 XP per problem
    await checkAndAwardBadges(user);
    
    res.json(problem);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PROJECTS
router.get('/projects', protect, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/projects', protect, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, userId: req.user._id });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// COMPANIES
router.get('/companies', protect, async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user._id });
    res.json(companies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/companies', protect, async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, userId: req.user._id });
    res.json(company);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// DASHBOARD ANALYTICS
// ==========================================

router.get('/analytics', protect, async (req, res) => {
  try {
    // 1. Problem Counts by Difficulty
    const difficultyCounts = await Problem.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    // 2. Topic Mastery Stats
    const topicStats = await TopicProgress.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Activity last 7 days (Handled by DayLog fetch usually, but here for summary)
    
    res.json({
      difficultyCounts,
      topicStats
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// RANKING & LEADERBOARD
// ==========================================

router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({}, 'username gamification profile role')
      .sort({ 'gamification.xp': -1 })
      .limit(50);
    
    // In a real app, we would calculate PRS and sort by it
    // For now, we'll return users sorted by XP as a proxy for ranking
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/readiness-score', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Accuracy (Correct / Total Attempts)
    const problems = await Problem.find({ userId });
    const totalAttempts = problems.reduce((acc, p) => acc + (p.attempts?.length || 1), 0);
    const solvedProblems = problems.filter(p => p.status === 'Solved').length;
    const accuracy = totalAttempts > 0 ? (solvedProblems / totalAttempts) : 0;

    // 2. Difficulty Score (Easy=1, Medium=2, Hard=3)
    const difficultyPoints = problems.reduce((acc, p) => {
      const weight = p.difficulty === 'Hard' ? 3 : p.difficulty === 'Medium' ? 2 : 1;
      return acc + (p.status === 'Solved' ? weight : 0);
    }, 0);
    const maxPossibleDifficulty = problems.length * 3;
    const difficultyScore = maxPossibleDifficulty > 0 ? (difficultyPoints / maxPossibleDifficulty) : 0;

    // 3. Consistency (Based on completed rounds in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    const logs = await DayLog.find({ 
      userId, 
      date: { $gte: thirtyDaysAgoStr } 
    });
    
    const totalPossibleRounds = 30 * 4; // 30 days * 4 rounds
    const completedRoundsCount = logs.reduce((acc, log) => acc + (log.metrics?.completedRounds?.length || 0), 0);
    const consistency = Math.min(completedRoundsCount / 60, 1); // 60/120 rounds is 100% consistency for score (avg 2 rounds/day)

    // 4. Core CS Coverage
    const totalCoreTopics = await Topic.countDocuments({ category: 'Core Subjects' });
    const completedCoreTopics = await TopicProgress.countDocuments({ 
      userId, 
      status: 'Completed'
      // We should ideally filter by category here too, but TopicProgress doesn't have category
      // In a real app, we'd join with Topic
    });
    const coreCoverage = totalCoreTopics > 0 ? Math.min(completedCoreTopics / totalCoreTopics, 1) : 0;

    // 5. Time Efficiency (Mock - comparing timeTaken vs benchmark)
    const timeEfficiency = 0.8; // Placeholder

    // PRS = (Accuracy × 30%) + (Difficulty Score × 25%) + (Consistency × 20%) + (Time Efficiency × 15%) + (Core CS Coverage × 10%)
    const prs = (
      (accuracy * 0.3) + 
      (difficultyScore * 0.25) + 
      (consistency * 0.2) + 
      (timeEfficiency * 0.15) + 
      (coreCoverage * 0.1)
    ) * 100;

    res.json({
      prs: Math.round(prs),
      breakdown: {
        accuracy: Math.round(accuracy * 100),
        difficulty: Math.round(difficultyScore * 100),
        consistency: Math.round(consistency * 100),
        coreCoverage: Math.round(coreCoverage * 100),
        timeEfficiency: Math.round(timeEfficiency * 100)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Batch Overview
router.get('/admin/batch-stats', protect, authorize('admin', 'mentor'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalProblems = await Problem.countDocuments();
    
    res.json({
      totalStudents: totalUsers,
      totalProblemsSolved: totalProblems,
      // Add more aggregate stats here
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// RESUME INTELLIGENCE
// ==========================================

router.get('/resume', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/resume/analyze', protect, async (req, res) => {
  try {
    const { content } = req.body;
    
    // Mock ATS Analysis logic
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const analysis = {
      strengths: ['Clear structure', 'Strong technical skills section', 'Good action verbs'],
      weaknesses: ['Lack of quantifiable metrics', 'Summary could be more impactful'],
      missingKeywords: ['Distributed Systems', 'Cloud Native', 'CI/CD'],
      formattingTips: ['Use consistent date formats', 'Increase font size for headers']
    };

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user._id },
      { 
        content, 
        atsScore: score, 
        analysis,
        lastAnalyzed: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// INTERVIEW PREPARATION
// ==========================================

router.get('/interviews', protect, async (req, res) => {
  try {
    const interviews = await MockInterview.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(interviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/interviews/start', protect, async (req, res) => {
  try {
    const { type, difficulty, companyContext } = req.body;
    
    // Mock Question Generation
    const mockQuestions = [
      { question: 'Tell me about yourself and your background.' },
      { question: 'Explain the difference between a process and a thread.' },
      { question: 'Describe a challenging project you worked on.' }
    ];

    const interview = await MockInterview.create({
      userId: req.user._id,
      type,
      difficulty,
      companyContext,
      questions: mockQuestions,
      status: 'In Progress'
    });
    
    res.json(interview);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/interviews/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, userAnswer }
    const interview = await MockInterview.findById(req.params.id);
    
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    // Mock Evaluation logic
    let totalScore = 0;
    interview.questions = interview.questions.map((q, idx) => {
      const score = Math.floor(Math.random() * 4) + 6; // 6-10
      totalScore += score;
      return {
        ...q,
        userAnswer: answers[idx]?.userAnswer || '',
        score,
        feedback: 'Good answer, but could be more specific with examples.'
      };
    });

    interview.overallScore = Math.round((totalScore / (interview.questions.length * 10)) * 100);
    interview.overallFeedback = 'Solid performance. Focus on explaining technical tradeoffs more clearly.';
    interview.status = 'Completed';
    
    await interview.save();
    res.json(interview);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// RESOURCE LIBRARY
// ==========================================

router.get('/resources', protect, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/resources', protect, authorize('admin', 'mentor'), async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// MENTORSHIP MODULE
// ==========================================

router.get('/mentors', protect, async (req, res) => {
  try {
    const mentors = await User.find({ role: { $in: ['mentor', 'admin'] } }, 'username profile email');
    res.json(mentors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/mentorship/sessions', protect, async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { studentId: req.user._id } : { mentorId: req.user._id };
    const sessions = await MentorSession.find(query)
      .populate('mentorId', 'username profile')
      .populate('studentId', 'username profile')
      .sort({ date: -1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/mentorship/sessions', protect, async (req, res) => {
  try {
    const session = await MentorSession.create({ ...req.body, studentId: req.user._id });
    res.status(201).json(session);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ==========================================
// COMMUNITY FORUM
// ==========================================

router.get('/forum/posts', protect, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const posts = await ForumPost.find(filter)
      .populate('authorId', 'username profile')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/forum/posts', protect, async (req, res) => {
  try {
    const post = await ForumPost.create({ ...req.body, authorId: req.user._id });
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/forum/posts/:id/upvote', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    const index = post.upvotes.indexOf(req.user._id);
    if (index === -1) {
      post.upvotes.push(req.user._id);
    } else {
      post.upvotes.splice(index, 1);
    }
    await post.save();
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
