const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Quiz = require('./Quiz');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('options'));
    },
    set(value) {
      this.setDataValue('options', JSON.stringify(value));
    }
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  explanation: {
    type: DataTypes.TEXT
  }
});

// Define the association with explicit foreign key
Question.belongsTo(Quiz, {
  foreignKey: 'quizId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = Question; 