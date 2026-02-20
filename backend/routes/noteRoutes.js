const express = require('express');
const router = express.Router();
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getNotes)
    .post(protect, upload.single('file'), createNote);

router.route('/:id')
    .put(protect, updateNote)
    .delete(protect, deleteNote);

module.exports = router;
