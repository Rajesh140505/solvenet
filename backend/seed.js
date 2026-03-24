const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Problem = require('./models/Problem');
const Solution = require('./models/Solution');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solvenet';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Problem.deleteMany({});
    await Solution.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await User.create([
      {
        username: 'algo_master',
        email: 'algo@example.com',
        password: hashedPassword,
        reputation: 250,
        badge: 'Expert',
        role: 'admin'
      },
      {
        username: 'code_ninja',
        email: 'ninja@example.com',
        password: hashedPassword,
        reputation: 120,
        badge: 'Contributor'
      },
      {
        username: 'newbie_dev',
        email: 'newbie@example.com',
        password: hashedPassword,
        reputation: 25,
        badge: 'Beginner'
      },
      {
        username: 'problem_solver',
        email: 'solver@example.com',
        password: hashedPassword,
        reputation: 75,
        badge: 'Contributor'
      }
    ]);

    console.log('Created users');

    const problems = await Problem.create([
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'hash-table'],
        inputFormat: 'nums = [2,7,11,15], target = 9',
        outputFormat: '[0,1]',
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
          { input: 'nums = [3,3], target = 6', output: '[0,1]' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 3,
        totalVotes: 15
      },
      {
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['string', 'stack'],
        inputFormat: 's = "()"',
        outputFormat: 'true',
        constraints: '1 <= s.length <= 10^4\ns consists of parentheses only \'()[]{}\'',
        examples: [
          { input: 's = "()"', output: 'true' },
          { input: 's = "()[]{}"', output: 'true' },
          { input: 's = "(]"', output: 'false' }
        ],
        author: users[1]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 8
      },
      {
        title: 'Merge Two Sorted Lists',
        description: 'Merge two sorted linked lists and return it as a sorted list.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['linked-list', 'recursion'],
        inputFormat: 'l1 = [1,2,4], l2 = [1,3,4]',
        outputFormat: '[1,1,2,3,4,4]',
        constraints: 'The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100',
        examples: [
          { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 12
      },
      {
        title: 'Maximum Subarray',
        description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        tags: ['array', 'divide-and-conquer'],
        inputFormat: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        outputFormat: '6',
        constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
        examples: [
          { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }
        ],
        author: users[1]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 5
      },
      {
        title: 'Binary Tree Level Order Traversal',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
        difficulty: 'Medium',
        category: 'Trees',
        tags: ['tree', 'bfs'],
        inputFormat: 'root = [3,9,20,null,null,15,7]',
        outputFormat: '[[3],[9,20],[15,7]]',
        constraints: 'The number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 3
      },
      {
        title: 'Number of Islands',
        description: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
        difficulty: 'Medium',
        category: 'Graphs',
        tags: ['dfs', 'bfs', 'matrix'],
        inputFormat: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        outputFormat: '1',
        constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is \'0\' or \'1\'',
        examples: [
          { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
        ],
        author: users[2]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 0
      },
      {
        title: 'Regular Expression Matching',
        description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\'.',
        difficulty: 'Hard',
        category: 'Strings',
        tags: ['dynamic-programming', 'recursion', 'string'],
        inputFormat: 's = "aa", p = "a"',
        outputFormat: 'false',
        constraints: '1 <= s.length <= 20\n1 <= p.length <= 20\ns contains only lowercase letters.\np contains only lowercase letters, \'.\', and \'*\'.',
        examples: [
          { input: 's = "aa", p = "a"', output: 'false', explanation: '"a" does not match the entire string "aa".' },
          { input: 's = "aa", p = "a*"', output: 'true', explanation: '"*" means zero or more of the preceding element.' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 10
      },
      {
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        tags: ['math', 'memoization'],
        inputFormat: 'n = 3',
        outputFormat: '3',
        constraints: '1 <= n <= 45',
        examples: [
          { input: 'n = 2', output: '2', explanation: 'There are two ways: 1+1 and 2.' },
          { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, and 2+1.' }
        ],
        author: users[3]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 4,
        totalVotes: 20
      },
      {
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['linked-list'],
        inputFormat: 'head = [1,2,3,4,5]',
        outputFormat: '[5,4,3,2,1]',
        constraints: 'The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', output: '[2,1]' }
        ],
        author: users[1]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 7
      },
      {
        title: 'Longest Palindromic Substring',
        description: 'Given a string s, return the longest palindromic substring in s.',
        difficulty: 'Medium',
        category: 'Strings',
        tags: ['string', 'dynamic-programming'],
        inputFormat: 's = "babad"',
        outputFormat: '"bab"',
        constraints: '1 <= s.length <= 1000\ns consist of only digits and English letters.',
        examples: [
          { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
          { input: 's = "cbbd"', output: '"bb"' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 4
      },
      {
        title: 'Coin Change',
        description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        tags: ['bfs', 'dynamic-programming'],
        inputFormat: 'coins = [1,2,5], amount = 11',
        outputFormat: '3',
        constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
        examples: [
          { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' }
        ],
        author: users[2]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 0
      },
      {
        title: 'Word Break',
        description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        tags: ['trie', 'memoization'],
        inputFormat: 's = "leetcode", wordDict = ["leet","code"]',
        outputFormat: 'true',
        constraints: '1 <= s.length <= 300\n1 <= wordDict.length <= 1000\n1 <= wordDict[i].length <= 20',
        examples: [
          { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 6
      }
    ]);

    console.log('Created problems');

    const solutions = await Solution.create([
      {
        problemId: problems[0]._id,
        userId: users[1]._id,
        code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        language: 'JavaScript',
        explanation: 'Use a hash map to store the complement of each number. If the complement exists in the map, return both indices.',
        voteCount: 10,
        isTopSolution: true
      },
      {
        problemId: problems[0]._id,
        userId: users[2]._id,
        code: `def twoSum(nums, target):
    prevMap = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prevMap:
            return [prevMap[diff], i]
        prevMap[n] = i
    return []`,
        language: 'Python',
        explanation: 'Python solution using dictionary for O(n) time complexity.',
        voteCount: 5,
        isTopSolution: false
      },
      {
        problemId: problems[1]._id,
        userId: users[0]._id,
        code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
        language: 'JavaScript',
        explanation: 'Use a stack to track opening brackets. When closing bracket is encountered, check if it matches the top of stack.',
        voteCount: 6,
        isTopSolution: true
      },
      {
        problemId: problems[7]._id,
        userId: users[1]._id,
        code: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev1 = 1, prev2 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}`,
        language: 'JavaScript',
        explanation: 'This is essentially a Fibonacci sequence. Use dynamic programming with O(n) time and O(1) space.',
        voteCount: 15,
        isTopSolution: true
      },
      {
        problemId: problems[7]._id,
        userId: users[3]._id,
        code: `def climbStairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
        language: 'Python',
        explanation: 'DP approach with tabulation. Each step can be reached from step (n-1) or step (n-2).',
        voteCount: 5,
        isTopSolution: false
      }
    ]);

    console.log('Created solutions');

    await User.findByIdAndUpdate(users[1]._id, {
      $push: { solvedProblems: problems[0]._id },
      totalUpvotes: 15
    });
    await User.findByIdAndUpdate(users[2]._id, {
      $push: { solvedProblems: { $each: [problems[0]._id, problems[7]._id] } },
      totalUpvotes: 5
    });
    await User.findByIdAndUpdate(users[3]._id, {
      $push: { solvedProblems: problems[7]._id },
      totalUpvotes: 5
    });

    console.log('Updated user stats');
    console.log('Seed data created successfully!');
    console.log('\nTest credentials:');
    console.log('Email: algo@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
