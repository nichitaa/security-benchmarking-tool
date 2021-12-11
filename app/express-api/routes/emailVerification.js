const express = require('express');
const EmailVerification = require('../controllers/EmailVerification')

const router = express.Router();
const controller = new EmailVerification();

router.post('/send-email-verification/:email', controller.sendEmailVerification.bind(controller));

router.get('/check-email-verification/:token', controller.checkEmailToken.bind(controller));

router.get('/is-email-verified/:email', controller.isEmailVerified.bind(controller));

module.exports = router;
