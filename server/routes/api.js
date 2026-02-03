const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const DayLog = require('../models/DayLog');

// Get all topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ round: 1, section: 1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get day log by date
router.get('/daylog/:date', async (req, res) => {
  try {
    const log = await DayLog.findOne({ date: req.params.date });
    if (!log) {
      // Return empty structure if not found, but client should handle initialization
      return res.json({ date: req.params.date, rounds: {}, isNew: true });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save day log
router.post('/daylog', async (req, res) => {
  try {
    const { date, ...data } = req.body;
    
    // Basic validation
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const log = await DayLog.findOneAndUpdate(
      { date },
      { $set: { ...data, date } }, // Ensure date is set
      { new: true, upsert: true }
    );
    
    // Logic to update "Topic" mastery could go here if we tracked it separately
    
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Random Motivation
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
