const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Mathematics'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  inputFormat: {
    type: String,
    required: true
  },
  outputFormat: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  examples: [exampleSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  solutionCount: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

problemSchema.index({ title: 'text', tags: 'text' });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ category: 1 });

module.exports = mongoose.model('Problem', problemSchema);
