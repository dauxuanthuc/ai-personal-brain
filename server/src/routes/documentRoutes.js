/**
 * Document Routes
 * Refactored with DI Container
 */

const express = require('express');
const multer = require('multer');

const createDocumentRoutes = (container) => {
  const router = express.Router();
  const documentController = container.getDocumentController();

  // Configure file storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage });

  router.post('/upload', upload.single('pdfFile'), documentController.uploadDocument);
  router.delete('/:documentId', documentController.deleteDocument);

  return router;
};

module.exports = createDocumentRoutes;