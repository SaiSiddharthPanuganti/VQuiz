const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get user's quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    const { title, videoUrl, score, totalQuestions, correctAnswers, difficulty, timeSpent, questions } = req.body;
    
    const quiz = await Quiz.create({
      userId: req.user.id,
      title,
      videoUrl,
      score,
      totalQuestions,
      correctAnswers,
      difficulty,
      timeSpent,
      questions
    });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 