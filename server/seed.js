const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Topic = require('./models/Topic');
const Resource = require('./models/Resource');

dotenv.config({ path: path.join(__dirname, '.env') });

const topics = [
  // --- DSA ---
  { name: 'Arrays', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Beginner' },
  { name: 'Strings', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Beginner' },
  { name: 'Linked List', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Intermediate' },
  { name: 'Stack, Queue, Deque', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Intermediate' },
  { name: 'Hashing', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Intermediate' },
  { name: 'Binary Tree', category: 'DSA', subCategory: 'Trees', difficulty: 'Intermediate' },
  { name: 'BST', category: 'DSA', subCategory: 'Trees', difficulty: 'Intermediate' },
  { name: 'AVL', category: 'DSA', subCategory: 'Trees', difficulty: 'Advanced' },
  { name: 'Heap', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Intermediate' },
  { name: 'Trie', category: 'DSA', subCategory: 'Data Structures', difficulty: 'Advanced' },
  { name: 'Graphs', category: 'DSA', subCategory: 'Graphs', difficulty: 'Advanced' },
  { name: 'BFS / DFS', category: 'DSA', subCategory: 'Graphs', difficulty: 'Intermediate' },
  { name: 'Topological Sort', category: 'DSA', subCategory: 'Graphs', difficulty: 'Advanced' },
  { name: 'Dijkstra / Bellman-Ford', category: 'DSA', subCategory: 'Graphs', difficulty: 'Advanced' },
  { name: 'MST (Kruskal / Prim)', category: 'DSA', subCategory: 'Graphs', difficulty: 'Advanced' },
  { name: 'Recursion & Backtracking', category: 'DSA', subCategory: 'Algorithms', difficulty: 'Intermediate' },
  { name: 'Dynamic Programming', category: 'DSA', subCategory: 'Algorithms', difficulty: 'Advanced' },
  { name: 'Greedy Algorithms', category: 'DSA', subCategory: 'Algorithms', difficulty: 'Intermediate' },
  { name: 'Bit Manipulation', category: 'DSA', subCategory: 'Algorithms', difficulty: 'Intermediate' },
  { name: 'Sliding Window / Two Pointers', category: 'DSA', subCategory: 'Algorithms', difficulty: 'Intermediate' },

  // --- OS ---
  { name: 'Process vs Thread', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Intermediate' },
  { name: 'CPU Scheduling', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Intermediate' },
  { name: 'Deadlock (Detection, Prevention)', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Intermediate' },
  { name: 'Memory Management', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Advanced' },
  { name: 'Paging & Segmentation', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Advanced' },
  { name: 'Virtual Memory', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Advanced' },
  { name: 'File Systems', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Intermediate' },
  { name: 'Synchronization (Semaphores, Mutex)', category: 'Core Subjects', subCategory: 'OS', difficulty: 'Advanced' },

  // --- DBMS ---
  { name: 'ER Modeling', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Beginner' },
  { name: 'Normalization (1NF -> BCNF)', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Intermediate' },
  { name: 'Indexing (B+ Trees)', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Advanced' },
  { name: 'Transactions & ACID', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Intermediate' },
  { name: 'Concurrency Control', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Advanced' },
  { name: 'SQL Optimization', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Advanced' },
  { name: 'Joins (Nested / Hash / Sort Merge)', category: 'Core Subjects', subCategory: 'DBMS', difficulty: 'Intermediate' },

  // --- CN ---
  { name: 'OSI vs TCP/IP', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Beginner' },
  { name: 'HTTP/HTTPS', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Beginner' },
  { name: 'DNS', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Intermediate' },
  { name: 'TCP vs UDP', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Intermediate' },
  { name: 'Routing Algorithms', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Advanced' },
  { name: 'Congestion Control', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Advanced' },
  { name: 'SSL/TLS', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Advanced' },
  { name: 'REST APIs', category: 'Core Subjects', subCategory: 'CN', difficulty: 'Intermediate' },

  // --- OOP ---
  { name: 'SOLID Principles', category: 'Core Subjects', subCategory: 'OOP', difficulty: 'Advanced' },
  { name: 'Design Patterns (Singleton, Factory, etc.)', category: 'Core Subjects', subCategory: 'OOP', difficulty: 'Advanced' },
  { name: 'UML Diagrams', category: 'Core Subjects', subCategory: 'OOP', difficulty: 'Intermediate' },
  { name: 'Object Relationships', category: 'Core Subjects', subCategory: 'OOP', difficulty: 'Intermediate' },

  // --- Programming Languages ---
  { name: 'C Programming', category: 'Languages', subCategory: 'C', difficulty: 'Beginner' },
  { name: 'C++ & STL', category: 'Languages', subCategory: 'C++', difficulty: 'Intermediate' },
  { name: 'Java & Spring', category: 'Languages', subCategory: 'Java', difficulty: 'Intermediate' },
  { name: 'Python for Data Science', category: 'Languages', subCategory: 'Python', difficulty: 'Intermediate' },
  { name: 'JavaScript / ES6+', category: 'Languages', subCategory: 'JavaScript', difficulty: 'Intermediate' },

  // --- Web Development ---
  { name: 'HTML5 & Semantics', category: 'Web Dev', subCategory: 'Frontend', difficulty: 'Beginner' },
  { name: 'CSS3 (Flexbox, Grid)', category: 'Web Dev', subCategory: 'Frontend', difficulty: 'Beginner' },
  { name: 'React (Hooks, Context, Performance)', category: 'Web Dev', subCategory: 'Frontend', difficulty: 'Intermediate' },
  { name: 'State Management (Redux/Zustand)', category: 'Web Dev', subCategory: 'Frontend', difficulty: 'Intermediate' },
  { name: 'REST API Design', category: 'Web Dev', subCategory: 'Backend', difficulty: 'Intermediate' },
  { name: 'Auth (JWT, OAuth2)', category: 'Web Dev', subCategory: 'Backend', difficulty: 'Advanced' },
  { name: 'Node.js & Express', category: 'Web Dev', subCategory: 'Backend', difficulty: 'Intermediate' },
  { name: 'Databases (SQL vs NoSQL)', category: 'Web Dev', subCategory: 'Backend', difficulty: 'Intermediate' },

  // --- System Design ---
  { name: 'Scalability & Load Balancing', category: 'System Design', subCategory: 'HLD', difficulty: 'Advanced' },
  { name: 'Caching (Redis/Memcached)', category: 'System Design', subCategory: 'HLD', difficulty: 'Advanced' },
  { name: 'Database Sharding', category: 'System Design', subCategory: 'HLD', difficulty: 'Advanced' },
  { name: 'CAP Theorem', category: 'System Design', subCategory: 'HLD', difficulty: 'Advanced' },
  { name: 'Case Study: URL Shortener', category: 'System Design', subCategory: 'HLD', difficulty: 'Advanced' },
  { name: 'Case Study: Chat System', category: 'System Design', subCategory: 'HLD', difficulty: 'Advanced' },
  { name: 'Low-Level Design (LLD)', category: 'System Design', subCategory: 'LLD', difficulty: 'Advanced' },

  // --- DevOps & Tools ---
  { name: 'Git & GitHub (Advanced)', category: 'DevOps', subCategory: 'Tools', difficulty: 'Intermediate' },
  { name: 'Docker & Containerization', category: 'DevOps', subCategory: 'Tools', difficulty: 'Intermediate' },
  { name: 'CI/CD Pipelines', category: 'DevOps', subCategory: 'Tools', difficulty: 'Advanced' },
  { name: 'Cloud Basics (AWS/Azure)', category: 'DevOps', subCategory: 'Tools', difficulty: 'Intermediate' },
  { name: 'Linux Commands & Shell Scripting', category: 'DevOps', subCategory: 'Tools', difficulty: 'Beginner' }
];

const resources = [
  {
    title: 'Striver SDE Sheet',
    description: 'The most popular SDE preparation sheet for top companies.',
    category: 'DSA',
    type: 'Link',
    url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
    tags: ['SDE Sheet', 'Placement', 'Striver']
  },
  {
    title: 'Operating Systems - Gate Smashers',
    description: 'Complete playlist for Operating Systems concepts.',
    category: 'Core Subjects',
    type: 'Video',
    url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donxtWsi5Kyfvn28Aty',
    tags: ['OS', 'University', 'Gate Smashers']
  },
  {
    title: 'System Design Primer',
    description: 'Learn how to design large-scale systems.',
    category: 'System Design',
    type: 'Link',
    url: 'https://github.com/donnemartin/system-design-primer',
    tags: ['System Design', 'Scalability', 'GitHub']
  },
  {
    title: 'IndiaBIX Placement Papers',
    description: 'Fully solved placement papers with interview patterns from various companies.',
    category: 'Company Specific',
    type: 'Link',
    url: 'https://www.indiabix.com/placement-papers/companies/',
    tags: ['Placement Papers', 'Interview Patterns', 'IndiaBIX']
  },
  {
    title: 'PrepInsta Top 50 Coding Questions',
    description: 'Most asked coding questions in technical interviews and online assessments.',
    category: 'DSA',
    type: 'Link',
    url: 'https://prepinsta.com/interview-preparation/technical-interview-questions/most-asked-coding-questions-in-placements/',
    tags: ['Coding Questions', 'Interview Prep', 'PrepInsta']
  },
  {
    title: 'Placement Preparation Platform',
    description: 'Complete placement ready resources including coding practice and aptitude.',
    category: 'Aptitude',
    type: 'Link',
    url: 'https://www.placementpreparation.io/',
    tags: ['Placement Ready', 'Aptitude', 'Coding']
  },
  {
    title: 'On-Campus Placement Guide',
    description: 'A complete preparation guide for cracking on-campus offers.',
    category: 'Core Subjects',
    type: 'Link',
    url: 'https://abhinavxj.medium.com/on-campus-placements-a-complete-preparation-guide-918a7f0b2eb8',
    tags: ['Placement Guide', 'Strategy', 'Medium']
  },
  {
    title: 'GeeksforGeeks Placement Guide',
    description: 'Step-by-step guide for placement preparation by GFG.',
    category: 'DSA',
    type: 'Link',
    url: 'https://www.geeksforgeeks.org/dsa/a-complete-step-by-step-guide-for-placement-preparation-by-geeksforgeeks/',
    tags: ['GFG', 'Placement Roadmap', 'DSA']
  }
];

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    try {
      // Seed Topics
      await Topic.deleteMany({});
      console.log('Cleared existing topics');
      await Topic.insertMany(topics);
      console.log(`Seeded ${topics.length} topics successfully`);

      // Seed Resources
      await Resource.deleteMany({});
      console.log('Cleared existing resources');
      await Resource.insertMany(resources);
      console.log(`Seeded ${resources.length} resources successfully`);

      process.exit(0);
    } catch (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
