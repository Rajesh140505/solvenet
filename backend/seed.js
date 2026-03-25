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
        username: 'admin_user',
        email: 'admin@solvenet.com',
        password: hashedPassword,
        reputation: 500,
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
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'greedy'],
        inputFormat: 'prices = [7,1,5,3,6,4]',
        outputFormat: '5',
        constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
        examples: [
          { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.' },
          { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' }
        ],
        author: users[1]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 18
      },
      {
        title: 'Contains Duplicate',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'hash-set'],
        inputFormat: 'nums = [1,2,3,1]',
        outputFormat: 'true',
        constraints: '1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9',
        examples: [
          { input: 'nums = [1,2,3,1]', output: 'true' },
          { input: 'nums = [1,2,3,4]', output: 'false' },
          { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 3,
        totalVotes: 12
      },
      {
        title: 'Move Zeroes',
        description: 'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'two-pointers'],
        inputFormat: 'nums = [0,1,0,3,12]',
        outputFormat: '[1,3,12,0,0]',
        constraints: '1 <= nums.length <= 10^4\n-2^31 <= nums[i] <= 2^31 - 1',
        examples: [
          { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
          { input: 'nums = [0]', output: '[0]' }
        ],
        author: users[2]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 8
      },
      {
        title: 'Reverse String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['two-pointers', 'string'],
        inputFormat: 's = ["h","e","l","l","o"]',
        outputFormat: '["o","l","l","e","h"]',
        constraints: '1 <= s.length <= 10^5\ns[i] is a printable ascii character.',
        examples: [
          { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
          { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        author: users[1]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 9
      },
      {
        title: 'Palindrome Number',
        description: 'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.',
        difficulty: 'Easy',
        category: 'Mathematics',
        tags: ['math'],
        inputFormat: 'x = 121',
        outputFormat: 'true',
        constraints: '-2^31 <= x <= 2^31 - 1',
        examples: [
          { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
          { input: 'x = -121', output: 'false', explanation: 'From left to right it reads -121. From right to left it becomes 121-.' },
          { input: 'x = 10', output: 'false', explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.' }
        ],
        author: users[3]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 14
      },
      {
        title: 'Plus One',
        description: 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0s. Increment the large integer by one and return the resulting array of digits.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'math'],
        inputFormat: 'digits = [1,2,3]',
        outputFormat: '[1,4,2]',
        constraints: '1 <= digits.length <= 100\n0 <= digits[i] <= 9\ndigits does not contain any leading zeros.',
        examples: [
          { input: 'digits = [1,2,3]', output: '[1,4,2]' },
          { input: 'digits = [4,3,2,1]', output: '[4,3,2,2]' },
          { input: 'digits = [9]', output: '[1,0]' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 6
      },
      {
        title: 'Single Number',
        description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'bit-manipulation'],
        inputFormat: 'nums = [2,2,1]',
        outputFormat: '1',
        constraints: '1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element in the array appears twice except for one element which appears only once.',
        examples: [
          { input: 'nums = [2,2,1]', output: '1' },
          { input: 'nums = [4,1,2,1,2]', output: '4' },
          { input: 'nums = [1]', output: '1' }
        ],
        author: users[1]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 3
      },
      {
        title: 'Majority Element',
        description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'divide-and-conquer'],
        inputFormat: 'nums = [3,2,3]',
        outputFormat: '3',
        constraints: 'n == nums.length\n1 <= n <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9',
        examples: [
          { input: 'nums = [3,2,3]', output: '3' },
          { input: 'nums = [2,2,1,1,1,2,2]', output: '2' }
        ],
        author: users[2]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 4
      },
      {
        title: 'Length of Last Word',
        description: 'Given a string s consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.',
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['string'],
        inputFormat: 's = "Hello World"',
        outputFormat: '5',
        constraints: '1 <= s.length <= 10^5\ns consists of only letters and spaces.\nThere will be at least one word in s.',
        examples: [
          { input: 's = "Hello World"', output: '5', explanation: 'The last word is "World" with length 5.' },
          { input: 's = "   fly me   to   the moon  "', output: '4', explanation: 'The last word is "moon" with length 4.' }
        ],
        author: users[3]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 1,
        totalVotes: 7
      },
      {
        title: 'Power of Two',
        description: 'Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two, if there exists an integer x such that n == 2^x.',
        difficulty: 'Easy',
        category: 'Mathematics',
        tags: ['math', 'bit-manipulation'],
        inputFormat: 'n = 16',
        outputFormat: 'true',
        constraints: '-2^31 <= n <= 2^31 - 1',
        examples: [
          { input: 'n = 16', output: 'true', explanation: '2^4 = 16' },
          { input: 'n = 3', output: 'false' },
          { input: 'n = 1', output: 'true', explanation: '2^0 = 1' }
        ],
        author: users[0]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 2
      },
      {
        title: 'Intersection of Two Arrays',
        description: 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'hash-set'],
        inputFormat: 'nums1 = [1,2,2,1], nums2 = [2,2]',
        outputFormat: '[2]',
        constraints: '1 <= nums1.length <= 1000\n2 <= nums2.length <= 1000\n1 <= nums1[i], nums2[i] <= 1000\nAll the values of nums1 and nums2 are unique.',
        examples: [
          { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]' },
          { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[9,4]', explanation: '[4,9] is also acceptable.' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 0
      },
      {
        title: 'Fizz Buzz',
        description: 'Given an integer n, return a string array answer where: "FizzBuzz" if n is divisible by 3 and 5, "Fizz" if n is divisible by 3, "Buzz" if n is divisible by 5, n as a string if none of the above conditions are true.',
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['math', 'string'],
        inputFormat: 'n = 3',
        outputFormat: '["1","2","Fizz"]',
        constraints: '1 <= n <= 10^4',
        examples: [
          { input: 'n = 3', output: '["1","2","Fizz"]' },
          { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
          { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 5
      },
      {
        title: 'Find Pivot Index',
        description: 'Given an array of integers nums, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the right of the index.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'prefix-sum'],
        inputFormat: 'nums = [1,7,3,6,5,6]',
        outputFormat: '3',
        constraints: '1 <= nums.length <= 10^4\n-1000 <= nums[i] <= 1000',
        examples: [
          { input: 'nums = [1,7,3,6,5,6]', output: '3', explanation: 'Left sum is nums[0] + nums[1] + nums[2] = 11, right sum is nums[4] + nums[5] = 11.' },
          { input: 'nums = [1,2,3]', output: '-1', explanation: 'No pivot index exists.' },
          { input: 'nums = [2,1,-1]', output: '0', explanation: 'Left sum is 0, right sum is 1 + -1 = 0.' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 3
      },
      {
        title: 'Merge Sorted Array',
        description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array. The final sorted array should be stored inside the array nums1.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'two-pointers'],
        inputFormat: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
        outputFormat: '[1,2,2,3,5,6]',
        constraints: 'nums1.length == m + n\nnums2.length == n\n0 <= m, n <= 200\n-10^9 <= nums1[i], nums2[i] <= 10^9',
        examples: [
          { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 2
      },
      {
        title: 'Remove Duplicates from Sorted Array',
        description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements in nums.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'two-pointers'],
        inputFormat: 'nums = [1,1,2]',
        outputFormat: '2',
        constraints: '1 <= nums.length <= 3 * 10^4\n-100 <= nums[i] <= 100\nnums is sorted in non-decreasing order.',
        examples: [
          { input: 'nums = [1,1,2]', output: '2', explanation: 'Your function should return 2, with the first two elements of nums being 1 and 2 respectively.' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 8
      },
      {
        title: 'Squares of a Sorted Array',
        description: 'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
        difficulty: 'Easy',
        category: 'Arrays',
        tags: ['array', 'two-pointers'],
        inputFormat: 'nums = [-4,-1,0,3,10]',
        outputFormat: '[0,1,9,16,100]',
        constraints: '1 <= nums.length <= 10^4\n-10^4 <= nums[i] <= 10^4\nnums is sorted in non-decreasing order.',
        examples: [
          { input: 'nums = [-4,-1,0,3,10]', output: '[0,1,9,16,100]' },
          { input: 'nums = [-7,-3,2,3,11]', output: '[4,9,9,49,121]' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 1,
        totalVotes: 4
      },
      {
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word formed by rearranging the letters of a different word.',
        difficulty: 'Easy',
        category: 'Strings',
        tags: ['hash-table', 'string', 'sorting'],
        inputFormat: 's = "anagram", t = "nagaram"',
        outputFormat: 'true',
        constraints: '1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.',
        examples: [
          { input: 's = "anagram", t = "nagaram"', output: 'true' },
          { input: 's = "rat", t = "car"', output: 'false' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 3,
        totalVotes: 11
      },
      {
        title: 'Maximum Depth of Binary Tree',
        description: 'Given the root of a binary tree, return its maximum depth. A binary trees maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
        difficulty: 'Easy',
        category: 'Trees',
        tags: ['tree', 'dfs', 'bfs'],
        inputFormat: 'root = [3,9,20,null,null,15,7]',
        outputFormat: '3',
        constraints: 'The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
          { input: 'root = [1,null,2]', output: '2' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: true,
        solutionCount: 2,
        totalVotes: 9
      },
      {
        title: 'Symmetric Tree',
        description: 'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
        difficulty: 'Easy',
        category: 'Trees',
        tags: ['tree', 'dfs', 'bfs'],
        inputFormat: 'root = [1,2,2,3,4,4,3]',
        outputFormat: 'true',
        constraints: 'The number of nodes in the tree is in the range [1, 1000].\n-100 <= Node.val <= 100',
        examples: [
          { input: 'root = [1,2,2,3,4,4,3]', output: 'true' },
          { input: 'root = [1,2,2,null,3,null,3]', output: 'false' }
        ],
        author: users[4]._id,
        visibility: 'public',
        isSolved: false,
        solutionCount: 0,
        totalVotes: 1
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
