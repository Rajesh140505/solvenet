const User = require('../models/User');
const Solution = require('../models/Solution');
const Problem = require('../models/Problem');

exports.getLeaderboard = async (req, res) => {
  try {
    const { type = 'reputation', page = 1, limit = 20 } = req.query;

    let sortField;
    switch (type) {
      case 'solved':
        sortField = { solvedProblemsCount: -1 };
        break;
      case 'submissions':
        sortField = { totalSubmissions: -1 };
        break;
      case 'upvotes':
        sortField = { totalUpvotes: -1 };
        break;
      default:
        sortField = { reputation: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find()
      .select('username badge reputation totalUpvotes totalSubmissions solvedProblems createdProblems')
      .sort(sortField)
      .skip(skip)
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      username: user.username,
      badge: user.badge,
      reputation: user.reputation,
      totalUpvotes: user.totalUpvotes,
      totalSubmissions: user.totalSubmissions,
      problemsSolved: user.solvedProblems.length,
      problemsCreated: user.createdProblems.length
    }));

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total
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

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalProblems, totalSolutions] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments({ visibility: 'public' }),
      Solution.countDocuments()
    ]);

    const topContributors = await User.find()
      .select('username badge reputation totalUpvotes')
      .sort('-reputation')
      .limit(5);

    const recentProblems = await Problem.find({ visibility: 'public' })
      .populate('author', 'username')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProblems,
        totalSolutions,
        topContributors,
        recentProblems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
