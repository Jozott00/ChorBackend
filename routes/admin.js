const express = require('express');

const controller = require('../controller/admin');
const router = express.Router();

router.get('/', controller.getIndex);
router.get('/concerts', controller.getConcerts);
router.get('/concert/:concertId', controller.getConcert);
router.post('/concert/update/:concertId', controller.postConcertUpdate);
router.get('/concerts/new', controller.getNewConcert);
router.post('/concerts/new', controller.postNewConcert);
router.get('/concert/edit/:concertId', controller.getConcertEdit);
router.post('/concert/edit/:concertId', controller.postConcertEdit);

module.exports = router;
