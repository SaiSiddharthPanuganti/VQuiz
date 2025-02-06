const Quiz = require('./Quiz');
const Question = require('./Question');
const User = require('./User');

// Define associations
Quiz.hasMany(Question, {
  foreignKey: 'quizId',
  onDelete: 'CASCADE'
});

Question.belongsTo(Quiz, {
  foreignKey: 'quizId'
});

User.hasMany(Quiz, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Quiz.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = {
  Quiz,
  Question,
  User
}; 