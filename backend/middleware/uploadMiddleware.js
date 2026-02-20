const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const ALLOWED_EXTS = /pdf|doc|docx|txt|jpg|jpeg|png|gif|webp/;

function checkFileType(file, cb) {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (ALLOWED_EXTS.test(ext)) {
        return cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Allowed: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => checkFileType(file, cb),
});

module.exports = upload;
