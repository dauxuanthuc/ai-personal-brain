/**
 * Concept Routes
 * Refactored with DI Container
 */

const express = require('express');

const createConceptRoutes = (container) => {
  const router = express.Router();
  const conceptController = container.getConceptController();

  router.delete('/:conceptId', conceptController.deleteConcept);

  return router;
};

module.exports = createConceptRoutes;
