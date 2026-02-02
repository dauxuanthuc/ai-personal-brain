/**
 * Concept Controller - Handler cho concept routes
 * SRP: Chỉ xử lý request/response
 * DIP: Nhận ConceptService qua constructor
 */

const ConceptController = (conceptService) => {
  return {
    /**
     * DELETE /api/concepts/:conceptId
     */
    deleteConcept: async (req, res, next) => {
      try {
        const { conceptId } = req.params;
        const result = await conceptService.deleteConcept(conceptId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};

module.exports = ConceptController;
