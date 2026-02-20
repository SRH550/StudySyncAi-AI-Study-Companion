const ChatHistory = require('../models/ChatHistory');
const QuizAttempt = require('../models/QuizAttempt');

const getChatHistory = async (req, res) => {
    try {
        const history = await ChatHistory.find({ user: req.user.id }).sort({ createdAt: 1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getQuizHistory = async (req, res) => {
    try {
        const history = await QuizAttempt.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const saveQuizAttempt = async (req, res) => {
    const { score, totalQuestions, topic, difficulty } = req.body;

    if (score === undefined || !totalQuestions || !topic || !difficulty) {
        res.status(400).json({ message: 'Please provide all quiz details' });
        return;
    }

    try {
        const attempt = await QuizAttempt.create({
            user: req.user.id,
            score,
            totalQuestions,
            topic,
            difficulty,
        });
        res.status(201).json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatHistory,
    getQuizHistory,
    saveQuizAttempt,
};
