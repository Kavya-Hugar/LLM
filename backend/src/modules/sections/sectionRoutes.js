const express = require('express');
const sectionController = require('./sectionController');
const { authenticateToken, optionalAuth } = require('../../middleware/auth');

const router = express.Router();

router.get('/subject/:subjectId', optionalAuth, sectionController.getSectionsBySubject);
router.get('/:sectionId', optionalAuth, sectionController.getSectionById);

module.exports = router;
