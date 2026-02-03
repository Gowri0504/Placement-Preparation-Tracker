const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
const envAllowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL,
  ...envAllowed,
].filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const apiRoutes = require('./routes/api');
const DayLog = require('./models/DayLog');

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Placement Tracker API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ensure correct indexes for DayLog (fix legacy unique index on date)
mongoose.connection.once('open', async () => {
  try {
    const indexes = await DayLog.collection.indexes();
    const hasBadDateIndex = indexes.some((i) => i.name === 'date_1');
    if (hasBadDateIndex) {
      await DayLog.collection.dropIndex('date_1');
      console.log('Dropped invalid unique index on date');
    }
    await DayLog.collection.createIndex({ userId: 1, date: 1 }, { unique: true });
    console.log('Ensured compound unique index on {userId, date}');
  } catch (e) {
    console.error('Index ensure error:', e.message);
  }
});
