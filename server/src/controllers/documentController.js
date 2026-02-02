/**
 * Document Controller - Handler cho document routes
 * SRP: Chỉ xử lý request/response
 * DIP: Nhận DocumentService qua constructor
 */

const DocumentController = (documentService) => {
  return {
    /**
     * POST /api/documents/upload
     */
    uploadDocument: async (req, res, next) => {
      try {
        const file = req.file;
        const { subjectId } = req.body;

        const result = await documentService.uploadDocument(file, subjectId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * DELETE /api/documents/:documentId
     */
    deleteDocument: async (req, res, next) => {
      try {
        const { documentId } = req.params;
        const result = await documentService.deleteDocument(documentId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};

module.exports = DocumentController;