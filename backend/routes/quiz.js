const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTranscript, getVideoInfo } = require('../services/youtubeService');
const geminiService = require('../utils/geminiService');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const sequelize = require('../config/database');

// Get user's quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Question,
        attributes: ['id', 'question', 'options', 'correctAnswer', 'explanation']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']]
    });

    const stats = {
      totalQuizzes: quizzes.length,
      averageScore: quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / quizzes.length || 0,
      bestScore: Math.max(...quizzes.map(quiz => quiz.score), 0),
      totalTime: quizzes.reduce((acc, quiz) => acc + quiz.timeSpent, 0),
      progressData: quizzes.map(quiz => ({
        date: quiz.createdAt,
        score: quiz.score
      }))
    };

    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Quiz,
        attributes: ['score', 'difficulty']
      }],
      attributes: ['id', 'username']
    });

    const leaderboard = users.map(user => {
      const quizzes = user.Quizzes;
      return {
        id: user.id,
        username: user.username,
        totalQuizzes: quizzes.length,
        averageScore: quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / quizzes.length || 0,
        bestScore: Math.max(...quizzes.map(quiz => quiz.score), 0),
        level: Math.floor(quizzes.length / 10) + 1 // Level up every 10 quizzes
      };
    }).sort((a, b) => b.averageScore - a.averageScore);

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit quiz
router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findOne({
      where: { id: quizId, userId: req.user.id },
      include: [Question]
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.Questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.Questions.length) * 100;

    // Update quiz with results
    await quiz.update({
      status: 'completed',
      score,
      completedAt: new Date()
    });

    res.json({
      success: true,
      score,
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate quiz route
router.post('/generate', auth, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { videoUrl, questionType, numberOfQuestions, difficulty } = req.body;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'Video URL is required'
      });
    }

    // Get transcript first as it's critical
    const transcript = await getTranscript(videoUrl);

    // Try to get video info, but don't fail if it's not available
    let videoInfo;
    try {
      videoInfo = await getVideoInfo(videoUrl);
    } catch (error) {
      console.warn('Could not fetch video info, using defaults');
      videoInfo = {
        title: 'YouTube Quiz',
        author: 'Unknown'
      };
    }

    // Generate questions using Gemini
    const questions = await geminiService.generateQuestions(transcript, {
      questionType: questionType || 'multiple-choice',
      numberOfQuestions: parseInt(numberOfQuestions) || 5,
      difficulty: difficulty || 'medium'
    });

    // Create quiz with all required fields
    const quiz = await Quiz.create({
      userId: req.user.id,
      title: videoInfo.title,
      videoUrl,
      totalQuestions: questions.length,
      questions: questions,
      difficulty: difficulty || 'medium',
      score: 0,
      correctAnswers: 0,
      timeSpent: 0
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        questions: questions,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.totalQuestions
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate quiz'
    });
  }
});

// Helper function to get video title
async function getVideoTitle(url) {
  try {
    const videoInfo = await ytdl.getInfo(url);
    return videoInfo.videoDetails.title;
  } catch (error) {
    console.error('Error getting video title:', error);
    return 'Quiz';
  }
}

module.exports = router; 