/**
 * User Service
 * SRP: Chỉ xử lý user-related business logic
 */

const bcrypt = require('bcryptjs');
const ValidationException = require('../exceptions/ValidationException');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(userId) {
    return await this.userRepository.findById(userId);
  }

  /**
   * Cập nhật profile
   */
  async updateProfile(userId, { name, email, avatarUrl }) {
    if (!name && !email && !avatarUrl) {
      throw new ValidationException('Không có dữ liệu để cập nhật');
    }

    if (email) {
      const existing = await this.userRepository.findByEmail(email);
      if (existing && existing.id !== userId) {
        throw new ValidationException('Email đã được sử dụng', 'email');
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    return await this.userRepository.update(userId, updateData);
  }

  /**
   * Đổi mật khẩu
   */
  async updatePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw new ValidationException('Thiếu mật khẩu hiện tại hoặc mật khẩu mới');
    }

    const user = await this.userRepository.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new ValidationException('Mật khẩu hiện tại không đúng');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Đổi mật khẩu thành công' };
  }

  /**
   * Cập nhật avatar
   */
  async updateAvatar(userId, avatarUrl) {
    return await this.userRepository.update(userId, { avatarUrl });
  }
}

module.exports = UserService;
