const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust', 'TypeScript', 'Ruby', 'PHP']
  },
  explanation: {
    type: String,
    default: ''
  },
  voteCount: {
    type: Number,
    default: 0
  },
  isTopSolution: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

solutionSchema.index({ problemId: 1, voteCount: -1 });
solutionSchema.index({ userId: 1 });

module.exports = mongoose.model('Solution', solutionSchema);
