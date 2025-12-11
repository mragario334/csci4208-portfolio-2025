const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/auth'); 
const tutorRoutes = require('./routes/tutors');
const sessionRoutes = require('./routes/sessions');
const adminRoutes = require('./routes/admin');
const schoolsRoutes = require('./routes/schools');
const subjectsRouter = require("./routes/subjects");



const authenticateToken = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => res.send('Study Buddy API is running 🚀'));

// Test DB
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected ✅', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed ❌' });
  }
});

// Public routes
app.use('/auth', authRoutes);
app.use('/schools', schoolsRoutes);
app.use("/subjects", subjectsRouter);


// Auth-protected routes
app.use('/tutors', authenticateToken, tutorRoutes);
app.use('/sessions', authenticateToken, sessionRoutes);

// Admin-only routes
app.use('/admin', authenticateToken, isAdmin, adminRoutes);

const PORT = process.env.PORT || 2345;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
