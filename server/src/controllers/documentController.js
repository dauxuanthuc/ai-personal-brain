/**
 * Document Controller - Handler cho document routes
 * SRP: Chỉ xử lý request/response
 * DIP: Nhận DocumentService qua constructor
 */

const queueService = require('../services/queueService');

const DocumentController = (documentService) => {
  return {
    /**
     * POST /api/documents/upload
     * Upload document with async processing (recommended)
     */
    uploadDocument: async (req, res, next) => {
      try {
        const file = req.file;
        const { subjectId } = req.body;
        const userId = req.user?.id || req.user?.userId;

        // Use async processing with queue
        const result = await documentService.uploadDocumentAsync(file, subjectId, userId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/documents/upload-sync
     * Upload with synchronous processing (legacy, may timeout)
     */
    uploadDocumentSync: async (req, res, next) => {
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
     * GET /api/documents/:documentId/status
     * Get processing status of a document
     */
    getDocumentStatus: async (req, res, next) => {
      try {
        const { documentId } = req.params;
        
        // Get document from database
        const document = await documentService.documentRepository.findById(documentId);
        
        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }

        // If processing, try to get job progress
        let jobStatus = null;
        if (document.processingStatus === 'processing' || document.processingStatus === 'pending') {
          try {
            jobStatus = await queueService.getJobStatus('pdf-processing', `pdf-${documentId}`);
          } catch (error) {
            // Queue might not be available, just continue
          }
        }

        res.json({
          documentId: document.id,
          title: document.title,
          status: document.processingStatus,
          error: document.processingError,
          uploadedAt: document.uploadedAt,
          job: jobStatus,
        });
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