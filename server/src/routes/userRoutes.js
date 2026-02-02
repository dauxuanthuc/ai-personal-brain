/**
 * User Routes
 * Refactored with DI Container
 */

const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/authMiddleware');

const createUserRoutes = (container) => {
  const router = express.Router();
  const userController = container.getUserController();

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('File không hợp lệ. Chỉ nhận ảnh.'));
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  });

  router.get('/me', authenticateToken, userController.getMe);
  router.put('/me', authenticateToken, userController.updateProfile);
  router.put('/me/password', authenticateToken, userController.updatePassword);
  router.post('/me/avatar', authenticateToken, upload.single('avatar'), userController.updateAvatar);

  return router;
};

module.exports = createUserRoutes;
