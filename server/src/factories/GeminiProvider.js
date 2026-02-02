/**
 * Gemini AI Provider
 * Implementation của IAIProvider cho Google Gemini
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const IAIProvider = require('./IAIProvider');

class GeminiProvider extends IAIProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async ask(prompt) {
    try {
      console.log('🤖 Đang gọi Gemini (2.5 Flash)...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('❌ Gemini error:', error.message);
      throw error;
    }
  }

  async isHealthy() {
    try {
      await this.ask('Xin chào');
      return true;
    } catch {
      return false;
    }
  }

  getName() {
    return 'Gemini';
  }
}

module.exports = GeminiProvider;
