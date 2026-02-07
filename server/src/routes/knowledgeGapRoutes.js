const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');

module.exports = function createKnowledgeGapRoutes(container) {
  const router = express.Router();
  const controller = container.getKnowledgeGapController();

  router.get('/:subjectId', authenticateToken, (req, res) =>
    controller.analyzeSubject(req, res)
  );

  return router;
};
