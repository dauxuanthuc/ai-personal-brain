/**
 * Unauthorized Exception
 * Khi user chưa được authenticated hoặc không có quyền
 */

const AppException = require('./AppException');

class UnauthorizedException extends AppException {
  constructor(message = 'Không có quyền truy cập') {
    super(message, 403, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
  }
}

module.exports = UnauthorizedException;
