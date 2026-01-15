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
 * 3. Apple Maps ll= parameter (most accurate for Apple Maps)
 * 4. Apple Maps coordinate= parameter
 * 5. Query parameters (q=, ll=, sll=, center=)
 * 6. @ viewport coordinates (less accurate)
 * 7. Place URL with coordinates in path
 * 
 * @param {string} url - The URL to extract coordinates from
 * @returns {Object|null} Coordinate object with lat/lng properties, or null if not found
 * @example
 * // Returns { lat: 40.7128, lng: -74.0060 }
 * extractCoords('https://maps.google.com/?q=40.7128,-74.0060')
 */
function extractCoords(url) {
  if (!url) return null;
  
  // Decode URL to handle encoded characters
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    // URL already decoded or invalid encoding
  }
  
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

  // Priority 3: Apple Maps ll= parameter (most common for Apple Maps)
  // Format: ?ll=lat,lng or &ll=lat,lng
  match = url.match(/[?&]ll=(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  // Priority 4: Apple Maps coordinate= parameter
  // Apple Maps uses this parameter format in some links
  match = url.match(/[?&]coordinate=(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  // Priority 5: Query params (q=, sll=, center=)
  // Common query parameter formats used by various mapping services
  // Note: We check 'll=' separately above because it's more reliable for Apple Maps
  match = url.match(/[?&](?:q|sll|center)=(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  // Priority 6: @ viewport (less accurate)
  // This represents the viewport center, not necessarily a specific location
  // Format: @lat,lng,zoom or @lat,lng
  match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

  // Priority 7: Place URL with coordinates embedded
  // Some place URLs have coordinates in the path: /place/Name/@lat,lng
  match = url.match(/\/place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
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
  if (!html) return null;

  // Apple Maps meta tags - standard format
  // Apple Maps includes geographic metadata in HTML meta tags
  let latMatch = html.match(/property=["']place:location:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  let lngMatch = html.match(/property=["']place:location:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };

  // Apple Maps alternate format (content before property)
  latMatch = html.match(/content=["'](-?\d+\.?\d*)["']\s+property=["']place:location:latitude["']/);
  lngMatch = html.match(/content=["'](-?\d+\.?\d*)["']\s+property=["']place:location:longitude["']/);
  if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };

  // OpenGraph geo tags (used by some mapping services)
  latMatch = html.match(/property=["']og:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  lngMatch = html.match(/property=["']og:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };

  // JSON center property (lat, lng order)
  let centerMatch = html.match(/"center":\s*\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/);
  if (centerMatch) return { lat: parseFloat(centerMatch[1]), lng: parseFloat(centerMatch[2]) };

  // JSON lat/lng object format
  centerMatch = html.match(/"lat":\s*(-?\d+\.?\d*)\s*,\s*"lng":\s*(-?\d+\.?\d*)/);
  if (centerMatch) return { lat: parseFloat(centerMatch[1]), lng: parseFloat(centerMatch[2]) };

  // JSON latitude/longitude object format
  centerMatch = html.match(/"latitude":\s*(-?\d+\.?\d*)\s*,\s*"longitude":\s*(-?\d+\.?\d*)/);
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
