const express = require('express');
const progressController = require('./progressController');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/overall', authenticateToken, progressController.getOverallProgress);
router.get('/subjects/:subjectId', authenticateToken, progressController.getSubjectProgress);
router.get('/videos/:videoId', authenticateToken, progressController.getVideoProgress);
router.post('/videos/:videoId', authenticateToken, progressController.updateVideoProgress);

module.exports = router;
