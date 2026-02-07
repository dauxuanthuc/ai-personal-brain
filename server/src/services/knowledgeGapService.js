class KnowledgeGapService {
  constructor(conceptRepository, quizResultRepository) {
    this.conceptRepository = conceptRepository;
    this.quizResultRepository = quizResultRepository;
  }

  async analyzeSubject(userId, subjectId) {
    const concepts = await this.conceptRepository.findBySubjectId(subjectId);
    const quizHistory = await this.quizResultRepository.getAllForSubject(userId, subjectId, 200);

    const wrongMap = new Map();

    for (const result of quizHistory) {
      const wrongAnswers = Array.isArray(result.wrongAnswers) ? result.wrongAnswers : [];
      for (const wrong of wrongAnswers) {
        if (!wrong?.conceptId) continue;
        const entry = wrongMap.get(wrong.conceptId) || { count: 0, lastAt: null };
        entry.count += 1;
        const createdAt = new Date(result.createdAt);
        if (!entry.lastAt || createdAt > entry.lastAt) {
          entry.lastAt = createdAt;
        }
        wrongMap.set(wrong.conceptId, entry);
      }
    }

    const now = Date.now();

    const scored = concepts.map((concept) => {
      const linkCount = (concept.relatedFrom?.length || 0) + (concept.relatedTo?.length || 0);
      const hasDefinition = !!concept.definition?.trim();
      const hasExample = !!concept.example?.trim();

      const wrongEntry = wrongMap.get(concept.id);
      const wrongCount = wrongEntry?.count || 0;
      const lastWrongAt = wrongEntry?.lastAt || null;
      const daysSinceLastWrong = lastWrongAt ? Math.floor((now - lastWrongAt.getTime()) / (1000 * 60 * 60 * 24)) : null;

      let score = 60;
      score += Math.min(linkCount * 2, 20);
      score += hasDefinition ? 10 : -15;
      score += hasExample ? 5 : -5;
      score -= Math.min(wrongCount * 10, 40);
      if (daysSinceLastWrong !== null) {
        score -= Math.min((daysSinceLastWrong / 7) * 5, 20);
      }

      score = Math.max(0, Math.min(100, Math.round(score)));

      const reasons = [];
      if (wrongCount >= 2) reasons.push('Sai nhiều lần');
      if (!hasExample) reasons.push('Thiếu ví dụ');
      if (linkCount <= 1) reasons.push('Ít liên kết');
      if (daysSinceLastWrong !== null && daysSinceLastWrong >= 30) reasons.push('Lâu chưa ôn');

      return {
        conceptId: concept.id,
        term: concept.term,
        score,
        wrongCount,
        linkCount,
        lastWrongAt,
        reasons
      };
    });

    const strong = scored.filter(c => c.score >= 75).sort((a, b) => b.score - a.score);
    const medium = scored.filter(c => c.score >= 55 && c.score < 75).sort((a, b) => b.score - a.score);
    const weak = scored.filter(c => c.score < 55).sort((a, b) => a.score - b.score);

    return {
      summary: {
        totalConcepts: scored.length,
        strong: strong.length,
        medium: medium.length,
        weak: weak.length
      },
      strong,
      medium,
      weak
    };
  }
}

module.exports = KnowledgeGapService;
