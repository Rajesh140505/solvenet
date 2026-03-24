const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getArchive
} = require('../controllers/problemController');

router.get('/archive', getArchive);
router.get('/', optionalAuth, getAllProblems);
router.get('/:id', optionalAuth, getProblemById);
router.post('/create', authMiddleware, createProblem);
router.put('/:id', authMiddleware, updateProblem);
router.delete('/:id', authMiddleware, deleteProblem);

module.exports = router;
