const Note = require('../models/Note');
const fs = require('fs');
const pdf = require('pdf-parse');
const AdmZip = require('adm-zip');
const path = require('path');

const extractDocxText = (filePath) => {
    try {
        const zip = new AdmZip(filePath);
        const docEntry = zip.getEntry('word/document.xml');
        if (!docEntry) throw new Error('Not a valid DOCX file');
        const xml = docEntry.getData().toString('utf8');
        const matches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
        return matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ').replace(/\s+/g, ' ').trim();
    } catch (err) {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8').trim();
        }
        return '';
    }
};

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createNote = async (req, res) => {
    try {
        let content = req.body.content || '';
        const title = req.body.title;
        let fileUrl = '';
        let originalName = '';
        let mimeType = '';

        if (req.file) {
            fileUrl = req.file.path;
            originalName = req.file.originalname;
            mimeType = req.file.mimetype;

            if (mimeType === 'application/pdf') {
                try {
                    const dataBuffer = fs.readFileSync(req.file.path);
                    const data = await pdf(dataBuffer);
                    content += '\n\n' + data.text;
                } catch (err) {
                    console.error('Error extracting PDF text:', err);
                }
            } else if (
                mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                mimeType === 'application/msword' ||
                req.file.originalname.endsWith('.docx') || req.file.originalname.endsWith('.doc')
            ) {
                try {
                    const text = extractDocxText(req.file.path);
                    content += '\n\n' + text;
                } catch (err) {
                    console.error('Error extracting DOCX text:', err);
                }
            } else if (mimeType === 'text/plain') {
                try {
                    const data = fs.readFileSync(req.file.path, 'utf8');
                    content += '\n\n' + data;
                } catch (err) {
                    console.error('Error reading text file:', err);
                }
            }
        }

        if (!title) {
            res.status(400).json({ message: 'Please add a note title' });
            return;
        }

        const note = await Note.create({
            user: req.user.id,
            title,
            content: content.trim(),
            fileUrl,
            originalName,
            mimeType,
        });

        res.status(201).json(note);
    } catch (error) {
        console.error('[createNote] Fatal error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        if (note.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        if (note.user.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        if (note.fileUrl && fs.existsSync(note.fileUrl)) {
            try {
                fs.unlinkSync(note.fileUrl);
            } catch (err) {
                console.error('Error deleting local file:', err.message);
            }
        }

        await note.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};
