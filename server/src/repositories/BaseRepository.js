/**
 * Base Repository - Abstract base class cho tất cả repositories
 * DIP: Controllers depend on repositories (interface), không depend trên DB directly
 */

class BaseRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Tìm một record theo ID
   */
  async findById(id) {
    throw new Error('findById must be implemented');
  }

  /**
   * Tìm tất cả records
   */
  async findAll(filters = {}) {
    throw new Error('findAll must be implemented');
  }

  /**
   * Tạo record mới
   */
  async create(data) {
    throw new Error('create must be implemented');
  }

  /**
   * Cập nhật record
   */
  async update(id, data) {
    throw new Error('update must be implemented');
  }

  /**
   * Xóa record
   */
  async delete(id) {
    throw new Error('delete must be implemented');
  }
}

module.exports = BaseRepository;
