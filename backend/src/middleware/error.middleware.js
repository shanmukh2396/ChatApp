const { sendError } = require('../utils/apiResponse');

/**
 * Global error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 * Express identifies it as an error handler because it has 4 params (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, 'Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 400, 'File size exceeds the allowed limit');
  }

  // Default — use statusCode attached to error if available
  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal server error';
  return sendError(res, statusCode, message);
};

/**
 * 404 handler — register BEFORE errorHandler, AFTER all routes.
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
