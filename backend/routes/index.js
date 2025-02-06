const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const quizRoutes = require('./quiz');

router.use('/auth', authRoutes);
router.use('/quiz', quizRoutes);

module.exports = router; 