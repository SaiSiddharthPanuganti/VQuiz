const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/generate-quiz', quizController.generateQuiz);
router.post('/submit-attempt', quizController.submitAttempt);
router.get('/quiz/:id', quizController.getQuiz);
router.get('/quiz-history', auth, quizController.getQuizHistory);
router.get('/quiz/:id', auth, quizController.getQuizDetails);

module.exports = router; 