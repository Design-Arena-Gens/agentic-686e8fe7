const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  height: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
    default: 'moderate'
  },
  diseases: [{
    type: String
  }],
  healthScore: {
    type: Number,
    default: 75
  },
  dosha: {
    type: String,
    enum: ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha'],
    default: 'vata'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
