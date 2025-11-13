const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Food = require('../models/Food');

// Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured foods
router.get('/featured', async (req, res) => {
  try {
    const foods = await Food.find({ isFeatured: true }).limit(6);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get remedy of the day
router.get('/remedy-of-day', async (req, res) => {
  try {
    const count = await Food.countDocuments();
    const random = Math.floor(Math.random() * count);
    const remedy = await Food.findOne().skip(random);
    res.json(remedy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get food recommendations by disease
router.get('/recommend/:disease', authMiddleware, async (req, res) => {
  try {
    const disease = req.params.disease.toLowerCase();
    const foods = await Food.find({
      diseases: { $regex: disease, $options: 'i' }
    }).limit(10);

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personalized recommendations
router.get('/personalized', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Find foods matching user's dosha and diseases
    let query = {};

    if (user.diseases && user.diseases.length > 0) {
      query.diseases = { $in: user.diseases };
    }

    if (user.dosha) {
      query.dosha = { $in: [user.dosha] };
    }

    const foods = await Food.find(query).limit(12);

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed initial foods
router.post('/seed', async (req, res) => {
  try {
    const seedFoods = [
      {
        name: 'Turmeric',
        description: 'Golden spice with powerful anti-inflammatory properties',
        category: 'spice',
        benefits: ['Anti-inflammatory', 'Boosts immunity', 'Improves digestion'],
        diseases: ['arthritis', 'diabetes', 'inflammation'],
        dosha: ['kapha', 'vata'],
        taste: 'bitter',
        image: '/images/turmeric.jpg',
        nutrients: { calories: 29, protein: 0.9, carbs: 6.3, fat: 0.3, fiber: 2.1 },
        isFeatured: true
      },
      {
        name: 'Ginger',
        description: 'Warming root that aids digestion and reduces nausea',
        category: 'spice',
        benefits: ['Aids digestion', 'Reduces nausea', 'Anti-inflammatory'],
        diseases: ['cold', 'nausea', 'inflammation'],
        dosha: ['kapha', 'vata'],
        taste: 'pungent',
        image: '/images/ginger.jpg',
        nutrients: { calories: 80, protein: 1.8, carbs: 17.8, fat: 0.8, fiber: 2 },
        isFeatured: true
      },
      {
        name: 'Ashwagandha',
        description: 'Ancient adaptogenic herb for stress and vitality',
        category: 'herb',
        benefits: ['Reduces stress', 'Improves energy', 'Enhances immunity'],
        diseases: ['stress', 'anxiety', 'fatigue'],
        dosha: ['vata', 'kapha'],
        taste: 'bitter',
        image: '/images/ashwagandha.jpg',
        nutrients: { calories: 245, protein: 3.3, carbs: 49.9, fat: 0.3, fiber: 32.3 },
        isFeatured: true
      },
      {
        name: 'Tulsi (Holy Basil)',
        description: 'Sacred herb that purifies mind and body',
        category: 'herb',
        benefits: ['Reduces stress', 'Boosts immunity', 'Purifies blood'],
        diseases: ['cold', 'fever', 'stress'],
        dosha: ['kapha', 'vata'],
        taste: 'pungent',
        image: '/images/tulsi.jpg',
        nutrients: { calories: 23, protein: 3.2, carbs: 2.7, fat: 0.6, fiber: 1.6 },
        isFeatured: true
      },
      {
        name: 'Amla',
        description: 'Indian gooseberry rich in Vitamin C',
        category: 'fruit',
        benefits: ['Rich in Vitamin C', 'Improves hair health', 'Boosts immunity'],
        diseases: ['cold', 'diabetes', 'hair loss'],
        dosha: ['pitta', 'kapha'],
        taste: 'sour',
        image: '/images/amla.jpg',
        nutrients: { calories: 44, protein: 0.9, carbs: 10.2, fat: 0.6, fiber: 4.3 },
        isFeatured: true
      },
      {
        name: 'Ghee',
        description: 'Clarified butter that nourishes body tissues',
        category: 'dairy',
        benefits: ['Nourishes tissues', 'Improves digestion', 'Enhances memory'],
        diseases: ['weak digestion', 'dry skin', 'constipation'],
        dosha: ['vata', 'pitta'],
        taste: 'sweet',
        image: '/images/ghee.jpg',
        nutrients: { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
        isFeatured: true
      },
      {
        name: 'Cumin',
        description: 'Digestive spice that balances all doshas',
        category: 'spice',
        benefits: ['Aids digestion', 'Reduces bloating', 'Improves iron absorption'],
        diseases: ['indigestion', 'bloating', 'anemia'],
        dosha: ['vata', 'pitta', 'kapha'],
        taste: 'pungent',
        image: '/images/cumin.jpg',
        nutrients: { calories: 375, protein: 17.8, carbs: 44.2, fat: 22.3, fiber: 10.5 },
        isFeatured: false
      },
      {
        name: 'Triphala',
        description: 'Three-fruit blend for digestive wellness',
        category: 'herb',
        benefits: ['Detoxifies body', 'Improves digestion', 'Supports weight loss'],
        diseases: ['constipation', 'obesity', 'digestive issues'],
        dosha: ['vata', 'pitta', 'kapha'],
        taste: 'astringent',
        image: '/images/triphala.jpg',
        nutrients: { calories: 30, protein: 0.5, carbs: 7, fat: 0.1, fiber: 3 },
        isFeatured: false
      }
    ];

    await Food.deleteMany({});
    await Food.insertMany(seedFoods);

    res.json({ message: 'Foods seeded successfully', count: seedFoods.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
