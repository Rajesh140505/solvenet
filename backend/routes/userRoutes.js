const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getDashboard
} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/dashboard', authMiddleware, getDashboard);

module.exports = router;
