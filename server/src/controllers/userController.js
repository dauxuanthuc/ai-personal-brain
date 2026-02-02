/**
 * User Controller - Handler cho user routes
 * SRP: Chỉ xử lý request/response
 * DIP: Nhận UserService qua constructor
 */

const UserController = (userService, uploadService) => {
  return {
    /**
     * GET /api/users/me
     */
    getMe: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const user = await userService.getCurrentUser(userId);
        res.json(user);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /api/users/me
     */
    updateProfile: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { name, email, avatarUrl } = req.body;
        const updated = await userService.updateProfile(userId, {
          name,
          email,
          avatarUrl,
        });
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },

    /**
     * PUT /api/users/me/password
     */
    updatePassword: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;
        const result = await userService.updatePassword(userId, {
          currentPassword,
          newPassword,
        });
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/users/me/avatar
     */
    updateAvatar: async (req, res, next) => {
      try {
        const userId = req.user.userId;
        if (!req.file) {
          return res.status(400).json({ error: 'Không có file avatar' });
        }

        const avatarUrl = await uploadService.uploadToCloudinary(req.file, {
          folder: 'ai-personal-brain/avatars',
          resourceType: 'image',
          transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
        });

        const updated = await userService.updateAvatar(userId, avatarUrl);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },
  };
};

module.exports = UserController;
