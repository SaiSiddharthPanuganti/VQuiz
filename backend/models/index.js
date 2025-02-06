const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: 'mysql'
  }
);

const User = require('./User')(sequelize);
const Quiz = require('./Quiz')(sequelize);

// Define associations
User.hasMany(Quiz);
Quiz.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Quiz
}; 