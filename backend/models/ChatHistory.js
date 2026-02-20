const mongoose = require('mongoose');

const chatHistorySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        role: {
            type: String,
            enum: ['user', 'model'],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
