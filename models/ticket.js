const Sequ = require('sequelize');

const sequelize = require('../utils/database');

const Ticket = sequelize.define('ticket', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  price: Sequ.INTEGER,
  amount: Sequ.INTEGER,
  sector: Sequ.STRING,
  rowId: Sequ.INTEGER,
  rowName: Sequ.STRING
  // discount: {
  //   type: Sequ.DOUBLE,
  //   defaultValue: 0,
  //   allowNull: false
  // }
});

module.exports = Ticket;
