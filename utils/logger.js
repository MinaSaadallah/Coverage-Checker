/**
 * Logger Utility
 * Provides structured logging with different levels for better debugging and monitoring
 * @module utils/logger
 */

const config = require('../config');

/**
 * Log levels with their corresponding priority
 * @enum {number}
 */
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * Logger class providing structured logging functionality
 */
class Logger {
  constructor() {
    this.level = config.server.env === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  /**
   * Formats a log message with timestamp and level
   * @private
   * @param {string} level - Log level name
   * @param {string} message - Log message
   * @returns {string} Formatted log message
   */
  _format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  /**
   * Logs an error message
   * @param {string} message - Error message
   * @param {Error} [error] - Optional error object
   */
  error(message, error) {
    if (this.level >= LogLevel.ERROR) {
      console.error(this._format('ERROR', message));
      if (error && error.stack) {
        console.error(error.stack);
      }
    }
  }

  /**
   * Logs a warning message
   * @param {string} message - Warning message
   */
  warn(message) {
    if (this.level >= LogLevel.WARN) {
      console.warn(this._format('WARN', message));
    }
  }

  /**
   * Logs an info message
   * @param {string} message - Info message
   */
  info(message) {
    if (this.level >= LogLevel.INFO) {
      console.log(this._format('INFO', message));
    }
  }

  /**
   * Logs a debug message
   * @param {string} message - Debug message
   */
  debug(message) {
    if (this.level >= LogLevel.DEBUG) {
      console.log(this._format('DEBUG', message));
    }
  }
}

// Export singleton instance
module.exports = new Logger();
