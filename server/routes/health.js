const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const HealthLog = require('../models/HealthLog');
const User = require('../models/User');

// Get today's health stats
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await HealthLog.findOne({
      userId: req.userId,
      date: { $gte: today }
    });

    res.json(log || { message: 'No data for today' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add today's health stats
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { weight, calories, waterIntake, sleep, steps, mood } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if log exists for today
    let log = await HealthLog.findOne({
      userId: req.userId,
      date: { $gte: today }
    });

    if (log) {
      // Update existing log
      if (weight) log.weight = weight;
      if (calories) log.calories = calories;
      if (waterIntake) log.waterIntake = waterIntake;
      if (sleep) log.sleep = sleep;
      if (steps) log.steps = steps;
      if (mood) log.mood = mood;
      await log.save();
    } else {
      // Create new log
      log = new HealthLog({
        userId: req.userId,
        date: today,
        weight,
        calories,
        waterIntake,
        sleep,
        steps,
        mood
      });
      await log.save();
    }

    // Update user's health score
    await updateHealthScore(req.userId);

    res.json({
      message: 'Health stats logged successfully',
      log
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get health history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await HealthLog.find({
      userId: req.userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's log
    const todayLog = await HealthLog.findOne({
      userId: req.userId,
      date: { $gte: today }
    });

    // Last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekLogs = await HealthLog.find({
      userId: req.userId,
      date: { $gte: weekAgo }
    }).sort({ date: 1 });

    // Calculate averages
    const avgCalories = weekLogs.length > 0
      ? weekLogs.reduce((sum, log) => sum + log.calories, 0) / weekLogs.length
      : 0;

    const avgWater = weekLogs.length > 0
      ? weekLogs.reduce((sum, log) => sum + log.waterIntake, 0) / weekLogs.length
      : 0;

    const avgSleep = weekLogs.length > 0
      ? weekLogs.reduce((sum, log) => sum + log.sleep, 0) / weekLogs.length
      : 0;

    const user = await User.findById(req.userId);

    res.json({
      today: todayLog || {
        calories: 0,
        waterIntake: 0,
        sleep: 0,
        weight: user.weight || 0
      },
      weeklyAverage: {
        calories: Math.round(avgCalories),
        waterIntake: Math.round(avgWater),
        sleep: Math.round(avgSleep * 10) / 10
      },
      healthScore: user.healthScore || 75,
      weekData: weekLogs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update health score based on recent activity
async function updateHealthScore(userId) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const logs = await HealthLog.find({
    userId,
    date: { $gte: weekAgo }
  });

  if (logs.length === 0) return;

  let score = 50; // Base score

  // Add points for consistency
  score += logs.length * 5; // +5 per day logged

  // Add points for good habits
  logs.forEach(log => {
    if (log.waterIntake >= 8) score += 2;
    if (log.sleep >= 7 && log.sleep <= 9) score += 3;
    if (log.steps >= 8000) score += 2;
    if (log.calories >= 1500 && log.calories <= 2500) score += 2;
  });

  // Cap score at 100
  score = Math.min(100, score);

  await User.findByIdAndUpdate(userId, { healthScore: score });
}

module.exports = router;
