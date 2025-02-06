const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const GeminiService = require('../utils/geminiService');
const YoutubeService = require('../utils/youtubeService');

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { youtubeLink, questionType, numberOfQuestions, difficulty } = req.body;

    if (!youtubeLink) {
      return res.status(400).json({ message: 'YouTube link is required' });
    }

    // Extract video transcript
    const youtubeService = new YoutubeService();
    const transcript = await youtubeService.getTranscript(youtubeLink);

    if (!transcript) {
      return res.status(400).json({ message: 'Could not extract transcript from video' });
    }

    // Generate quiz using Gemini
    const questions = await GeminiService.generateQuestions(transcript, {
      questionType,
      numberOfQuestions,
      difficulty
    });

    res.json({
      success: true,
      questions
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to generate quiz' 
    });
  }
});

module.exports = router; 