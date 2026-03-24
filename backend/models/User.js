const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  createdProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  reputation: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    enum: ['Beginner', 'Contributor', 'Expert'],
    default: 'Beginner'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  totalUpvotes: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function() {
  return JWT.sign(
    { id: this._id, username: this.username, role: this.role },
    process.env.JWT_SECRET || 'solver_secret_key_2024',
    { expiresIn: '7d' }
  );
};

userSchema.methods.updateBadge = function() {
  if (this.reputation >= 200) {
    this.badge = 'Expert';
  } else if (this.reputation >= 50) {
    this.badge = 'Contributor';
  } else {
    this.badge = 'Beginner';
  }
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
