const Solution = require('../models/Solution');
const Problem = require('../models/Problem');
const Vote = require('../models/Vote');
const User = require('../models/User');

exports.submitSolution = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language, explanation } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const solution = new Solution({
      problemId,
      userId: req.userId,
      code,
      language,
      explanation: explanation || ''
    });

    await solution.save();

    await Problem.findByIdAndUpdate(problemId, {
      $inc: { solutionCount: 1 }
    });

    await User.findByIdAndUpdate(req.userId, {
      $inc: { totalSubmissions: 1 }
    });

    const populatedSolution = await Solution.findById(solution._id)
      .populate('userId', 'username badge reputation');

    res.status(201).json({
      success: true,
      message: 'Solution submitted successfully',
      data: populatedSolution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSolutionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { sort = '-voteCount' } = req.query;

    const solutions = await Solution.find({ problemId })
      .populate('userId', 'username badge reputation')
      .sort(sort);

    res.json({
      success: true,
      data: solutions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserSolutions = async (req, res) => {
  try {
    const { userId } = req.params;

    const solutions = await Solution.find({ userId })
      .populate('problemId', 'title difficulty category')
      .sort('-createdAt');

    res.json({
      success: true,
      data: solutions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.voteSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;

    const solution = await Solution.findById(solutionId);

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found'
      });
    }

    if (solution.userId.equals(req.userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own solution'
      });
    }

    const existingVote = await Vote.findOne({
      userId: req.userId,
      solutionId
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this solution'
      });
    }

    const vote = new Vote({
      userId: req.userId,
      solutionId,
      problemId: solution.problemId
    });

    await vote.save();

    solution.voteCount += 1;
    await solution.save();

    await Solution.findByIdAndUpdate(solutionId, {
      isTopSolution: solution.voteCount > 0
    });

    await User.findByIdAndUpdate(solution.userId, {
      $inc: { 
        reputation: 10,
        totalUpvotes: 1
      }
    });

    const updatedSolution = await Solution.findById(solutionId)
      .populate('userId', 'username badge reputation');

    await User.findByIdAndUpdate(solution.userId).then(async (user) => {
      if (user.reputation >= 200) {
        user.badge = 'Expert';
      } else if (user.reputation >= 50) {
        user.badge = 'Contributor';
      }
      await user.save();
    });

    res.json({
      success: true,
      message: 'Vote recorded',
      data: updatedSolution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;

    const solution = await Solution.findById(solutionId);

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found'
      });
    }

    if (!solution.userId.equals(req.userId) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this solution'
      });
    }

    await Vote.deleteMany({ solutionId });
    await Solution.findByIdAndDelete(solutionId);

    await Problem.findByIdAndUpdate(solution.problemId, {
      $inc: { solutionCount: -1 }
    });

    res.json({
      success: true,
      message: 'Solution deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.markProblemSolved = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const hasSolution = await Solution.findOne({
      problemId,
      userId: req.userId
    });

    if (!hasSolution) {
      return res.status(400).json({
        success: false,
        message: 'You must submit a solution first'
      });
    }

    await Problem.findByIdAndUpdate(problemId, { isSolved: true });

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { solvedProblems: problemId }
    });

    res.json({
      success: true,
      message: 'Problem marked as solved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
