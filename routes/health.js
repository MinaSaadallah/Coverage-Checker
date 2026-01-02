/**
 * Health Check Routes
 * Provides endpoints for monitoring application health
 * @module routes/health
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * GET /health
 * Basic health check endpoint
 * Returns 200 OK if the server is running
 * 
 * @route GET /health
 * @returns {Object} Health status
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /health/detailed
 * Detailed health check with dependency validation
 * Checks if required files exist and are accessible
 * 
 * @route GET /health/detailed
 * @returns {Object} Detailed health status
 */
router.get('/detailed', (req, res) => {
  const operatorsPath = path.join(__dirname, '..', 'operators.json');
  const operatorsExists = fs.existsSync(operatorsPath);
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      operatorsData: operatorsExists ? 'ok' : 'missing'
    }
  };

  // Set status to degraded if operators data is missing
  if (!operatorsExists) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;
