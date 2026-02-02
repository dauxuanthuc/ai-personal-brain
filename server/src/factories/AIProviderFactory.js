/**
 * AI Provider Factory
 * Factory Pattern: Tạo AI providers
 * Strategy Pattern: Có thể swap providers dễ dàng
 * OCP: Dễ thêm provider mới
 */

const GeminiProvider = require('./GeminiProvider');
const GroqProvider = require('./GroqProvider');

class AIProviderFactory {
  static PROVIDERS = {
    GEMINI: 'gemini',
    GROQ: 'groq',
  };

  /**
   * Tạo provider dựa trên type
   */
  static createProvider(type) {
    switch (type.toLowerCase()) {
      case this.PROVIDERS.GEMINI:
        return new GeminiProvider(process.env.GOOGLE_API_KEY);

      case this.PROVIDERS.GROQ:
        return new GroqProvider(process.env.GROQ_API_KEY);

      default:
        throw new Error(`Unknown AI provider: ${type}`);
    }
  }

  /**
   * Tạo primary provider với fallback
   * Strategy: Thử primary trước, nếu lỗi thì dùng fallback
   */
  static createWithFallback(primaryType, fallbackType) {
    const primary = this.createProvider(primaryType);
    const fallback = this.createProvider(fallbackType);

    return {
      primary,
      fallback,
      ask: async (prompt) => {
        try {
          console.log(
            `🤖 Trying primary provider: ${primary.getName()}`
          );
          return await primary.ask(prompt);
        } catch (error) {
          console.warn(
            `⚠️ Primary provider failed, trying fallback: ${fallback.getName()}`
          );
          return await fallback.ask(prompt);
        }
      },
    };
  }

  /**
   * Lấy list tất cả available providers
   */
  static getAvailableProviders() {
    return Object.values(this.PROVIDERS);
  }
}

module.exports = AIProviderFactory;
