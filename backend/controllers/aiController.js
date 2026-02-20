const aiService = require('../services/aiService');
const Note = require('../models/Note');
const ChatHistory = require('../models/ChatHistory');
const fs = require('fs');
const pdf = require('pdf-parse');
const AdmZip = require('adm-zip');

const extractDocxText = (filePath) => {
    try {
        const buf = fs.readFileSync(filePath);

        if (buf[0] === 0x50 && buf[1] === 0x4B) {
            const zip = new AdmZip(filePath);
            const docEntry = zip.getEntry('word/document.xml');
            if (!docEntry) throw new Error('Not a valid DOCX file (missing word/document.xml)');
            const xml = docEntry.getData().toString('utf8');
            const matches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
            return matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ').replace(/\s+/g, ' ').trim();
        } else {
            return buf.toString('utf8').trim();
        }
    } catch (err) {
        console.error('DOCX extraction failed:', err.message);
        return '';
    }
};

const extractNoteContent = async (note) => {
    if (note.content && note.content.trim()) {
        return note.content;
    }

    if (!note.fileUrl) return '';

    try {
        if (!fs.existsSync(note.fileUrl)) {
            console.error(`File path does not exist: ${note.fileUrl}`);
            return '';
        }

        if (note.mimeType === 'application/pdf' || note.fileUrl.toLowerCase().endsWith('.pdf')) {
            const dataBuffer = fs.readFileSync(note.fileUrl);
            const data = await pdf(dataBuffer);
            const extracted = data.text.trim();
            note.content = extracted;
            await note.save();
            return extracted;
        } else if (
            note.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            note.mimeType === 'application/msword' ||
            note.fileUrl.toLowerCase().endsWith('.docx') || note.fileUrl.toLowerCase().endsWith('.doc')
        ) {
            const extracted = extractDocxText(note.fileUrl);
            note.content = extracted;
            await note.save();
            return extracted;
        } else if (note.mimeType === 'text/plain' || note.fileUrl.toLowerCase().endsWith('.txt')) {
            const extracted = fs.readFileSync(note.fileUrl, 'utf8').trim();
            note.content = extracted;
            await note.save();
            return extracted;
        }
    } catch (err) {
        console.error(`Failed to extract content for note "${note.title}":`, err.message);
    }

    return '';
};

const askAI = async (req, res) => {
    try {
        const { question } = req.body;
        let fileContext = '';
        let isImageUpload = false;

        if (req.file) {
            const mimeType = req.file.mimetype;
            const filePath = req.file.path;
            const originalName = req.file.originalname;
            const ext = originalName.split('.').pop().toLowerCase();

            console.log(`[askAI] File received locally: ${originalName}, path: ${filePath}`);

            try {
                if (mimeType === 'application/pdf' || ext === 'pdf') {
                    const dataBuffer = fs.readFileSync(filePath);
                    const data = await pdf(dataBuffer);
                    fileContext = `[Uploaded File: ${originalName}]\n${data.text}`;
                } else if (ext === 'docx' || ext === 'doc' ||
                    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    mimeType === 'application/msword') {
                    const text = extractDocxText(filePath);
                    fileContext = `[Uploaded File: ${originalName}]\n${text}`;
                } else if (mimeType === 'text/plain' || ext === 'txt') {
                    const text = fs.readFileSync(filePath, 'utf8');
                    fileContext = `[Uploaded File: ${originalName}]\n${text}`;
                } else if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                    isImageUpload = true;
                    fileContext = `[Uploaded Image: ${originalName}]\nThe user has uploaded an image file. Unfortunately, this AI model is text-only and cannot view images directly. Please describe the image content in text, or ask a question about the subject matter shown.`;
                }
            } catch (extractErr) {
                console.error('[askAI] File extraction error:', extractErr.message);
                res.status(500).json({ message: `Failed to read uploaded file: ${extractErr.message}` });
                return;
            }
        }

        if (!question && !fileContext) {
            res.status(400).json({ message: 'Please provide a question or upload a file' });
            return;
        }

        let context = '';

        if (fileContext) {
            context = fileContext;
        } else {
            const notes = await Note.find({ user: req.user.id });
            const noteContextParts = await Promise.all(
                notes.map(async (note) => {
                    const content = await extractNoteContent(note);
                    if (!content) return null;
                    return `[Note: ${note.title}]\n${content}`;
                })
            );
            context = noteContextParts.filter(Boolean).join('\n\n---\n\n');
        }

        const query = question || (isImageUpload ? 'Describe what you see' : 'Analyze this file');
        const answer = await aiService.generateResponse(query, context);

        await ChatHistory.create({
            user: req.user.id,
            role: 'user',
            message: query + (req.file ? ` [Attached: ${req.file.originalname}]` : ''),
        });

        await ChatHistory.create({
            user: req.user.id,
            role: 'model',
            message: answer,
        });

        res.status(200).json({ answer });
    } catch (error) {
        console.error('[askAI] Fatal error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

const summarizeNote = async (req, res) => {
    let { content, noteId } = req.body;

    if ((!content || !content.trim()) && noteId) {
        try {
            const note = await Note.findById(noteId);
            if (note) {
                content = await extractNoteContent(note);
            }
        } catch (err) {
            console.error('Error re-extracting note content:', err);
        }
    }

    if (!content || !content.trim()) {
        res.status(400).json({ message: 'No content found to summarize. Please add text or upload a readable file.' });
        return;
    }

    try {
        const summary = await aiService.generateSummary(content);
        res.status(200).json({ summary });
    } catch (error) {
        console.error('[summarizeNote] error:', error);
        res.status(500).json({ message: error.message });
    }
};

const generateQuiz = async (req, res) => {
    const { topic, difficulty } = req.body;

    if (!topic) {
        res.status(400).json({ message: 'Please provide a topic' });
        return;
    }

    try {
        const quiz = await aiService.generateQuiz(topic, difficulty);
        res.status(200).json({ quiz });
    } catch (error) {
        console.error('[generateQuiz] error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    askAI,
    summarizeNote,
    generateQuiz,
};
