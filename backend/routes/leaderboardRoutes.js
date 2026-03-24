const express = require('express');
const router = express.Router();
const { getLeaderboard, getStats } = require('../controllers/leaderboardController');

router.get('/', getLeaderboard);
router.get('/stats', getStats);

module.exports = router;
