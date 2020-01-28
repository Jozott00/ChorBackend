const express = require('express');

const controller = require('../controller/user');
const router = express.Router();

router.get('/concert/:concertId', controller.getConcert);
module.exports = router;
