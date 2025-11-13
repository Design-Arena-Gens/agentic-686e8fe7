const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number,
    default: 0
  },
  calories: {
    type: Number,
    default: 0
  },
  waterIntake: {
    type: Number,
    default: 0
  },
  sleep: {
    type: Number,
    default: 0
  },
  steps: {
    type: Number,
    default: 0
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  }
}, { timestamps: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
