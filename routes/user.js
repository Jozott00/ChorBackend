const express = require('express');

const controller = require('../controller/user');
const router = express.Router();

router.get('/', controller.getConcerts);

router.get('/concert/:concertId', controller.getConcert);

router.post('/order/:concertId', controller.postOrder);

module.exports = router;
