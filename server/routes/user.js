const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { height, weight, activityLevel, diseases } = req.body;

    const user = await User.findById(req.userId);

    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (activityLevel) user.activityLevel = activityLevel;
    if (diseases) user.diseases = diseases;

    // Calculate dosha based on profile
    user.dosha = calculateDosha(user);

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        activityLevel: user.activityLevel,
        diseases: user.diseases,
        healthScore: user.healthScore,
        dosha: user.dosha
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate dosha based on user characteristics
function calculateDosha(user) {
  const bmi = user.weight / ((user.height / 100) ** 2);

  if (bmi < 18.5) return 'vata';
  if (bmi >= 18.5 && bmi < 25) return 'pitta';
  if (bmi >= 25) return 'kapha';

  return 'vata';
}

module.exports = router;
