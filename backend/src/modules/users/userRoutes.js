const express = require('express');
const userController = require('./userController');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.put('/change-password', authenticateToken, userController.changePassword);
router.delete('/account', authenticateToken, userController.deleteAccount);

module.exports = router;
