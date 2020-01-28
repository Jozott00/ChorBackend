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
  order_date: Sequ.DATE,
  is_paid: Sequ.BOOLEAN,
  phone: Sequ.STRING,
  email: Sequ.STRING
});

module.exports = Buyer;
