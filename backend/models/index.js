const Quiz = require('./Quiz');
const Question = require('./Question');
const Attempt = require('./Attempt');

// Define associations with explicit foreign keys
Quiz.hasMany(Question, { foreignKey: 'quizId' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

Quiz.hasMany(Attempt, { foreignKey: 'quizId' });
Attempt.belongsTo(Quiz, { foreignKey: 'quizId' });

module.exports = {
  Quiz,
  Question,
  Attempt
}; 