/**
 * Configuration Module
 * Centralizes all application configuration with environment variable support
 * @module config
 */

require('dotenv').config();

/**
 * Application configuration object
 * @type {Object}
 */
const config = {
  /**
   * Server configuration
   * @property {number} port - Server port number
   * @property {string} env - Environment (development/production)
   */
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  /**
   * Cache configuration
   * @property {number} duration - General cache duration in milliseconds
   * @property {number} operatorsCacheDuration - Operators data cache duration
   */
  cache: {
    duration: parseInt(process.env.CACHE_DURATION, 10) || 5 * 60 * 1000, // 5 minutes
    operatorsCacheDuration: parseInt(process.env.OPERATORS_CACHE_DURATION, 10) || 5 * 60 * 1000
  },

  /**
   * External API configuration
   * @property {string} gsmaFeedUrl - GSMA feed CSV URL
   * @property {string} nperfApiUrl - nPerf API base URL
   * @property {number} requestTimeout - API request timeout in milliseconds
   * @property {number} apiDelay - Delay between API requests in milliseconds
   */
  api: {
    gsmaFeedUrl: process.env.GSMA_FEED_URL || 'https://www.gsma.com/wp-content/uploads/feed.csv',
    nperfApiUrl: process.env.NPERF_API_URL || 'https://www.nperf.com/en/map/get-isp-list-by-country',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 5000,
    apiDelay: parseInt(process.env.API_DELAY, 10) || 50
  },

  /**
   * CORS configuration
   * @property {string} origin - Allowed CORS origin
   */
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

module.exports = config;
