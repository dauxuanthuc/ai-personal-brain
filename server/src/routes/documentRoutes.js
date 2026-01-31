const express = require('express');
const multer = require('multer');
const { uploadDocument, deleteDocument } = require('../controllers/documentController');

const router = express.Router();

// Cấu hình nơi lưu file (thư mục 'uploads/')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Đặt tên file: timestamp-ten-goc.pdf
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// API Endpoint: POST /api/documents/upload
router.post('/upload', upload.single('pdfFile'), uploadDocument);

// API Endpoint: DELETE /api/documents/:documentId
router.delete('/:documentId', deleteDocument);

module.exports = router;