/**
 * Error Handling Middleware
 * Provides centralized error handling for Express application
 * @module middleware/errorHandler
 */

const logger = require('../utils/logger');

/**
 * Error handler middleware
 * Catches and processes errors from route handlers
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(`Error processing ${req.method} ${req.path}`, err);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Not found handler middleware
 * Handles requests to undefined routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found'
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 * 
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
