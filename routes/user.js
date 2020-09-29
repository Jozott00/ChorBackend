const express = require('express');

const controller = require('../controller/user');
const router = express.Router();

router.get('/', controller.getConcerts);

router.get('/concert/:concertId', controller.getConcert);

router.post('/concert/:concertId', controller.postOrder);

router.get('/reservation-email/', controller.getReservationEmail);

router.get('/checkout/payment/', controller.getPaymentForwarding);

router.get('/checkout/success/', controller.getSuccess);

router.get('/checkout/cancel', controller.getCancel);

router.post('/posttest', controller.getPostTest);

module.exports = router;
