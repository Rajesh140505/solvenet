const User = require('../models/User');
const Problem = require('../models/Problem');
const Solution = require('../models/Solution');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('solvedProblems', 'title difficulty category')
      .populate('createdProblems', 'title difficulty category createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const solutions = await Solution.find({ userId: req.userId })
      .populate('problemId', 'title')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        ...user,
        password: undefined,
        recentSolutions: solutions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;

    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated',
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('solvedProblems', 'title difficulty category createdAt')
      .populate('createdProblems', 'title difficulty category createdAt');

    const totalSolutions = await Solution.countDocuments({ userId: req.userId });
    const userSolutions = await Solution.find({ userId: req.userId })
      .populate('problemId', 'title difficulty');

    const solvedProblemsCount = user.solvedProblems.length;
    const createdProblemsCount = user.createdProblems.length;

    res.json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        reputation: user.reputation,
        badge: user.badge,
        totalSolved: solvedProblemsCount,
        totalCreated: createdProblemsCount,
        totalSubmissions: totalSolutions,
        totalUpvotes: user.totalUpvotes,
        solvedProblems: user.solvedProblems,
        createdProblems: user.createdProblems,
        recentActivity: userSolutions.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
