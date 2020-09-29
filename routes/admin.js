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

router.get('/approvals', isAuth, min.overallAdmin, controller.getApprovals);

router.get(
  '/chorsetting',
  isAuth,
  min.chorAdministrator,
  controller.getChorAdministration
);

router.get(
  '/chorsetting/addmember',
  isAuth,
  min.chorAdministrator,
  controller.getAddMember
);

router.get(
  '/chorsetting/delete/:memberId',
  isAuth,
  min.chorAdministrator,
  controller.getDeleteMember
);

router.get(
  '/chorsetting/edit/:memberId',
  isAuth,
  min.chorAdministrator,
  controller.getEditMember
);

router.get(
  '/chorsetting/csv',
  isAuth,
  min.chorAdministrator,
  controller.getCsv
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

router.post('/approvals', isAuth, min.overallAdmin, controller.postApprovals);

router.post(
  '/chorsetting',
  isAuth,
  min.chorAdministrator,
  controller.postChorAdministration
);

router.post(
  '/chorsetting/addMember',
  isAuth,
  min.chorAdministrator,
  controller.postAddMember
);

router.post(
  '/chorsetting/edit/:memberId',
  isAuth,
  min.chorAdministrator,
  controller.postEditMember
);

router.post('/email', isAuth, min.mailSender, controller.postEmail);

module.exports = router;
