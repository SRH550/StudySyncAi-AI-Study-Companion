const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a note title'],
        },
        content: {
            type: String,
            required: false,
        },
        fileUrl: {
            type: String,
        },
        originalName: {
            type: String,
        },
        mimeType: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Note', noteSchema);
