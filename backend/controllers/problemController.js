const Problem = require('../models/Problem');
const User = require('../models/User');
const Solution = require('../models/Solution');

exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      tags,
      inputFormat,
      outputFormat,
      constraints,
      examples
    } = req.body;

    if (!title || !description || !difficulty || !category || !inputFormat || !outputFormat || !constraints) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const existingProblem = await Problem.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') }
    });

    if (existingProblem) {
      return res.status(400).json({
        success: false,
        message: 'A problem with this title already exists'
      });
    }

    const problem = new Problem({
      title,
      description,
      difficulty,
      category,
      tags: tags || [],
      inputFormat,
      outputFormat,
      constraints,
      examples: examples || [],
      author: req.userId,
      visibility: 'public'
    });

    await problem.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { createdProblems: problem._id }
    });

    const populatedProblem = await Problem.findById(problem._id)
      .populate('author', 'username badge');

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: populatedProblem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      difficulty,
      category,
      sort = '-createdAt'
    } = req.query;

    const query = { visibility: 'public' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .populate('author', 'username badge')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Problem.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        problems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProblems: total,
          hasMore: skip + problems.length < total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id)
      .populate('author', 'username badge reputation');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    if (problem.visibility === 'private' && (!req.userId || !problem.author._id.equals(req.userId))) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const solutions = await Solution.find({ problemId: id })
      .populate('userId', 'username badge reputation')
      .sort('-voteCount');

    res.json({
      success: true,
      data: {
        problem,
        solutions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    if (!problem.author.equals(req.userId) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this problem'
      });
    }

    if (updates.title && updates.title !== problem.title) {
      const existingProblem = await Problem.findOne({
        title: { $regex: new RegExp(`^${updates.title}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingProblem) {
        return res.status(400).json({
          success: false,
          message: 'Title already exists'
        });
      }
    }

    Object.assign(problem, updates);
    await problem.save();

    const updatedProblem = await Problem.findById(id)
      .populate('author', 'username badge');

    res.json({
      success: true,
      message: 'Problem updated',
      data: updatedProblem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    if (!problem.author.equals(req.userId) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this problem'
      });
    }

    await Solution.deleteMany({ problemId: id });
    await Problem.findByIdAndDelete(id);

    await User.findByIdAndUpdate(problem.author, {
      $pull: { createdProblems: id }
    });

    res.json({
      success: true,
      message: 'Problem deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getArchive = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, difficulty, category } = req.query;

    const query = { visibility: 'public', isSolved: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .populate('author', 'username badge')
        .sort('-totalVotes -createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Problem.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        problems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProblems: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
