const Sequ = require('sequelize');
const sequelize = require('../utils/database');

const Row = sequelize.define('row', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  is_available: Sequ.BOOLEAN,
  max_seats: Sequ.INTEGER,
  orders: Sequ.INTEGER,
  generalId: Sequ.STRING,
  sectorId: Sequ.INTEGER
});

module.exports = Row;
