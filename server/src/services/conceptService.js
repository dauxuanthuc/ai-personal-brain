/**
 * Concept Service
 * SRP: Chỉ xử lý concept-related business logic
 */

class ConceptService {
  constructor(conceptRepository) {
    this.conceptRepository = conceptRepository;
  }

  /**
   * Xóa concept
   */
  async deleteConcept(conceptId) {
    const deleted = await this.conceptRepository.delete(conceptId);
    return { message: 'Xóa khái niệm thành công!', conceptId };
  }

  /**
   * Tìm concepts theo term trong một subject
   */
  async searchConceptsByTerm(term, subjectId) {
    return await this.conceptRepository.findByTermInSubject(term, subjectId);
  }

  /**
   * Tạo concept
   */
  async createConcept(data) {
    return await this.conceptRepository.create(data);
  }

  /**
   * Cập nhật concept
   */
  async updateConcept(conceptId, data) {
    return await this.conceptRepository.update(conceptId, data);
  }
}

module.exports = ConceptService;
