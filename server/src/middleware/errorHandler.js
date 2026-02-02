/**
 * Global Error Handler Middleware
 * Xử lý tất cả exceptions một cách thống nhất
 */

const AppException = require('../exceptions/AppException');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // AppException - custom errors
  if (err instanceof AppException) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Prisma errors
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Resource không tìm thấy',
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404,
    });
  }

  if (err.code === 'P2002') {
    return res.status(400).json({
      error: `${err.meta?.target?.[0] || 'Field'} đã tồn tại`,
      code: 'DUPLICATE_ENTRY',
      statusCode: 400,
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = errorHandler;
