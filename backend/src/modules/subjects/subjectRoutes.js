const express = require('express');
const subjectController = require('./subjectController');
const { authenticateToken, optionalAuth } = require('../../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, subjectController.getAllSubjects);
router.get('/enrolled', authenticateToken, subjectController.getEnrolledSubjects);
router.get('/:subjectId', optionalAuth, subjectController.getSubjectById);
router.get('/:subjectId/tree', optionalAuth, subjectController.getSubjectTree);
router.post('/:subjectId/enroll', authenticateToken, subjectController.enrollInSubject);

module.exports = router;
