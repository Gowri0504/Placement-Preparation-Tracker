const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Log JWT_SECRET (masked for security)
const jwtSecret = process.env.JWT_SECRET;
const maskedSecret = jwtSecret ? `${jwtSecret.slice(0, 4)}...${jwtSecret.slice(-4)}` : 'NOT DEFINED';
console.log('Loaded JWT_SECRET (masked):', maskedSecret);

const app = express();
app.use(cors({
  origin: [
     'http://localhost:5173',
     'http://localhost:5174',
     'http://localhost:5175',
     'https://placement-preparation-tracker-bay.vercel.app',
     process.env.FRONTEND_URL
   ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

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
