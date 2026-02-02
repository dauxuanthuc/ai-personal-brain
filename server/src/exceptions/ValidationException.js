/**
 * Validation Exception
 * Cho các lỗi input validation
 */

const AppException = require('./AppException');

class ValidationException extends AppException {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field;
    this.name = 'ValidationException';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
    };
  }
}

module.exports = ValidationException;
