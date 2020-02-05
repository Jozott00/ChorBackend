const Sequ = require('sequelize');

const sequelize = require('../utils/database');

const Buyer = sequelize.define('buyer', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequ.STRING,
  firstname: Sequ.STRING,
  order_date: {
    type: Sequ.DATEONLY,
    allowNull: false,
    defaultValue: Sequ.NOW
  },
  is_paid: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  phone: Sequ.STRING,
  email: Sequ.STRING
});

module.exports = Buyer;
