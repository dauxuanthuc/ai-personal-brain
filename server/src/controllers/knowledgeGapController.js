class KnowledgeGapController {
  constructor(knowledgeGapService) {
    this.knowledgeGapService = knowledgeGapService;
  }

  async analyzeSubject(req, res) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.userId || req.user.id;

      if (!subjectId) {
        return res.status(400).json({ error: 'Missing subjectId' });
      }

      const result = await this.knowledgeGapService.analyzeSubject(userId, subjectId);
      res.json(result);
    } catch (error) {
      console.error('Knowledge gap error:', error);
      res.status(500).json({ error: 'Không thể phân tích lỗ hổng kiến thức' });
    }
  }
}

module.exports = KnowledgeGapController;
