const QuizGenerator = require('../utils/quizGenerator');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

exports.generateQuiz = async (req, res) => {
  try {
    const { videoUrl, preferences } = req.body;
    
    // Generate quiz questions using Gemini
    const questions = await QuizGenerator.generateQuiz(videoUrl, preferences);
    
    // Save to database
    const quiz = await Quiz.create({
      videoUrl,
      questionType: preferences.questionType,
      difficulty: preferences.difficulty
    });

    // Save questions
    await Promise.all(questions.map(q => 
      Question.create({
        quizId: quiz.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      })
    ));

    res.json({
      success: true,
      quiz: {
        id: quiz.id,
        questions
      }
    });
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findByPk(quizId, { include: Question });
    
    let score = 0;
    quiz.Questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    const attempt = await Attempt.create({
      quizId,
      score,
      answers
    });

    res.json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: Question
    });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Attempt,
        attributes: ['score', 'createdAt']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      quizzes: quizzes.map(quiz => ({
        id: quiz.id,
        videoUrl: quiz.videoUrl,
        questionType: quiz.questionType,
        difficulty: quiz.difficulty,
        createdAt: quiz.createdAt,
        attempts: quiz.Attempts
      }))
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quiz history'
    });
  }
};

exports.getQuizDetails = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Question,
          attributes: ['question', 'options', 'correctAnswer', 'explanation']
        },
        {
          model: Attempt,
          attributes: ['score', 'answers', 'createdAt']
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quiz details'
    });
  }
}; 