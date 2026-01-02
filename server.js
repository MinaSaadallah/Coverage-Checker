/**
 * Coverage Checker Server
 * Express server providing API endpoints for mobile network coverage checking
 * 
 * Features:
 * - Operator data API with caching
 * - Reverse geocoding for country detection
 * - URL expansion and coordinate extraction
 * - Google Apps Script compatibility shim
 * - Health monitoring endpoints
 * 
 * @module server
 */

const express = require('express');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const operatorsRoutes = require('./routes/operators');
const geocodeRoutes = require('./routes/geocode');
const expandRoutes = require('./routes/expand');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = config.server.port;

// Middleware
app.use(express.json());

// Serve static files from root directory
// NOTE: In production, consider serving only specific files or using a separate public directory
// For local development and Google Apps Script compatibility, serving from root is acceptable
app.use(express.static(__dirname, { 
  maxAge: '1h',
  dotfiles: 'deny', // Don't serve hidden files
  index: false // Don't auto-serve index files for directories
}));

// ===================================
// GOOGLE APPS SCRIPT SHIM
// ===================================
/**
 * Google Apps Script compatibility shim
 * Provides client-side polyfill for google.script.run API
 * Redirects calls to local Express API endpoints
 * 
 * This shim is unused but preserved for reference and potential
 * future integration if needed for Google Apps Script deployment
 */
const GAS_SHIM = `
<script>
window.google = window.google || {};
window.google.script = window.google.script || {};
window.google.script.run = {
    withSuccessHandler: function(success) { this._success = success; return this; },
    withFailureHandler: function(failure) { this._failure = failure; return this; },
    getOperators: function() {
        fetch('/api/operators')
            .then(r => r.json())
            .then(data => { if(this._success) this._success(data); })
            .catch(err => { if(this._failure) this._failure(err); });
    },
    getTerritories: function() {
        fetch('/api/territories')
            .then(r => r.json())
            .then(data => { if(this._success) this._success(data); })
            .catch(() => { if(this._success) this._success({}); });
    },
    expandUrl: function(url) {
        fetch('/api/expand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        })
        .then(r => r.json())
        .then(data => { if(this._success) this._success(data); })
        .catch(err => { if(this._failure) this._failure(err); });
    }
};
</script>
`;

// ===================================
// ROUTES
// ===================================

/**
 * Serve index.html at root
 * @route GET /
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.use('/api/operators', operatorsRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/expand', expandRoutes);
app.use('/health', healthRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===================================
// SERVER STARTUP AND SHUTDOWN
// ===================================

/**
 * Start the Express server
 */
const server = app.listen(PORT, () => {
  logger.info(`Coverage Checker Server Running!`);
  logger.info(`Server listening on http://localhost:${PORT}`);
  logger.info(`Environment: ${config.server.env}`);
});

/**
 * Graceful shutdown handler
 * Closes server connections cleanly on process termination
 */
function gracefulShutdown() {
  logger.info('Received shutdown signal, closing server...');
  
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
