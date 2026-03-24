const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  solutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  }
}, {
  timestamps: true
});

voteSchema.index({ userId: 1, solutionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
