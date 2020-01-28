const Sequ = require('sequelize');

const sequelize = require('../utils/database');

const Sector = sequelize.define('sector', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  price: Sequ.INTEGER
});

module.exports = Sector;
