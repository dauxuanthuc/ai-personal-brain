/**
 * Groq AI Provider
 * Implementation của IAIProvider cho Groq Llama
 */

const Groq = require('groq-sdk');
const IAIProvider = require('./IAIProvider');

class GroqProvider extends IAIProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.client = new Groq({ apiKey });
  }

  async ask(prompt) {
    try {
      console.log('⚡ Đang gọi Groq (Llama3)...');
      const chatCompletion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });
      return chatCompletion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('❌ Groq error:', error.message);
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
    return 'Groq';
  }
}

module.exports = GroqProvider;
