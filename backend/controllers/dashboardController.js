const Note = require('../models/Note');
const ChatHistory = require('../models/ChatHistory');
const QuizAttempt = require('../models/QuizAttempt');

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const notesCount = await Note.countDocuments({ user: userId });

        const chatCount = await ChatHistory.countDocuments({ user: userId, role: 'user' });

        const attempts = await QuizAttempt.find({ user: userId });
        let quizScore = 0;
        if (attempts.length > 0) {
            const totalScore = attempts.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0);
            quizScore = Math.round(totalScore / attempts.length);
        }

        const noteDates = await Note.find({ user: userId }).select('createdAt');
        const chatDates = await ChatHistory.find({ user: userId }).select('createdAt');
        const quizDates = await QuizAttempt.find({ user: userId }).select('createdAt');

        const allDates = [
            ...noteDates.map(n => n.createdAt),
            ...chatDates.map(c => c.createdAt),
            ...quizDates.map(q => q.createdAt)
        ].map(date => new Date(date).toISOString().split('T')[0]);

        const uniqueDates = [...new Set(allDates)].sort().reverse();

        let studyStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (uniqueDates.length > 0) {
            if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
                studyStreak = 1;
                let currentDate = new Date(uniqueDates[0]);

                for (let i = 1; i < uniqueDates.length; i++) {
                    const prevDate = new Date(uniqueDates[i]);
                    const diffTime = Math.abs(currentDate - prevDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        studyStreak++;
                        currentDate = prevDate;
                    } else {
                        break;
                    }
                }
            }
        }

        res.status(200).json({
            notesCount,
            chatCount,
            quizScore,
            studyStreak,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await Note.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
        const quizzes = await QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
        const chats = await ChatHistory.find({ user: userId, role: 'user' }).sort({ createdAt: -1 }).limit(5);

        const activity = [];

        notes.forEach(note => {
            activity.push({
                type: 'note',
                action: 'Note uploaded',
                item: note.title,
                time: note.createdAt
            });
        });

        quizzes.forEach(quiz => {
            activity.push({
                type: 'quiz',
                action: 'Quiz completed',
                item: `${quiz.topic} (${quiz.difficulty})`,
                time: quiz.createdAt
            });
        });

        chats.forEach(chat => {
            activity.push({
                type: 'chat',
                action: 'Chat session',
                item: chat.message.substring(0, 30) + (chat.message.length > 30 ? '...' : ''),
                time: chat.createdAt
            });
        });

        activity.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json(activity.slice(0, 5));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getRecentActivity
};
