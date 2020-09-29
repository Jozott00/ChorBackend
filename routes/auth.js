const express = require('express');

const controller = require('../controller/auth');

const router = express.Router();

router.get('/signin', controller.getSignin);

router.get('/signup', controller.getSignup);

router.get('/logout', controller.getLogout);

router.post('/signin', controller.postSignin);

router.post('/signup', controller.postSignup);

//QR APP ROUTER
router.get('/qrapp/ticketcheck/', controller.getQRcheck);

router.get('/qrapp/ticketcheck/scanned/', controller.getQRchecked);

module.exports = router;
