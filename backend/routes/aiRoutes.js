const express = require('express');
const router = express.Router();
const { askAI, summarizeNote, generateQuiz } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/ask', protect, upload.single('file'), askAI);
router.post('/summary', protect, summarizeNote);
router.post('/quiz', protect, generateQuiz);

module.exports = router;
