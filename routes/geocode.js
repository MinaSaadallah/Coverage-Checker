/**
 * Geocoding API Routes
 * Handles reverse geocoding to determine country from coordinates
 * @module routes/geocode
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Special administrative regions that have their own operator data
 * These territories are identified by ISO3166-2 codes
 * @constant {Array<string>}
 */
const SPECIAL_REGIONS = ['HK', 'MO', 'TW', 'PR', 'VI', 'GU', 'AS', 'MP'];

/**
 * GET /api/geocode
 * Performs reverse geocoding using OpenStreetMap Nominatim API
 * Determines country code from latitude/longitude coordinates
 * Handles special administrative regions (Hong Kong, Macau, etc.)
 * 
 * @route GET /api/geocode
 * @queryparam {number} lat - Latitude coordinate
 * @queryparam {number} lng - Longitude coordinate
 * @returns {Object} Location information including country code
 * @example
 * // GET /api/geocode?lat=22.3193&lng=114.1694
 * // Returns: { countryCode: "HK", country: "Hong Kong", ... }
 */
router.get('/', asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  
  // Validate input parameters
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng parameters are required' });
  }

  // Validate coordinate ranges
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'lat and lng must be valid numbers' });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Invalid coordinate range' });
  }

  try {
    logger.debug(`Geocoding coordinates: ${lat}, ${lng}`);
    
    // Call Nominatim API for reverse geocoding
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'CoverageChecker/1.0'
      },
      timeout: config.api.requestTimeout
    });

    const data = response.data;
    
    if (!data || !data.address) {
      logger.warn(`No address data found for coordinates: ${lat}, ${lng}`);
      return res.json({ error: 'Could not determine location' });
    }

    // Extract country code
    let countryCode = (data.address.country_code || '').toUpperCase();

    // Check for special administrative regions
    // ISO3166-2-lvl3 contains codes like "CN-MO" for Macau, "CN-HK" for Hong Kong
    const iso3166 = data.address['ISO3166-2-lvl3'] || data.address['ISO3166-2-lvl4'] || '';
    
    if (iso3166) {
      const parts = iso3166.split('-');
      if (parts.length >= 2) {
        const regionCode = parts[1].toUpperCase();
        // Override country code for known special regions
        if (SPECIAL_REGIONS.includes(regionCode)) {
          countryCode = regionCode;
          logger.debug(`Special region detected: ${regionCode}`);
        }
      }
    }

    const country = data.address.country || '';
    const state = data.address.state || data.address.territory || '';

    // Cache the response for 24 hours
    res.set('Cache-Control', 'public, max-age=86400');
    
    res.json({
      countryCode: countryCode,
      country: country,
      state: state,
      displayName: data.display_name
    });
  } catch (error) {
    logger.error('Geocoding error', error);
    
    // Handle API timeout
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Geocoding service timeout' });
    }
    
    res.status(500).json({ error: 'Geocoding service unavailable' });
  }
}));

module.exports = router;
