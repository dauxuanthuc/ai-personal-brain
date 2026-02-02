/**
 * Auth Controller - Handler cho auth routes
 * SRP: Chỉ xử lý request/response, không chứa business logic
 * DIP: Nhận AuthService qua constructor
 */

const AuthController = (authService) => {
  return {
    /**
     * POST /api/auth/register
     */
    register: async (req, res, next) => {
      try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/auth/login
     */
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/auth/google
     */
    googleLogin: async (req, res, next) => {
      try {
        const { credential } = req.body;
        const result = await authService.loginWithGoogle(credential);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /api/auth/verify-email
     */
    verifyEmail: async (req, res, next) => {
      try {
        const { token } = req.query;
        const result = await authService.verifyEmail(token);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/auth/resend-verify
     */
    resendVerifyEmail: async (req, res, next) => {
      try {
        const { email } = req.body;
        const result = await authService.resendVerifyEmail(email);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};

module.exports = AuthController;