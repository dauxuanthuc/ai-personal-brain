/**
 * Auth Routes
 * Refactored with DI Container
 */

const express = require('express');

const createAuthRoutes = (container) => {
  const router = express.Router();
  const authController = container.getAuthController();

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/google', authController.googleLogin);
  router.get('/verify-email', authController.verifyEmail);
  router.post('/resend-verify', authController.resendVerifyEmail);

  return router;
};

module.exports = createAuthRoutes;