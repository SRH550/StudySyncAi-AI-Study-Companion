const express = require('express');
const router = express.Router();
const {
    getChatHistory,
    getQuizHistory,
    saveQuizAttempt,
} = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/ai', protect, getChatHistory);
router.get('/quiz', protect, getQuizHistory);
router.post('/quiz', protect, saveQuizAttempt);

module.exports = router;
