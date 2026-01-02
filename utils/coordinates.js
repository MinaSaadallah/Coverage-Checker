/**
 * Coordinate Extraction Utilities
 * Provides functions to extract geographic coordinates from various URL formats
 * @module utils/coordinates
 */

/**
 * Extracts coordinates from a URL string using multiple detection strategies
 * 
 * Strategy Priority:
 * 1. Google Maps place marker format (!8m2!3d...!4d...)
 * 2. Google Maps standard format (!3d...!4d...)
 * 3. Apple Maps coordinate parameter
 * 4. Query parameters (q=, ll=, sll=)
 * 5. @ viewport coordinates (less accurate)
 * 
 * @param {string} url - The URL to extract coordinates from
 * @returns {Object|null} Coordinate object with lat/lng properties, or null if not found
 * @example
 * // Returns { lat: 40.7128, lng: -74.0060 }
 * extractCoords('https://maps.google.com/?q=40.7128,-74.0060')
 */
function extractCoords(url) {
  if (!url) return null;
  let match;

  // Priority 1: !8m2!3d...!4d... (place marker) - get the LAST match
  // This format is used when a specific place is selected in Google Maps
  const r8m2 = /!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
  let last = null;
  while ((match = r8m2.exec(url)) !== null) last = match;
  if (last) return { lat: parseFloat(last[1]), lng: parseFloat(last[2]) };

  // Priority 2: Plain !3d...!4d... - get the LAST match
  // Standard Google Maps coordinate format
  const r3d4d = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
  last = null;
  while ((match = r3d4d.exec(url)) !== null) last = match;
  if (last) return { lat: parseFloat(last[1]), lng: parseFloat(last[2]) };

  // Priority 3: Apple Maps coordinate=
  // Apple Maps uses a different parameter format
  match = url.match(/[?&]coordinate=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  // Priority 4: Query params (q=, ll=, sll=)
  // Common query parameter formats used by various mapping services
  match = url.match(/[?&](?:q|ll|sll)=(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  // Priority 5: @ viewport (less accurate)
  // This represents the viewport center, not necessarily a specific location
  match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  return null;
}

/**
 * Extracts coordinates from HTML content
 * Used as a fallback when URL extraction fails
 * 
 * @param {string} html - HTML content to parse
 * @returns {Object|null} Coordinate object with lat/lng properties, or null if not found
 * @example
 * // Returns { lat: 40.7128, lng: -74.0060 }
 * extractCoordsFromHtml('<meta property="place:location:latitude" content="40.7128">')
 */
function extractCoordsFromHtml(html) {
  // Apple Maps meta tags
  // Apple Maps includes geographic metadata in HTML meta tags
  const latMatch = html.match(/property=["']place:location:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  const lngMatch = html.match(/property=["']place:location:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };

  // JSON center property
  // Some mapping services embed coordinates in JSON format
  const centerMatch = html.match(/"center":\s*\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/);
  if (centerMatch) return { lat: parseFloat(centerMatch[1]), lng: parseFloat(centerMatch[2]) };

  return null;
}

/**
 * Validates coordinate values
 * Ensures latitude and longitude are within valid ranges
 * 
 * @param {Object} coords - Coordinate object to validate
 * @param {number} coords.lat - Latitude value
 * @param {number} coords.lng - Longitude value
 * @returns {boolean} True if coordinates are valid
 */
function validateCoords(coords) {
  if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
    return false;
  }
  return coords.lat >= -90 && coords.lat <= 90 && coords.lng >= -180 && coords.lng <= 180;
}

module.exports = {
  extractCoords,
  extractCoordsFromHtml,
  validateCoords
};
