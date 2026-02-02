/**
 * Resource Not Found Exception
 * Khi không tìm thấy resource (user, document, etc)
 */

const AppException = require('./AppException');

class ResourceNotFoundException extends AppException {
  constructor(resourceName, identifier) {
    super(`${resourceName} không tìm thấy (${identifier})`, 404, 'RESOURCE_NOT_FOUND');
    this.resourceName = resourceName;
    this.identifier = identifier;
    this.name = 'ResourceNotFoundException';
  }
}

module.exports = ResourceNotFoundException;
