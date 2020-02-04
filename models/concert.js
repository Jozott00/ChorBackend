const Sequ = require('sequelize');
const sequelize = require('../utils/database');

const Concert = sequelize.define('concert', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequ.STRING,
  componist: Sequ.STRING,
  date: {
    type: Sequ.DATE,
    allowNull: true
  },
  sold: {
    type: Sequ.INTEGER,
    defaultValue: 0
  },
  ordered: {
    type: Sequ.INTEGER,
    defaultValue: 0
  },
  ticketsSold: {
    type: Sequ.INTEGER,
    defaultValue: 0
  },
  sell_start: {
    type: Sequ.DATE,
    defaultValue: sequelize.fn('NOW')
  },
  sell_end: {
    type: Sequ.DATE,
    defaultValue: sequelize.fn('NOW')
  }
});

module.exports = Concert;
