const express = require('express');

const controller = require('../controller/admin');
const isAuth = require('../helpers/is-auth');
const min = require('../helpers/minimumApproval');

const router = express.Router();

router.get('/', isAuth, min.mailSender, controller.getIndex);

router.get('/concerts', isAuth, min.concertAnalyst, controller.getConcerts);

router.get(
  '/concert/:concertId',
  isAuth,
  min.concertAnalyst,
  controller.getConcert
);

router.get(
  '/concerts/new',
  isAuth,
  min.concertAdministrator,
  controller.getNewConcert
);

router.get('/noapproval', isAuth, controller.getNoApproval);

router.get(
  '/concert/edit/:concertId',
  isAuth,
  min.concertAdministrator,
  controller.getConcertEdit
);

router.post(
  '/concert/update/:concertId',
  isAuth,
  min.concertSeller,
  controller.postConcertUpdate
);

router.post(
  '/concerts/new',
  isAuth,
  min.concertAdministrator,
  controller.postNewConcert
);

router.post(
  '/concert/edit/:concertId',
  isAuth,
  min.concertAdministrator,
  controller.postConcertEdit
);

module.exports = router;
