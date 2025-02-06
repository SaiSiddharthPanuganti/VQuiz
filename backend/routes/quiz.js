const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTranscript, getVideoInfo } = require('../services/youtubeService');
const geminiService = require('../utils/geminiService');
const { Quiz, User } = require('../models');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { YoutubeTranscript } = require('youtube-transcript');
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Function to get video transcript
const fetchTranscript = async (videoId) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ');
  } catch (error) {
    console.error('Error getting transcript:', error);
    throw new Error('Could not get video transcript');
  }
};

// Function to generate quiz using Gemini
async function generateQuizQuestions(transcript, numberOfQuestions, difficulty, questionType) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Normalize question type to match expected values
  const normalizedQuestionType = questionType.toLowerCase().replace(/\s+/g, '-');
  
  console.log('Starting quiz generation with type:', normalizedQuestionType); // Debug log

  // Validate question type
  if (!['multiple-choice', 'true-false', 'fill-in-the-blanks'].includes(normalizedQuestionType)) {
    throw new Error(`Invalid question type: ${questionType}`);
  }

  let promptTemplate;
  switch (normalizedQuestionType) {
    case 'multiple-choice':
      promptTemplate = `
        Generate ${numberOfQuestions} multiple choice questions about Java programming from this transcript.
        Each question MUST follow this EXACT format:
        {
          "questions": [
            {
              "question": "What is the question?",
              "options": [
                "A) First option",
                "B) Second option",
                "C) Third option",
                "D) Fourth option"
              ],
              "correctAnswer": "A) First option",
              "explanation": "Why this is correct"
            }
          ]
        }
      `;
      break;

    case 'true-false':
      promptTemplate = `
        Generate ${numberOfQuestions} true/false questions about Java programming from this transcript.
        Each question MUST follow this EXACT format:
        {
          "questions": [
            {
              "question": "Statement to evaluate as true or false",
              "options": ["True", "False"],
              "correctAnswer": "True",
              "explanation": "Why this is true or false"
            }
          ]
        }
      `;
      break;

    case 'fill-in-the-blanks':
      promptTemplate = `
        Generate ${numberOfQuestions} fill-in-the-blank questions about Java programming from this transcript.
        Each question MUST follow this EXACT format:
        {
          "questions": [
            {
              "question": "Complete this statement: _____",
              "correctAnswer": "answer",
              "explanation": "Why this is the correct answer"
            }
          ]
        }
      `;
      break;
  }

  const prompt = `
    ${promptTemplate}

    Difficulty: ${difficulty}

    Transcript:
    ${transcript}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Debug log the raw response
    console.log('Raw response:', text);

    // Clean and parse the response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedQuestions = JSON.parse(cleanText);

    // Validate the response format
    if (!parsedQuestions.questions || !Array.isArray(parsedQuestions.questions)) {
      throw new Error('Invalid question format received');
    }

    // Format and validate the response
    const formattedQuiz = {
      questionType: normalizedQuestionType, // Include question type in response
      questions: parsedQuestions.questions.map(q => ({
        question: q.question,
        options: normalizedQuestionType !== 'fill-in-the-blanks' ? q.options : undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'No explanation provided'
      }))
    };

    // Debug log the final formatted questions
    console.log('Final formatted questions:', JSON.stringify(formattedQuiz, null, 2));

    return formattedQuiz;
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error(`Failed to generate ${normalizedQuestionType} questions: ${error.message}`);
  }
}

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

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Generate quiz route
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { videoUrl, numberOfQuestions, difficulty, questionType } = req.body;
    
    if (!videoUrl || !numberOfQuestions || !difficulty || !questionType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    console.log('Received request with question type:', questionType); // Debug log

    const [transcript, videoInfo] = await Promise.all([
      getTranscript(videoUrl),
      getVideoInfo(videoUrl)
    ]);

    const generatedQuiz = await generateQuizQuestions(
      transcript, 
      numberOfQuestions, 
      difficulty, 
      questionType
    );

    // Create quiz with the complete data
    const quiz = await Quiz.create({
      title: videoInfo.title || `Quiz for ${videoUrl}`,
      videoUrl,
      totalQuestions: numberOfQuestions,
      difficulty,
      questionType: generatedQuiz.questionType, // Store normalized question type
      questions: generatedQuiz.questions,
      UserId: req.user.id
    });

    // Send response with complete quiz data
    res.json({
      success: true,
      quiz: {
        ...quiz.toJSON(),
        questionType: generatedQuiz.questionType, // Ensure question type is included
        questions: generatedQuiz.questions,
        videoInfo
      }
    });

  } catch (error) {
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