/**
 * Operators API Routes
 * Handles endpoints related to mobile network operators data
 * @module routes/operators
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/errorHandler');

// In-memory cache for operators data
let operatorsCache = null;
let operatorsCacheTime = 0;

/**
 * GET /api/operators
 * Retrieves the list of mobile network operators
 * Implements memory caching to reduce file I/O
 * 
 * @route GET /api/operators
 * @returns {Array} Array of operator objects
 */
router.get('/', asyncHandler(async (req, res) => {
  const now = Date.now();
  
  // Check if cache is valid
  if (operatorsCache && (now - operatorsCacheTime) < config.cache.operatorsCacheDuration) {
    logger.debug('Serving operators from cache');
    res.set('Cache-Control', `public, max-age=${Math.floor(config.cache.operatorsCacheDuration / 1000)}`);
    return res.json(operatorsCache);
  }

  // Load from file
  const dataPath = path.join(__dirname, '..', 'operators.json');
  
  if (!fs.existsSync(dataPath)) {
    logger.warn('operators.json not found');
    return res.json([]);
  }

  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Update cache
    operatorsCache = data;
    operatorsCacheTime = now;
    
    logger.info(`Loaded ${data.length} operators from file`);
    res.set('Cache-Control', `public, max-age=${Math.floor(config.cache.operatorsCacheDuration / 1000)}`);
    res.json(data);
  } catch (error) {
    logger.error('Error reading operators.json', error);
    throw new Error('Failed to load operators data');
  }
}));

module.exports = router;
