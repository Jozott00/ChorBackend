const Sequ = require('sequelize');
const sequelize = require('../utils/database');

const Availability = sequelize.define('availability', {
  id: {
    type: Sequ.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  is_available: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  hr: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  hl: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  sr: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  sl: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  hrs: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  hls: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  srs: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  sls: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  er: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  el: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  lr: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  ll: {
    type: Sequ.BOOLEAN,
    defaultValue: false
  },
  sectorId: Sequ.BOOLEAN
});

module.exports = Availability;
