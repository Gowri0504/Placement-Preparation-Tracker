const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./models/Topic');

dotenv.config();

const topics = [
  // Round 1: Aptitude
  { name: 'Percentages', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Profit & Loss', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Ratio & Proportion', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Time & Work', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Time, Speed & Distance', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Simple & Compound Interest', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Averages', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Number System', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Pipes & Cisterns', round: 1, section: 'Quantitative Aptitude' },
  { name: 'Mixtures & Allegations', round: 1, section: 'Quantitative Aptitude' },
  
  { name: 'Number Series', round: 1, section: 'Logical Reasoning' },
  { name: 'Coding-Decoding', round: 1, section: 'Logical Reasoning' },
  { name: 'Blood Relations', round: 1, section: 'Logical Reasoning' },
  { name: 'Direction Sense', round: 1, section: 'Logical Reasoning' },
  { name: 'Seating Arrangement', round: 1, section: 'Logical Reasoning' },
  { name: 'Puzzles', round: 1, section: 'Logical Reasoning' },
  { name: 'Syllogisms', round: 1, section: 'Logical Reasoning' },
  { name: 'Venn Diagrams', round: 1, section: 'Logical Reasoning' },

  { name: 'Reading Comprehension', round: 1, section: 'Verbal Ability' },
  { name: 'Synonyms / Antonyms', round: 1, section: 'Verbal Ability' },
  { name: 'Sentence Correction', round: 1, section: 'Verbal Ability' },
  { name: 'Error Spotting', round: 1, section: 'Verbal Ability' },
  { name: 'Fill in the Blanks', round: 1, section: 'Verbal Ability' },
  { name: 'Para Jumbles', round: 1, section: 'Verbal Ability' },

  // Round 2: Coding
  { name: 'Variables & Data Types', round: 2, section: 'Basics' },
  { name: 'Loops & Conditions', round: 2, section: 'Basics' },
  { name: 'Functions', round: 2, section: 'Basics' },

  { name: 'Arrays', round: 2, section: 'Data Structures' },
  { name: 'Strings', round: 2, section: 'Data Structures' },
  { name: 'Linked List', round: 2, section: 'Data Structures' },
  { name: 'Stack', round: 2, section: 'Data Structures' },
  { name: 'Queue', round: 2, section: 'Data Structures' },
  { name: 'Hashing', round: 2, section: 'Data Structures' },
  { name: 'Trees', round: 2, section: 'Data Structures' },
  { name: 'Graphs', round: 2, section: 'Data Structures' },
  { name: 'Heap', round: 2, section: 'Data Structures' },

  { name: 'Searching', round: 2, section: 'Algorithms' },
  { name: 'Sorting', round: 2, section: 'Algorithms' },
  { name: 'Recursion', round: 2, section: 'Algorithms' },
  { name: 'Greedy', round: 2, section: 'Algorithms' },
  { name: 'Dynamic Programming', round: 2, section: 'Algorithms' },
  { name: 'Backtracking', round: 2, section: 'Algorithms' },

  // Round 3: Technical
  { name: 'DBMS', round: 3, section: 'Core Subjects' },
  { name: 'OS', round: 3, section: 'Core Subjects' },
  { name: 'CN', round: 3, section: 'Core Subjects' },
  { name: 'OOPS', round: 3, section: 'Core Subjects' },
  { name: 'System Design (basic)', round: 3, section: 'Core Subjects' },

  // Round 4: HR
  { name: 'Self Introduction', round: 4, section: 'Practice Areas' },
  { name: 'Strengths & Weaknesses', round: 4, section: 'Practice Areas' },
  { name: 'Projects explanation', round: 4, section: 'Practice Areas' },
  { name: 'Resume questions', round: 4, section: 'Practice Areas' },
  { name: 'Behavioral questions', round: 4, section: 'Practice Areas' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    try {
      await Topic.deleteMany({});
      console.log('Cleared existing topics');
      await Topic.insertMany(topics);
      console.log('Topics seeded successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding topics:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
