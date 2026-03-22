const express = require('express');
const aiController = require('./aiController');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

router.post('/chat', authenticateToken, aiController.chatWithTutor);
router.post('/summarize', authenticateToken, aiController.summarizeLesson);
router.post('/quiz', authenticateToken, aiController.generateQuiz);

module.exports = router;
