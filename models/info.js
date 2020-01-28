const Sequ = require('sequelize');
const sequelize = require('../utils/database');

const Info = sequelize.define('info', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  info: {
    type: Sequ.STRING,
    defaultValue: 'Nicht beschrieben'
  },
  location: {
    type: Sequ.STRING,
    defaultValue: 'Nicht beschrieben'
  },
  time: {
    type: Sequ.STRING,
    defaultValue: Sequ.TIME
  }
});

module.exports = Info;
