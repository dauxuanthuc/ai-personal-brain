/**
 * AI Provider Interface
 * LSP: Tất cả AI providers phải implement interface này
 * OCP: Dễ thêm provider mới mà không cần modify code cũ
 */

class IAIProvider {
  /**
   * Gọi AI với prompt
   * @param {string} prompt - Prompt để gửi tới AI
   * @returns {Promise<string>} - Phản hồi từ AI
   */
  async ask(prompt) {
    throw new Error('ask() must be implemented');
  }

  /**
   * Kiểm tra provider có hoạt động được không
   */
  async isHealthy() {
    throw new Error('isHealthy() must be implemented');
  }

  /**
   * Lấy tên provider
   */
  getName() {
    throw new Error('getName() must be implemented');
  }
}

module.exports = IAIProvider;
