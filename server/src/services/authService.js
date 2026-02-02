/**
 * Auth Service
 * SRP: Chỉ xử lý authentication business logic
 * DIP: Nhận dependencies qua constructor (Dependency Injection)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const ValidationException = require('../exceptions/ValidationException');

class AuthService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.jwtSecret = process.env.JWT_SECRET || 'default_secret_change_this_in_production';
    this.appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
    this.googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  /**
   * Đăng ký người dùng mới
   */
  async register(email, password, name) {
    if (!email || !password) {
      throw new ValidationException('Email và password là bắt buộc');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationException('Email này đã được sử dụng', 'email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 giờ

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      authProvider: 'local',
      name,
      emailVerified: false,
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: tokenExpires,
    });

    const verifyUrl = `${this.appBaseUrl}/verify-email?token=${rawToken}`;
    await this.emailService.sendVerificationEmail({
      to: email,
      name,
      verifyUrl,
    });

    return {
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user,
    };
  }

  /**
   * Đăng nhập
   */
  async login(email, password) {
    if (!email || !password) {
      throw new ValidationException('Email và password là bắt buộc');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationException('Email hoặc mật khẩu không đúng');
    }

    if (!user.password || user.authProvider === 'google') {
      throw new ValidationException('Tài khoản này đăng nhập bằng Google');
    }

    if (!user.emailVerified) {
      throw new ValidationException('Vui lòng xác thực email trước khi đăng nhập');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ValidationException('Email hoặc mật khẩu không đúng');
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || null,
      },
    };
  }

  /**
   * Đăng nhập/Đăng ký bằng Google
   */
  async loginWithGoogle(idToken) {
    if (!idToken) {
      throw new ValidationException('Thiếu Google credential', 'credential');
    }

    if (!this.googleClientId) {
      throw new ValidationException('GOOGLE_CLIENT_ID chưa được cấu hình');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new ValidationException('Không lấy được thông tin Google');
    }

    const {
      sub: googleId,
      email,
      name,
      picture,
    } = payload;

    let user = await this.userRepository.findByEmail(email);

    if (user) {
      const updateData = {};
      if (!user.googleId) updateData.googleId = googleId;
      if (!user.avatarUrl && picture) updateData.avatarUrl = picture;
      if (!user.name && name) updateData.name = name;
      if (!user.emailVerified) updateData.emailVerified = true;
      if (user.authProvider !== 'google') updateData.authProvider = 'google';

      if (Object.keys(updateData).length > 0) {
        await this.userRepository.update(user.id, updateData);
        user = { ...user, ...updateData };
      }
    } else {
      user = await this.userRepository.create({
        email,
        password: null,
        googleId,
        authProvider: 'google',
        name,
        avatarUrl: picture || null,
        emailVerified: true,
      });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      message: 'Đăng nhập bằng Google thành công!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || null,
      },
    };
  }

  /**
   * Xác thực email
   */
  async verifyEmail(token) {
    if (!token) {
      throw new ValidationException('Thiếu token', 'token');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.userRepository.findByVerifyToken(tokenHash);

    if (!user) {
      return { message: 'Đã xác thực trước đó hoặc token không hợp lệ.' };
    }

    await this.userRepository.updateVerificationStatus(user.id, true);

    return { message: 'Xác thực email thành công! Bạn có thể đăng nhập.' };
  }

  /**
   * Gửi lại email xác thực
   */
  async resendVerifyEmail(email) {
    if (!email) {
      throw new ValidationException('Thiếu email', 'email');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ValidationException('Không tìm thấy người dùng', 'email');
    }

    if (user.emailVerified) {
      throw new ValidationException('Email đã được xác thực', 'email');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60);

    await this.userRepository.update(user.id, {
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: tokenExpires,
    });

    const verifyUrl = `${this.appBaseUrl}/verify-email?token=${rawToken}`;
    await this.emailService.sendVerificationEmail({
      to: email,
      name: user.name,
      verifyUrl,
    });

    return { message: 'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.' };
  }
}

module.exports = AuthService;
