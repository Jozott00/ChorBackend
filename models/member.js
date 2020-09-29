const Sequ = require('sequelize');

const sequelize = require('../utils/database');

const Member = sequelize.define('member', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequ.STRING,
  firstname: Sequ.STRING,
  email: Sequ.STRING,
  phone: Sequ.STRING,
  catCode: {
    type: Sequ.INTEGER,
    allowNull: false,
    defaultValue: Sequ.NOW
  }
});

module.exports = Member;
