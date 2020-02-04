const express = require('express');

const controller = require('../controller/auth');

const router = express.Router();

router.get('/signin', controller.getSignin);

router.get('/signup', controller.getSignup);

router.get('/logout', controller.getLogout);

router.post('/signin', controller.postSignin);

router.post('/signup', controller.postSignup);

module.exports = router;
