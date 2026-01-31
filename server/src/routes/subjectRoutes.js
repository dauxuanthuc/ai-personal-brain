const express = require('express');
const { getSubjects, createSubject, getSubjectGraph, deleteSubject, getDocuments, askQuestion } = require('../controllers/subjectController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken); 

router.get('/', getSubjects);
router.post('/', createSubject);
router.get('/:subjectId/graph', getSubjectGraph);
router.get('/:subjectId/documents', getDocuments);
router.post('/:subjectId/ask', askQuestion); // Route mới cho AI chat
router.delete('/:subjectId', deleteSubject);

module.exports = router;