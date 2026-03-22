const express = require('express');
const authController = require('./authController');
const { validateRegistration, validateLogin } = require('../../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
