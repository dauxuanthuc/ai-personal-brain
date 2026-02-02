/**
 * Subject Controller - Handler cho subject routes
 * SRP: Chỉ xử lý request/response
 * DIP: Nhận SubjectService, QAService qua constructor
 */

const SubjectController = (subjectService, qaService) => {
  return {
    /**
     * GET /api/subjects
     */
    getSubjects: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const subjects = await subjectService.getUserSubjects(userId);
        res.json(subjects);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/subjects
     */
    createSubject: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { name, description } = req.body;
        const subject = await subjectService.createSubject(userId, {
          name,
          description,
        });
        res.status(201).json(subject);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /api/subjects/:subjectId/graph
     */
    getSubjectGraph: async (req, res, next) => {
      try {
        const { subjectId } = req.params;
        const graph = await subjectService.getSubjectGraph(subjectId);
        res.json(graph);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /api/subjects/:subjectId/documents
     */
    getDocuments: async (req, res, next) => {
      try {
        const { subjectId } = req.params;
        const documents = await subjectService.getSubjectDocuments(subjectId);
        res.json(documents);
      } catch (error) {
        next(error);
      }
    },

    /**
     * DELETE /api/subjects/:subjectId
     */
    deleteSubject: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { subjectId } = req.params;
        const result = await subjectService.deleteSubject(subjectId, userId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/subjects/:subjectId/ask
     */
    askQuestion: async (req, res, next) => {
      try {
        const { subjectId } = req.params;
        const { question } = req.body;
        const result = await qaService.answerQuestion(subjectId, question);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};

module.exports = SubjectController;