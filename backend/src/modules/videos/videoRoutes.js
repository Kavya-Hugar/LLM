const express = require('express');
const videoController = require('./videoController');
const { authenticateToken, optionalAuth } = require('../../middleware/auth');

const router = express.Router();

router.get('/:videoId', optionalAuth, videoController.getVideoById);
router.get('/section/:sectionId', optionalAuth, videoController.getVideosBySection);
router.get('/subjects/:subjectId/first-video', optionalAuth, videoController.getFirstVideoOfSubject);

module.exports = router;
