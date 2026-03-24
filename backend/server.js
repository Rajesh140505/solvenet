require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SolveNet API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`SolveNet server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
