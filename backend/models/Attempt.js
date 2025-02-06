const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Quiz = require('./Quiz');

const Attempt = sequelize.define('Attempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answers: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('answers'));
    },
    set(value) {
      this.setDataValue('answers', JSON.stringify(value));
    }
  }
});

// Define the association with explicit foreign key
Attempt.belongsTo(Quiz, { 
  foreignKey: 'quizId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = Attempt; 