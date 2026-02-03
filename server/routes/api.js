const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Topic = require('../models/Topic');
const DayLog = require('../models/DayLog');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// --- AUTH ROUTES ---

// Signup
router.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

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
    if (error && error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ message: `${field} already in use` });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Me
router.get('/auth/me', protect, async (req, res) => {
  res.json(req.user);
});


// --- DATA ROUTES ---

// Get all topics (Public)
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ round: 1, section: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get day log by date (Protected)
router.get('/daylog/:date', protect, async (req, res) => {
  try {
    const log = await DayLog.findOne({ 
      date: req.params.date,
      userId: req.user._id 
    });
    
    if (!log) {
      // Return empty structure if not found
      return res.json({ date: req.params.date, rounds: {}, isNew: true });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all logs for user (Protected) - For Git-style heatmap & Progress
router.get('/daylogs', protect, async (req, res) => {
  try {
    const logs = await DayLog.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save day log (Protected)
router.post('/daylog', protect, async (req, res) => {
  try {
    const { date, ...data } = req.body;
    
    // Basic validation
    if (!date) return res.status(400).json({ message: 'Date is required' });

    // Normalize rounds payload to match schema
    const incomingRounds = data.rounds || {};
    const normalizedRounds = { ...incomingRounds };

    // Ensure each round object exists
    for (const r of ['round1', 'round2', 'round3', 'round4']) {
      normalizedRounds[r] = normalizedRounds[r] || { completed: false };
    }

    // Round4 expects 'activities' not 'topics'
    if (normalizedRounds.round4 && Array.isArray(normalizedRounds.round4.topics)) {
      const topics = normalizedRounds.round4.topics;
      normalizedRounds.round4.activities = topics.map(t => ({
        name: t.name || 'Activity',
        practiced: true,
        recorded: false
      }));
      delete normalizedRounds.round4.topics;
    }

    const payload = {
      ...data,
      rounds: normalizedRounds,
      date,
      userId: req.user._id
    };

    const log = await DayLog.findOneAndUpdate(
      { date, userId: req.user._id },
      { $set: payload },
      { new: true, upsert: true }
    );
    
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Random Motivation (Public)
const quotes = [
  "Consistency beats talent when talent stops practicing.",
  "One checkbox today is one step closer to your offer letter.",
  "You don’t need motivation. You need discipline.",
  "Placements are not luck. They are logged effort.",
  "Even 30 minutes daily beats zero hours perfectly.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Dream big. Start small. Act now."
];

router.get('/motivation', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote });
});

module.exports = router;
