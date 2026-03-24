const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  submitSolution,
  getSolutionsByProblem,
  getUserSolutions,
  voteSolution,
  deleteSolution,
  markProblemSolved
} = require('../controllers/solutionController');

router.get('/problem/:problemId', getSolutionsByProblem);
router.get('/user/:userId', getUserSolutions);
router.post('/submit/:problemId', authMiddleware, submitSolution);
router.post('/vote/:solutionId', authMiddleware, voteSolution);
router.delete('/:solutionId', authMiddleware, deleteSolution);
router.post('/solve/:problemId', authMiddleware, markProblemSolved);

module.exports = router;
