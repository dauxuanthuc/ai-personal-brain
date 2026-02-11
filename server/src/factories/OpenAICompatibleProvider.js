/**
 * OpenAI Compatible Provider
 * Implementation của IAIProvider cho OpenAI/Anthropic Compatible APIs
 * Hỗ trợ bất kỳ API nào tuân theo OpenAI format
 */

const https = require('https');
const IAIProvider = require('../interfaces/IAIProvider');

class OpenAICompatibleProvider extends IAIProvider {
  constructor(apiKey, baseURL = 'https://newapi.ccfilm.online') {
    super();
    if (!apiKey) {
      throw new Error('OpenAI Compatible API key is required');
    }
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async ask(prompt) {
    try {
      console.log('🤖 Đang gọi OpenAI Compatible Provider...');
      
      const payload = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      return new Promise((resolve, reject) => {
        const options = {
          hostname: new URL(this.baseURL).hostname,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (response.choices && response.choices[0]) {
                resolve(response.choices[0].message.content);
              } else {
                reject(new Error('Invalid response format'));
              }
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e.message}`));
            }
          });
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.write(payload);
        req.end();
      });
    } catch (error) {
      console.error('❌ OpenAI Compatible error:', error.message);
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
    return 'OpenAI Compatible';
  }

  getMetadata() {
    return {
      model: 'gpt-3.5-turbo',
      baseURL: this.baseURL,
      maxTokens: 1024,
      supportsStreaming: false,
      provider: 'OpenAI Compatible',
    };
  }
}

module.exports = OpenAICompatibleProvider;
