const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['grain', 'vegetable', 'fruit', 'spice', 'herb', 'legume', 'dairy', 'nut', 'seed'],
    required: true
  },
  benefits: [{
    type: String
  }],
  diseases: [{
    type: String
  }],
  dosha: [{
    type: String,
    enum: ['vata', 'pitta', 'kapha']
  }],
  taste: {
    type: String,
    enum: ['sweet', 'sour', 'salty', 'bitter', 'pungent', 'astringent']
  },
  image: {
    type: String,
    default: '/images/food-default.jpg'
  },
  nutrients: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
