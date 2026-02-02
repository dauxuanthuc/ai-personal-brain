/**
 * Application Exception - Base class cho tất cả custom exceptions
 * Giúp quản lý lỗi một cách có cấu trúc
 */

class AppException extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppException';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

module.exports = AppException;
