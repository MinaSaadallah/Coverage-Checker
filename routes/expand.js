/**
 * URL Expansion API Routes
 * Handles URL expansion and coordinate extraction from map links
 * @module routes/expand
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { extractCoords, extractCoordsFromHtml, validateCoords } = require('../utils/coordinates');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * POST /api/expand
 * Expands shortened URLs and extracts geographic coordinates
 * 
 * Process:
 * 1. Follow URL redirects to get final destination
 * 2. Try to extract coordinates from the expanded URL
 * 3. If unsuccessful, fetch page content and extract from HTML
 * 
 * @route POST /api/expand
 * @bodyparam {string} url - URL to expand and extract coordinates from
 * @returns {Object} Expanded URL and coordinates if found
 * @example
 * // POST /api/expand
 * // Body: { "url": "https://goo.gl/maps/..." }
 * // Returns: { "expandedUrl": "https://...", "coords": { "lat": 40.7128, "lng": -74.0060 } }
 */
router.post('/', asyncHandler(async (req, res) => {
  const { url } = req.body;
  
  // Validate input
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'URL must be a string' });
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  logger.debug(`Expanding URL: ${url}`);

  try {
    let targetUrl = url;

    // Step 1: Follow redirects to get the final URL
    try {
      const response = await axios.head(url, {
        maxRedirects: 10,
        validateStatus: null,
        timeout: config.api.requestTimeout
      });

      // Get the final URL after redirects
      if (response.request && response.request.res && response.request.res.responseUrl) {
        targetUrl = response.request.res.responseUrl;
        logger.debug(`URL expanded to: ${targetUrl}`);
      }
    } catch (e) {
      // If HEAD request fails, use original URL
      logger.warn('HEAD request failed, using original URL');
    }

    // Step 2: Try to extract coordinates from the URL
    const coords = extractCoords(targetUrl);
    
    if (coords && validateCoords(coords)) {
      logger.info(`Coordinates extracted from URL: ${coords.lat}, ${coords.lng}`);
      return res.json({
        expandedUrl: targetUrl,
        coords: coords
      });
    }

    // Step 3: Fetch page content and try to extract from HTML
    logger.debug('No coordinates in URL, fetching page content');
    
    const bodyRes = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: config.api.requestTimeout,
      maxContentLength: 1024 * 1024 // Limit to 1MB
    });

    const htmlCoords = extractCoordsFromHtml(bodyRes.data);
    
    if (htmlCoords && validateCoords(htmlCoords)) {
      logger.info(`Coordinates extracted from HTML: ${htmlCoords.lat}, ${htmlCoords.lng}`);
      return res.json({
        expandedUrl: targetUrl,
        coords: htmlCoords
      });
    }

    // No coordinates found
    logger.warn(`No coordinates found for URL: ${url}`);
    return res.json({
      expandedUrl: targetUrl,
      error: 'Could not find coordinates'
    });

  } catch (error) {
    logger.error('URL expansion error', error);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    
    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.status(500).json({ error: 'Failed to process URL' });
  }
}));

module.exports = router;
