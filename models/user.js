const Sequ = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('user', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequ.STRING,
    allowNull: false
  },
  password: {
    type: Sequ.STRING,
    allowNull: false
  },
  approvalCode: {
    type: Sequ.INTEGER,
    allowNull: false
  }
});

module.exports = User;
