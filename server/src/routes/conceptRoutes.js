const express = require('express');
const { deleteConcept } = require('../controllers/conceptController');

const router = express.Router();

// DELETE /api/concepts/:conceptId
router.delete('/:conceptId', deleteConcept);

module.exports = router;
