/**
 * AI Service - Business logic layer
 * SRP: Chỉ xử lý AI-related logic
 * DIP: Depend on AIProviderFactory, không depend trực tiếp trên Gemini/Groq
 */

const AIProviderFactory = require('../factories/AIProviderFactory');
const { HfInference } = require('@huggingface/inference');

class AIService {
  constructor(primaryProvider = 'gemini', fallbackProvider = 'groq') {
    this.aiProvider = AIProviderFactory.createWithFallback(
      primaryProvider,
      fallbackProvider
    );
    this.hf = new HfInference(process.env.HF_ACCESS_TOKEN);
  }

  /**
   * Gọi AI chính (với fallback)
   */
  async ask(prompt) {
    try {
      return await this.aiProvider.ask(prompt);
    } catch (error) {
      console.error('❌ AI service error:', error.message);
      throw error;
    }
  }

  /**
   * Trích xuất thông tin bằng Hugging Face
   */
  async extractWithHF(text) {
    try {
      // Placeholder: tính năng bảo trì
      return 'Tính năng tóm tắt đang bảo trì để tối ưu tiếng Việt.';
    } catch (error) {
      console.error('❌ HF extraction error:', error);
      return null;
    }
  }

  /**
   * Chuẩn hóa text: lowercase, bỏ dấu tiếng Việt
   */
  normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
      .replace(/[?.,!;:]/g, ''); // Bỏ dấu câu
  }

  /**
   * Trích xuất khái niệm từ câu hỏi dựa trên Knowledge Graph
   */
  async extractConceptsFromQuestion(question, conceptsInDB) {
    try {
      console.log('🔍 Phân tích câu hỏi bằng Knowledge Graph + NLP...');

      const normalized = this.normalizeText(question);
      const words = normalized
        .split(/\s+/)
        .filter((word) => word.length > 2);

      // Stopwords tiếng Việt
      const stopwords = new Set([
        'la',
        'cua',
        'trong',
        'nao',
        'the',
        'cai',
        'no',
        'duoc',
        'lam',
        'co',
        'khong',
        'va',
        'hay',
        'hoac',
        'voi',
        'tu',
        'den',
        'khac',
        'giua',
        'so',
        'sanh',
        'tuong',
        'ung',
        'hon',
        'kem',
      ]);

      const keywords = words.filter((word) => !stopwords.has(word));

      // Đối chiếu với Knowledge Graph
      const matches = conceptsInDB.filter((concept) => {
        const conceptNormalized = this.normalizeText(concept.term);
        return keywords.some(
          (k) =>
            conceptNormalized.includes(k) ||
            k.includes(conceptNormalized.split(' ')[0])
        );
      });

      const matchedTerms = matches.map((m) => m.term);
      console.log('✅ Khái niệm khớp:', matchedTerms.slice(0, 5));

      return matchedTerms.length > 0 ? matchedTerms : keywords.slice(0, 3);
    } catch (error) {
      console.error('⚠️ NLP error:', error);
      return [];
    }
  }
}

module.exports = AIService;