/**
 * Upload Service
 * SRP: Chỉ xử lý file uploads
 */

const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UploadService {
  /**
   * Upload file to Cloudinary
   */
  async uploadToCloudinary(file, options = {}) {
    if (!process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET ||
        !process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Thiếu cấu hình Cloudinary');
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'ai-personal-brain',
          resource_type: options.resourceType || 'auto',
          transformation: options.transformation || [],
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFromCloudinary(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}

module.exports = UploadService;
