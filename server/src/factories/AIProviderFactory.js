/**
 * AI Provider Factory
 * Factory Pattern: Tạo AI providers
 * Strategy Pattern: Có thể swap providers dễ dàng
 * OCP: Dễ thêm provider mới
 */

const GeminiProvider = require('./GeminiProvider');
const GroqProvider = require('./GroqProvider');
const OpenAICompatibleProvider = require('./OpenAICompatibleProvider');

class AIProviderFactory {
  static PROVIDERS = {
    GEMINI: 'gemini',
    GROQ: 'groq',
    OPENAI_COMPATIBLE: 'openai-compatible',
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

      case this.PROVIDERS.OPENAI_COMPATIBLE:
        return new OpenAICompatibleProvider(
          process.env.OPENAI_COMPATIBLE_API_KEY,
          process.env.OPENAI_COMPATIBLE_BASE_URL || 'https://newapi.ccfilm.online'
        );

      default:
        throw new Error(`Unknown AI provider: ${type}`);
    }
  }

  /**
   * Tạo provider chain với multiple fallbacks
   * Priority: Primary → Secondary → Tertiary
   */
  static createWithFallback(primaryType, secondaryType, tertiaryType) {
    const primary = this.createProvider(primaryType);
    const secondary = this.createProvider(secondaryType);
    const tertiary = tertiaryType ? this.createProvider(tertiaryType) : null;

    return {
      primary,
      secondary,
      tertiary,
      ask: async (prompt) => {
        try {
          console.log(
            `🤖 Trying primary provider: ${primary.getName()}`
          );
          return await primary.ask(prompt);
        } catch (error) {
          console.warn(
            `⚠️ Primary provider failed (${primary.getName()}), trying secondary: ${secondary.getName()}`
          );
          try {
            return await secondary.ask(prompt);
          } catch (error2) {
            if (tertiary) {
              console.warn(
                `⚠️ Secondary provider failed (${secondary.getName()}), trying tertiary: ${tertiary.getName()}`
              );
              return await tertiary.ask(prompt);
            }
            throw error2;
          }
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
