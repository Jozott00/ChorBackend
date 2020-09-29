const sequ = require('./database');

const { Buyer } = require('../models/index');

Buyer.sync();
