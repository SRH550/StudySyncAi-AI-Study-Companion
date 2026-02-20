const mongoose = require('mongoose');

const quizAttemptSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        score: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
