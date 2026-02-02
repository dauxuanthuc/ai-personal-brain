/**
 * Question/Answer Service
 * SRP: Chỉ xử lý Q&A logic dựa trên Knowledge Graph
 */

const ValidationException = require('../exceptions/ValidationException');

class QAService {
  constructor(subjectRepository, aiService) {
    this.subjectRepository = subjectRepository;
    this.aiService = aiService;
  }

  /**
   * Trả lời câu hỏi dựa trên Knowledge Graph của subject
   */
  async answerQuestion(subjectId, question) {
    if (!question || question.trim().length === 0) {
      throw new ValidationException('Vui lòng nhập câu hỏi', 'question');
    }

    console.log(`💬 Câu hỏi: "${question}"`);

    // Lấy danh sách concepts của subject
    const conceptsInDB = await this.subjectRepository.findConceptsBySubject(subjectId);

    // Trích xuất concepts liên quan từ câu hỏi
    const extractedConcepts = await this.aiService.extractConceptsFromQuestion(
      question,
      conceptsInDB
    );

    if (extractedConcepts.length === 0) {
      console.log('⚠️ Không nhận diện được khái niệm nào');
      return {
        answer:
          'Xin lỗi, không tìm thấy khái niệm liên quan trong tài liệu của bạn. Hãy hỏi về các chủ đề mà bạn đã upload tài liệu.',
        concepts: [],
        foundConcepts: [],
        fromGeneralKnowledge: true,
      };
    }

    // Tìm chi tiết thông tin của các concepts
    const concepts = await this._findDetailedConcepts(question, extractedConcepts, subjectId);

    // Sinh câu trả lời
    const { answer, contextSource } = await this._generateAnswer(question, concepts);

    return {
      answer,
      concepts: extractedConcepts,
      foundConcepts: contextSource,
      fromGeneralKnowledge: concepts.length === 0,
    };
  }

  /**
   * Private: Tìm chi tiết concepts
   */
  async _findDetailedConcepts(question, extractedConcepts, subjectId) {
    // Placeholder: implement detailed search
    // This would query concepts from the database with full details
    return [];
  }

  /**
   * Private: Sinh câu trả lời từ AI
   */
  async _generateAnswer(question, concepts) {
    let prompt;
    let contextSource = [];

    if (concepts.length === 0) {
      prompt = `
        Câu hỏi: "${question}"
        
        Hãy trả lời dựa vào kiến thức chung một cách ngắn gọn, chính xác.
        
        Lưu ý:
        - Trả lời bằng tiếng Việt
        - Bắt đầu bằng: "⚠️ Thông tin này không có trong tài liệu của bạn, nhưng theo kiến thức chung:"
        - Thêm ví dụ minh họa nếu có
      `;
    } else {
      contextSource = concepts.map((c) => ({
        term: c.term,
        definition: c.definition,
        source: c.document?.title || 'Unknown',
      }));

      const context = concepts
        .map(
          (c, i) =>
            `${i + 1}. "${c.term}": ${c.definition} (từ: ${c.document?.title || 'Unknown'})`
        )
        .join('\n');

      prompt = `
        Bạn là trợ lý học tập. Tổng hợp câu trả lời từ kiến thức sau:
        
        KIẾN THỨC TỪ TÀI LIỆU:
        ${context}
        
        CÂU HỎI: "${question}"
        
        Hướng dẫn:
        - ƯU TIÊN sử dụng thông tin từ tài liệu
        - Nếu cần, BỔ SUNG kiến thức chung (so sánh, ví dụ)
        - Trả lời tiếng Việt, ngắn gọn, dễ hiểu
        - Trích dẫn rõ nguồn tài liệu
      `;
    }

    const answer = await this.aiService.ask(prompt);
    console.log('✅ Hoàn thành');

    return { answer, contextSource };
  }
}

module.exports = QAService;
