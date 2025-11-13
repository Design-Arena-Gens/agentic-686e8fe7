const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Food = require('../models/Food');

// Chatbot endpoint
router.post('/ask', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;

    const lowerMessage = message.toLowerCase();

    // Simple rule-based chatbot responses
    let response = '';

    if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
      const foods = await Food.find({ diseases: /diabetes/i }).limit(3);
      response = `For diabetes management, I recommend these Ayurvedic foods:\n\n${foods.map(f => `• ${f.name}: ${f.description}`).join('\n')}\n\nThese foods help regulate blood sugar naturally.`;
    } else if (lowerMessage.includes('digestion') || lowerMessage.includes('stomach')) {
      const foods = await Food.find({ benefits: /digestion/i }).limit(3);
      response = `For better digestion, try these:\n\n${foods.map(f => `• ${f.name}: ${f.description}`).join('\n')}\n\nThese aid in digestive fire (Agni) according to Ayurveda.`;
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      response = `For stress relief, Ayurveda recommends:\n\n• Ashwagandha: An adaptogenic herb that reduces cortisol\n• Tulsi (Holy Basil): Calms the mind and reduces anxiety\n• Brahmi: Enhances mental clarity\n\nAlso practice deep breathing (Pranayama) and meditation daily.`;
    } else if (lowerMessage.includes('immunity') || lowerMessage.includes('immune')) {
      const foods = await Food.find({ benefits: /immunity/i }).limit(3);
      response = `To boost immunity naturally:\n\n${foods.map(f => `• ${f.name}: ${f.description}`).join('\n')}\n\nThese strengthen your Ojas (vital energy) in Ayurveda.`;
    } else if (lowerMessage.includes('weight') || lowerMessage.includes('lose weight')) {
      response = `For healthy weight management according to Ayurveda:\n\n• Drink warm water with lemon in the morning\n• Eat Triphala before bed\n• Include ginger and cumin in your meals\n• Practice mindful eating\n• Balance your Kapha dosha\n\nYour current dosha is ${user.dosha}. Would you like personalized recommendations?`;
    } else if (lowerMessage.includes('dosha')) {
      response = `Your current dosha type is: ${user.dosha.toUpperCase()}\n\nDoshas are the three fundamental energies in Ayurveda:\n\n• Vata: Air & Space (movement, creativity)\n• Pitta: Fire & Water (transformation, metabolism)\n• Kapha: Earth & Water (structure, stability)\n\nWould you like food recommendations for your dosha?`;
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      response = `For better sleep according to Ayurveda:\n\n• Drink warm milk with nutmeg before bed\n• Apply sesame oil to your feet\n• Avoid screens 1 hour before sleep\n• Practice Shirodhara (oil therapy)\n• Go to bed before 10 PM (Kapha time)\n\nConsistent sleep routine balances Vata dosha.`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = `Namaste! 🙏 I'm your Ayurvedic health guide. I can help you with:\n\n• Food recommendations for specific diseases\n• Understanding your dosha\n• Natural remedies for common ailments\n• Health tips based on ancient wisdom\n\nWhat would you like to know?`;
    } else {
      response = `I understand you're asking about "${message}". Here are some general Ayurvedic principles:\n\n• Eat according to your dosha type (yours is ${user.dosha})\n• Follow daily routines (Dinacharya)\n• Use food as medicine\n• Balance the six tastes in each meal\n\nCould you be more specific about your health concern? I can provide better recommendations for conditions like diabetes, digestion, stress, immunity, or weight management.`;
    }

    res.json({
      message: response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
