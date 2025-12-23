/**
 * Google Apps Script Backend for Coverage Checker
 * Uses Google Sheets to store operator data.
 */

// ╔════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION - PASTE YOUR SPREADSHEET ID BELOW          ║
// ╚════════════════════════════════════════════════════════════╝

// Option 1: If this script is ATTACHED to a Google Sheet, leave this empty - it auto-detects!
// Option 2: If running as a STANDALONE script, paste your spreadsheet ID here:
//           (Find it in the Google Sheet URL: https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit)

var SPREADSHEET_ID = '';  // ← Paste your spreadsheet ID here (only if standalone)

// ============================================================
// WEB APP HANDLER
// ============================================================

/**
 * Serves the web app HTML.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Coverage Checker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// SPREADSHEET ACCESS
// ============================================================

/**
 * Gets the spreadsheet. Auto-detects if attached, otherwise uses SPREADSHEET_ID.
 */
function getSpreadsheet() {
  // Try container-bound first (if script is attached to a sheet)
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  
  // Use the configured spreadsheet ID
  if (SPREADSHEET_ID && SPREADSHEET_ID.length > 10) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      Logger.log('Error opening spreadsheet: ' + e.toString());
    }
  }
  
  Logger.log('No spreadsheet found. Either attach this script to a sheet or set SPREADSHEET_ID at the top of Code.gs');
  return null;
}

// ============================================================
// OPERATOR DATA FUNCTIONS
// ============================================================

/**
 * Fetches operator data - uses smart caching for speed.
 * Priority: 1) Memory cache (6hrs) → 2) Script Properties → 3) Sheet → 4) Live fetch
 * @returns {Array} List of operator objects.
 */
function getOperators() {
  try {
    // 1. Try memory cache first (fastest - persists ~6 hours)
    var cache = CacheService.getScriptCache();
    var cached = cache.get('operators_data');
    if (cached) {
      Logger.log('Loaded from cache');
      return JSON.parse(cached);
    }
    
    // 2. Try Script Properties (persistent storage)
    var props = PropertiesService.getScriptProperties();
    var stored = props.getProperty('operators_json');
    if (stored) {
      var operators = JSON.parse(stored);
      // Re-cache for fast access
      cacheOperators(operators);
      Logger.log('Loaded from properties: ' + operators.length + ' operators');
      return operators;
    }
    
    // 3. Try Sheet (legacy/backup)
    var sheetData = loadFromSheet();
    if (sheetData.length > 0) {
      cacheOperators(sheetData);
      saveToProperties(sheetData);
      Logger.log('Loaded from sheet: ' + sheetData.length + ' operators');
      return sheetData;
    }
    
    // 4. Fetch live (first time setup)
    Logger.log('No cached data, fetching live...');
    var liveData = fetchAllOperatorsLive();
    if (liveData.length > 0) {
      cacheOperators(liveData);
      saveToProperties(liveData);
      return liveData;
    }
    
    Logger.log('No data available');
    return [];
    
  } catch (e) {
    Logger.log('Error in getOperators: ' + e.toString());
    return [];
  }
}

/**
 * Loads operators from Sheet (backup method).
 */
function loadFromSheet() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return [];
    
    var sheet = ss.getSheetByName('Operators');
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    
    var headers = data[0];
    var operators = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      operators.push(obj);
    }
    
    return operators;
  } catch (e) {
    Logger.log('Error loading from sheet: ' + e.toString());
    return [];
  }
}

/**
 * Caches operators in memory (6 hour expiry).
 */
function cacheOperators(operators) {
  try {
    var cache = CacheService.getScriptCache();
    var json = JSON.stringify(operators);
    
    // CacheService has 100KB limit per key, so chunk if needed
    if (json.length < 100000) {
      cache.put('operators_data', json, 21600); // 6 hours
    } else {
      // Store in chunks
      var chunks = chunkString(json, 90000);
      cache.put('operators_chunks', chunks.length.toString(), 21600);
      for (var i = 0; i < chunks.length; i++) {
        cache.put('operators_chunk_' + i, chunks[i], 21600);
      }
    }
  } catch (e) {
    Logger.log('Cache error: ' + e.toString());
  }
}

/**
 * Saves operators to Script Properties (persistent, survives cache expiry).
 */
function saveToProperties(operators) {
  try {
    var props = PropertiesService.getScriptProperties();
    var json = JSON.stringify(operators);
    
    // Properties have 500KB limit
    if (json.length < 500000) {
      props.setProperty('operators_json', json);
    }
  } catch (e) {
    Logger.log('Properties error: ' + e.toString());
  }
}

/**
 * Chunks a string into smaller pieces.
 */
function chunkString(str, size) {
  var chunks = [];
  for (var i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size));
  }
  return chunks;
}

/**
 * Fetches operators live from nPerf API (used for initial setup).
 * Only fetches top-priority countries for speed.
 */
function fetchAllOperatorsLive() {
  // Fetch only major countries for fast initial load
  var priorityCountries = [
    "EG", "US", "GB", "DE", "FR", "ES", "IT", "CA", "AU", "JP", "KR", "CN", "IN", "BR", "MX",
    "SA", "AE", "TR", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI", "PL", "PT", "GR", "RU"
  ];
  
  var allOperators = [];
  
  for (var i = 0; i < priorityCountries.length; i++) {
    try {
      var ops = fetchNperfCountry(priorityCountries[i]);
      allOperators = allOperators.concat(ops);
    } catch (e) {
      // Continue on error
    }
    Utilities.sleep(200); // Faster rate for priority countries
  }
  
  // Match with GSMA
  try {
    var gsmaResponse = UrlFetchApp.fetch(GSMA_FEED_URL, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (gsmaResponse.getResponseCode() === 200) {
      var gsmaOperators = parseGSMACSV(gsmaResponse.getContentText());
      for (var j = 0; j < allOperators.length; j++) {
        var op = allOperators[j];
        var match = findGSMAMatch(op.operatorName, op.countryCode, gsmaOperators);
        op.gsmaId = match ? match.gsmaId : '';
      }
    }
  } catch (e) {
    // GSMA matching optional
  }
  
  return allOperators;
}

/**
 * Clears all cached data - forces fresh fetch on next load.
 */
function clearCache() {
  var cache = CacheService.getScriptCache();
  cache.remove('operators_data');
  cache.remove('operators_chunks');
  for (var i = 0; i < 10; i++) {
    cache.remove('operators_chunk_' + i);
  }
  
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty('operators_json');
  
  Logger.log('Cache cleared. Next load will fetch fresh data.');
  try {
    SpreadsheetApp.getUi().alert('Cache Cleared', 
      'All cached data has been cleared.\n\nThe next time someone opens the app, it will fetch fresh data.',
      SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}
}

/**
 * Manually refresh data now (for use from Apps Script editor).
 */
function refreshNow() {
  clearCache();
  var operators = getOperators();
  Logger.log('Refreshed! Loaded ' + operators.length + ' operators');
  try {
    SpreadsheetApp.getUi().alert('Data Refreshed', 
      'Loaded ' + operators.length + ' operators.\n\nData is now cached for 6 hours.',
      SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}
}

/**
 * Fetches territory exceptions from the "Territories" sheet.
 * Expected columns: code, name, parent, bboxMinLat, bboxMinLng, bboxMaxLat, bboxMaxLng, aliases
 * @returns {Object} Territory exceptions keyed by country code.
 */
function getTerritories() {
  try {
    var ss = getSpreadsheet();
    if (!ss) {
      Logger.log('No spreadsheet found for territories');
      return {};
    }
    
    var sheet = ss.getSheetByName('Territories');
    if (!sheet) {
      Logger.log('Territories sheet not found. Using defaults.');
      return getDefaultTerritories();
    }
    
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      Logger.log('No data in Territories sheet');
      return getDefaultTerritories();
    }
    
    var headers = data[0];
    var territories = {};
    
    // Find column indices
    var codeIdx = headers.indexOf('code');
    var nameIdx = headers.indexOf('name');
    var parentIdx = headers.indexOf('parent');
    var minLatIdx = headers.indexOf('bboxMinLat');
    var minLngIdx = headers.indexOf('bboxMinLng');
    var maxLatIdx = headers.indexOf('bboxMaxLat');
    var maxLngIdx = headers.indexOf('bboxMaxLng');
    var aliasesIdx = headers.indexOf('aliases');
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var code = row[codeIdx];
      if (!code) continue;
      
      territories[code] = {
        name: row[nameIdx] || '',
        parent: row[parentIdx] || '',
        bbox: [
          parseFloat(row[minLatIdx]) || 0,
          parseFloat(row[minLngIdx]) || 0,
          parseFloat(row[maxLatIdx]) || 0,
          parseFloat(row[maxLngIdx]) || 0
        ],
        aliases: row[aliasesIdx] ? String(row[aliasesIdx]).split(',').map(function(a) { return a.trim().toLowerCase(); }) : []
      };
    }
    
    Logger.log('Loaded ' + Object.keys(territories).length + ' territories');
    return territories;
  } catch (e) {
    Logger.log('Error in getTerritories: ' + e.toString());
    return getDefaultTerritories();
  }
}

/**
 * Returns default territory exceptions (fallback if sheet not found).
 */
function getDefaultTerritories() {
  return {
    PR: { name: "Puerto Rico", parent: "US", bbox: [17.883, -67.942, 18.515, -65.22] },
    VI: { name: "U.S. Virgin Islands", parent: "US", bbox: [17.636, -65.091, 18.579, -64.33] },
    HK: { name: "Hong Kong", parent: "CN", bbox: [22.1, 113.8, 22.6, 114.5] },
    MO: { name: "Macau", parent: "CN", bbox: [22.1, 113.5, 22.25, 113.6] },
    AW: { name: "Aruba", parent: "NL", bbox: [12.373, -70.132, 12.64, -69.8] },
    CW: { name: "Curaçao", parent: "NL", bbox: [12.0, -69.2, 12.3, -68.6] },
    GP: { name: "Guadeloupe", parent: "FR", bbox: [15.8, -61.9, 16.7, -61.0] },
    MQ: { name: "Martinique", parent: "FR", bbox: [14.39, -61.3, 15.02, -60.7] },
    AS: { name: "American Samoa", parent: "US", bbox: [-14.5, -171, -14, -169] },
    GU: { name: "Guam", parent: "US", bbox: [13.2, 144.6, 13.7, 145] },
    BM: { name: "Bermuda", parent: "GB", bbox: [32.2, -64.9, 32.4, -64.6] },
    KY: { name: "Cayman Islands", parent: "GB", bbox: [19.2, -81.5, 19.8, -79.7] }
  };
}

/**
 * Reverse geocodes coordinates to get country/territory code using Nominatim.
 * Detects special territories (Macau, Hong Kong, etc.) via ISO3166-2-lvl3.
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @returns {Object} { countryCode, country, state }
 */
function reverseGeocode(lat, lng) {
  try {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&addressdetails=1';
    var response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'CoverageChecker/1.0',
        'Accept-Language': 'en'
      }
    });
    
    if (response.getResponseCode() !== 200) {
      return { error: 'Geocoding failed' };
    }
    
    var data = JSON.parse(response.getContentText());
    if (!data || !data.address) {
      return { error: 'No address data' };
    }
    
    var countryCode = (data.address.country_code || '').toUpperCase();
    
    // Check for special administrative regions (Macau, Hong Kong, etc.)
    // ISO3166-2-lvl3 contains codes like "CN-MO" for Macau, "CN-HK" for Hong Kong
    var iso3166 = data.address['ISO3166-2-lvl3'] || data.address['ISO3166-2-lvl4'] || '';
    if (iso3166) {
      var parts = iso3166.split('-');
      if (parts.length >= 2) {
        var regionCode = parts[1].toUpperCase();
        // Known special regions with their own operator data
        var specialRegions = ['HK', 'MO', 'TW', 'PR', 'VI', 'GU', 'AS', 'MP', 'BM', 'KY', 'VG', 'AI', 'TC'];
        if (specialRegions.indexOf(regionCode) !== -1) {
          countryCode = regionCode;
        }
      }
    }
    
    return {
      countryCode: countryCode,
      country: data.address.country || '',
      state: data.address.state || data.address.territory || ''
    };
  } catch (e) {
    Logger.log('Geocoding error: ' + e.toString());
    return { error: e.toString() };
  }
}

// ============================================================
// URL EXPANSION & COORDINATE EXTRACTION
// ============================================================

/**
 * Expands a shortened URL and extracts coordinates.
 * Supports Google Maps, Apple Maps, Waze, etc.
 * @param {string} shortUrl The URL to expand.
 * @returns {Object} { expandedUrl, coords: { lat, lng } } or { error }
 */
function expandUrl(shortUrl) {
  try {
    Logger.log('Expanding URL: ' + shortUrl);
    
    // Fix common URL issues
    var fixedUrl = shortUrl.trim();
    
    // Handle super-short Apple Maps links (maps.apple/p/...)
    // These might need to be corrected to maps.apple.com
    if (fixedUrl.indexOf('maps.apple/') !== -1 && fixedUrl.indexOf('maps.apple.com') === -1) {
      fixedUrl = fixedUrl.replace('maps.apple/', 'maps.apple.com/');
      Logger.log('Fixed Apple Maps URL: ' + fixedUrl);
    }
    
    // First, try to extract coords from the original URL
    var coords = extractCoords(fixedUrl);
    if (coords) {
      Logger.log('Found coords in original URL: ' + coords.lat + ', ' + coords.lng);
      return { expandedUrl: fixedUrl, coords: coords };
    }
    
    var currentUrl = fixedUrl;
    var maxRedirects = 10;
    var finalUrl = fixedUrl;
    var allContent = '';
    var foundCoords = null;
    
    // Follow redirects manually
    for (var i = 0; i < maxRedirects; i++) {
      try {
        // Use iPhone User-Agent for Apple Maps
        var userAgent = currentUrl.indexOf('apple') !== -1 
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
          : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
        
        var response = UrlFetchApp.fetch(currentUrl, {
          followRedirects: false,
          muteHttpExceptions: true,
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
        
        var responseCode = response.getResponseCode();
        var headers = response.getHeaders();
        var location = headers['Location'] || headers['location'];
        
        Logger.log('Redirect ' + i + ': code=' + responseCode + ', location=' + (location || 'none'));
        
        if (responseCode >= 300 && responseCode < 400 && location) {
          // Handle relative URLs
          var fullLocation = location;
          if (location.indexOf('http') !== 0) {
            var urlParts = currentUrl.match(/^(https?:\/\/[^\/]+)/);
            if (urlParts) {
              fullLocation = urlParts[1] + (location.indexOf('/') === 0 ? '' : '/') + location;
            }
          }
          
          // *** KEY FIX: Try to extract coords from EACH redirect URL ***
          coords = extractCoords(fullLocation);
          if (coords) {
            Logger.log('Found coords in redirect URL: ' + coords.lat + ', ' + coords.lng);
            foundCoords = coords;
            // Don't return yet - capture the best URL, but we have coords!
          }
          
          currentUrl = fullLocation;
          finalUrl = fullLocation;
        } else {
          allContent = response.getContentText();
          break;
        }
      } catch (fetchError) {
        Logger.log('Fetch error at redirect ' + i + ': ' + fetchError.toString());
        break;
      }
    }
    
    // If we found coords during redirects, return them
    if (foundCoords) {
      return { expandedUrl: finalUrl, coords: foundCoords };
    }
    
    Logger.log('Final URL: ' + finalUrl);
    
    // Try extracting from final URL
    coords = extractCoords(finalUrl);
    if (coords) {
      Logger.log('Found coords in final URL: ' + coords.lat + ', ' + coords.lng);
      return { expandedUrl: finalUrl, coords: coords };
    }
    
    // Try extracting from page content
    if (allContent) {
      // Try various patterns in content
      var match = allContent.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        return { expandedUrl: finalUrl, coords: { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } };
      }
      
      match = allContent.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (match) {
        return { expandedUrl: finalUrl, coords: { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } };
      }
      
      // Apple Maps specific patterns
      coords = extractCoordsFromHtml(allContent);
      if (coords) {
        Logger.log('Found coords in HTML: ' + coords.lat + ', ' + coords.lng);
        return { expandedUrl: finalUrl, coords: coords };
      }
    }
    
    // Special handling for Apple Maps shortened URLs
    if (finalUrl.indexOf('maps.apple') !== -1 || shortUrl.indexOf('maps.apple') !== -1) {
      Logger.log('Trying Apple Maps specific extraction...');
      try {
        var appleResponse = UrlFetchApp.fetch(finalUrl, {
          muteHttpExceptions: true,
          followRedirects: true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
          }
        });
        var appleHtml = appleResponse.getContentText();
        var appleUrl = appleResponse.getHeaders()['X-Final-Url'] || finalUrl;
        
        // Try URL patterns first
        coords = extractCoords(appleUrl);
        if (coords) return { expandedUrl: appleUrl, coords: coords };
        
        // Try HTML content
        coords = extractCoordsFromHtml(appleHtml);
        if (coords) return { expandedUrl: appleUrl, coords: coords };
        
        // Try finding ll= or q= in the content
        var llMatch = appleHtml.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (llMatch) {
          return { expandedUrl: appleUrl, coords: { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) } };
        }
        
        // Look for coordinate patterns in JSON
        var jsonMatch = appleHtml.match(/"center":\s*\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/);
        if (jsonMatch) {
          return { expandedUrl: appleUrl, coords: { lat: parseFloat(jsonMatch[1]), lng: parseFloat(jsonMatch[2]) } };
        }
        
        jsonMatch = appleHtml.match(/"lat(?:itude)?":\s*(-?\d+\.?\d*)\s*,\s*"(?:lng|lon|longitude)":\s*(-?\d+\.?\d*)/);
        if (jsonMatch) {
          return { expandedUrl: appleUrl, coords: { lat: parseFloat(jsonMatch[1]), lng: parseFloat(jsonMatch[2]) } };
        }
        
      } catch (appleError) {
        Logger.log('Apple Maps fetch error: ' + appleError.toString());
      }
    }
    
    return { error: 'Could not find coordinates', expandedUrl: finalUrl };
  } catch (e) {
    Logger.log('Error in expandUrl: ' + e.toString());
    return { error: e.toString() };
  }
}

/**
 * Extracts coordinates from a URL string.
 * Priority: 1) !8m2!3d!4d (place) 2) !3d!4d 3) coordinate= 4) @ viewport 5) query params
 */
function extractCoords(url) {
  if (!url) return null;
  
  try { url = decodeURIComponent(url); } catch (e) {}
  
  var match, r, last;
  
  // Priority 1: !8m2!3d...!4d... (Google place marker) - get LAST match
  r = /!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
  last = null;
  while ((match = r.exec(url)) !== null) last = match;
  if (last) return validateCoords(last[1], last[2]);
  
  // Priority 2: Plain !3d...!4d... - get LAST match
  r = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
  last = null;
  while ((match = r.exec(url)) !== null) last = match;
  if (last) return validateCoords(last[1], last[2]);
  
  // Priority 3: Apple Maps coordinate=
  match = url.match(/[?&]coordinate=(-?\d+\.?\d*)(?:%2C|,)(-?\d+\.?\d*)/);
  if (match) return validateCoords(match[1], match[2]);
  
  // Priority 4: Viewport @lat,lng (less accurate - map center, not place)
  match = url.match(/@(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (match) return validateCoords(match[1], match[2]);
  
  // Priority 5: Query params (ll, sll, q)
  match = url.match(/[?&](?:q|ll|sll)=(-?\d+\.?\d*)(?:%2C|,)(-?\d+\.?\d*)/);
  if (match) return validateCoords(match[1], match[2]);
  
  return null;
}

/**
 * Validates coordinates are within proper ranges.
 */
function validateCoords(latStr, lngStr) {
  var lat = parseFloat(latStr);
  var lng = parseFloat(lngStr);
  if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    return { lat: lat, lng: lng };
  }
  return null;
}

/**
 * Extracts coordinates from HTML content (Apple Maps pages).
 */
function extractCoordsFromHtml(html) {
  if (!html) return null;
  
  // Apple Maps place:location meta tags
  var latMatch = html.match(/property=["']place:location:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  var lngMatch = html.match(/property=["']place:location:longitude["']\s+content=["'](-?\d+\.?\d*)/);
  
  if (latMatch && lngMatch) {
    Logger.log('Found place:location meta tags');
    return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
  }
  
  // OG meta tags (multiple formats)
  latMatch = html.match(/property=["']og:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  lngMatch = html.match(/property=["']og:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  
  if (latMatch && lngMatch) {
    Logger.log('Found og:latitude/longitude meta tags');
    return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
  }
  
  // content="lat" property="og:latitude" format
  latMatch = html.match(/content=["'](-?\d+\.?\d*)["']\s+property=["']og:latitude["']/);
  lngMatch = html.match(/content=["'](-?\d+\.?\d*)["']\s+property=["']og:longitude["']/);
  
  if (latMatch && lngMatch) {
    Logger.log('Found content-first og meta tags');
    return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
  }
  
  // Meta refresh redirect - extract URL and parse it
  var metaRefresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"'>\s]+)/i);
  if (metaRefresh) {
    Logger.log('Found meta refresh URL: ' + metaRefresh[1]);
    var refreshUrl = metaRefresh[1];
    // Check for coords in the refresh URL
    var coords = extractCoordsFromRefreshUrl(refreshUrl);
    if (coords) return coords;
  }
  
  // JavaScript window.location redirect
  var jsRedirect = html.match(/window\.location\s*(?:\.href)?\s*=\s*["']([^"']+)["']/i);
  if (jsRedirect) {
    Logger.log('Found JS redirect: ' + jsRedirect[1]);
    var coords = extractCoordsFromRefreshUrl(jsRedirect[1]);
    if (coords) return coords;
  }
  
  // Look for ?ll= or &ll= in HTML (common in Apple Maps)
  var llMatch = html.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    Logger.log('Found ll= parameter in HTML');
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  
  // Look for sll= (search location)
  llMatch = html.match(/[?&]sll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    Logger.log('Found sll= parameter in HTML');
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  
  // JSON lat/lng in various formats
  latMatch = html.match(/["']lat(?:itude)?["']\s*:\s*(-?\d+\.?\d*)/);
  lngMatch = html.match(/["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+\.?\d*)/);
  
  if (latMatch && lngMatch) {
    Logger.log('Found JSON lat/lng');
    return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) };
  }
  
  // Coordinate array [lat, lng]
  var coordArray = html.match(/\[\s*(-?\d+\.\d{4,})\s*,\s*(-?\d+\.\d{4,})\s*\]/);
  if (coordArray) {
    var lat = parseFloat(coordArray[1]);
    var lng = parseFloat(coordArray[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      Logger.log('Found coordinate array');
      return { lat: lat, lng: lng };
    }
  }
  
  return null;
}

/**
 * Extract coords from a URL found in meta refresh or JS redirect
 */
function extractCoordsFromRefreshUrl(url) {
  if (!url) return null;
  
  // ll= parameter
  var llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  
  // sll= parameter
  llMatch = url.match(/[?&]sll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  
  // q= parameter with coordinates
  llMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  
  // @ format
  llMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }
  
  return null;
}

/**
 * TEST: Run this to debug an Apple Maps URL
 * Shows full redirect chain and content
 */
function testAppleMapsUrl() {
  // PASTE YOUR APPLE MAPS LINK HERE:
  var testUrl = 'https://maps.apple/p/rViX9SKfSqWhfz';
  
  Logger.log('=== TESTING APPLE MAPS URL ===');
  Logger.log('Original URL: ' + testUrl);
  
  // Fix the URL if needed
  var fixedUrl = testUrl.trim();
  if (fixedUrl.indexOf('maps.apple/') !== -1 && fixedUrl.indexOf('maps.apple.com') === -1) {
    fixedUrl = fixedUrl.replace('maps.apple/', 'maps.apple.com/');
    Logger.log('Fixed URL: ' + fixedUrl);
  }
  
  var currentUrl = fixedUrl;
  
  for (var i = 0; i < 5; i++) {
    Logger.log('\n--- Redirect ' + i + ' ---');
    Logger.log('Fetching: ' + currentUrl);
    
    try {
      var response = UrlFetchApp.fetch(currentUrl, {
        followRedirects: false,
        muteHttpExceptions: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      var code = response.getResponseCode();
      var headers = response.getHeaders();
      var location = headers['Location'] || headers['location'];
      var content = response.getContentText().substring(0, 2000); // First 2000 chars
      
      Logger.log('Response Code: ' + code);
      Logger.log('Location Header: ' + (location || 'none'));
      Logger.log('Content Preview: ' + content.substring(0, 500));
      
      // Check for coords in location
      if (location) {
        var coords = extractCoords(location);
        if (coords) {
          Logger.log('!!! FOUND COORDS IN LOCATION: ' + coords.lat + ', ' + coords.lng);
        }
        
        // Build full URL from relative
        if (location.indexOf('http') !== 0) {
          var parts = currentUrl.match(/^(https?:\/\/[^\/]+)/);
          if (parts) location = parts[1] + (location.charAt(0) === '/' ? '' : '/') + location;
        }
        currentUrl = location;
      } else {
        Logger.log('No redirect, checking content for coords...');
        var coords = extractCoordsFromHtml(content);
        if (coords) {
          Logger.log('!!! FOUND COORDS IN CONTENT: ' + coords.lat + ', ' + coords.lng);
        }
        break;
      }
    } catch (e) {
      Logger.log('Error: ' + e.toString());
      break;
    }
  }
  
  Logger.log('\n=== NOW TESTING expandUrl FUNCTION ===');
  var result = expandUrl(testUrl);
  Logger.log('Final Result: ' + JSON.stringify(result, null, 2));
  
  return result;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Test function to verify spreadsheet access.
 * Run this from the Apps Script editor to debug.
 */
function testSpreadsheetAccess() {
  var ss = getSpreadsheet();
  if (!ss) {
    Logger.log('ERROR: No spreadsheet found');
    return 'ERROR: No spreadsheet found. Check SPREADSHEET_ID at top of Code.gs';
  }
  
  var sheets = ss.getSheets().map(function(s) { return s.getName(); });
  Logger.log('Found sheets: ' + sheets.join(', '));
  
  var operatorsSheet = ss.getSheetByName('Operators');
  if (!operatorsSheet) {
    return 'ERROR: No "Operators" sheet found. Available: ' + sheets.join(', ');
  }
  
  var data = operatorsSheet.getDataRange().getValues();
  var headers = data[0];
  var firstRow = data.length > 1 ? data[1] : [];
  
  return 'SUCCESS!\n' +
    '• Spreadsheet: ' + ss.getName() + '\n' +
    '• Sheets: ' + sheets.join(', ') + '\n' +
    '• Operators rows: ' + data.length + '\n' +
    '• Headers: ' + JSON.stringify(headers) + '\n' +
    '• First row: ' + JSON.stringify(firstRow);
}

/**
 * Test the getOperators function directly.
 * Run this to see what data is being returned.
 */
function testGetOperators() {
  var operators = getOperators();
  
  if (!operators || operators.length === 0) {
    Logger.log('ERROR: getOperators returned empty array');
    return 'ERROR: No operators returned';
  }
  
  // Check first operator structure
  var first = operators[0];
  var result = 'SUCCESS!\n' +
    '• Total operators: ' + operators.length + '\n' +
    '• First operator: ' + JSON.stringify(first) + '\n' +
    '• Has countryCode: ' + (first.countryCode ? 'YES (' + first.countryCode + ')' : 'NO');
  
  // Count unique countries
  var countries = {};
  operators.forEach(function(op) {
    var code = op.countryCode || op.CountryCode || op.country_code || op.country || '';
    if (code) countries[code] = true;
  });
  result += '\n• Unique countries: ' + Object.keys(countries).length;
  
  Logger.log(result);
  return result;
}

/**
 * Full diagnostic - run this to check everything.
 */
function runFullDiagnostic() {
  var results = [];
  
  results.push('=== SPREADSHEET ACCESS ===');
  results.push(testSpreadsheetAccess());
  
  results.push('\n=== OPERATORS DATA ===');
  results.push(testGetOperators());
  
  results.push('\n=== TERRITORIES DATA ===');
  var territories = getTerritories();
  results.push('Territories loaded: ' + Object.keys(territories).length);
  
  var fullResult = results.join('\n');
  Logger.log(fullResult);
  
  // Show in UI
  SpreadsheetApp.getUi().alert('Diagnostic Results', fullResult, SpreadsheetApp.getUi().ButtonSet.OK);
  
  return fullResult;
}

// ============================================================
// GSMA AUTO-UPDATE FUNCTIONS
// ============================================================

/**
 * GSMA Feed URL - This is the CSV that GSMA Coverage map loads
 * Found via browser Network tab: https://www.gsma.com/coverage/
 */
var GSMA_FEED_URL = 'https://www.gsma.com/wp-content/uploads/feed.csv';

/**
 * Fetches the latest GSMA operator data and updates the spreadsheet.
 * Run this manually or set up a trigger to run it periodically.
 */
function updateGSMAData() {
  Logger.log('Starting GSMA data update...');
  
  try {
    // Fetch GSMA CSV
    var response = UrlFetchApp.fetch(GSMA_FEED_URL, {
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    var responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      Logger.log('Failed to fetch GSMA data. Response code: ' + responseCode);
      return { success: false, error: 'HTTP ' + responseCode };
    }
    
    var csvContent = response.getContentText();
    var gsmaOperators = parseGSMACSV(csvContent);
    Logger.log('Fetched ' + gsmaOperators.length + ' GSMA operators');
    
    // Get current operators from sheet
    var ss = getSpreadsheet();
    if (!ss) {
      return { success: false, error: 'No spreadsheet found' };
    }
    
    var sheet = ss.getSheetByName('Operators');
    if (!sheet) {
      return { success: false, error: 'Operators sheet not found' };
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    // Find column indices
    var countryCodeIdx = headers.indexOf('countryCode');
    var operatorNameIdx = headers.indexOf('operatorName');
    var gsmaIdIdx = headers.indexOf('gsmaId');
    
    if (gsmaIdIdx === -1) {
      // Add gsmaId column if it doesn't exist
      gsmaIdIdx = headers.length;
      sheet.getRange(1, gsmaIdIdx + 1).setValue('gsmaId');
    }
    
    // Update each operator with matching GSMA ID
    var updatedCount = 0;
    for (var i = 1; i < data.length; i++) {
      var countryCode = data[i][countryCodeIdx];
      var operatorName = data[i][operatorNameIdx];
      
      var gsmaMatch = findGSMAMatch(operatorName, countryCode, gsmaOperators);
      if (gsmaMatch) {
        sheet.getRange(i + 1, gsmaIdIdx + 1).setValue(gsmaMatch.gsmaId);
        updatedCount++;
      }
    }
    
    Logger.log('Updated ' + updatedCount + ' operators with GSMA IDs');
    return { success: true, updated: updatedCount, total: data.length - 1 };
    
  } catch (e) {
    Logger.log('Error updating GSMA data: ' + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * Parses GSMA CSV content into an array of operator objects.
 */
function parseGSMACSV(csvContent) {
  var lines = csvContent.trim().split('\n');
  var operators = [];
  
  for (var i = 1; i < lines.length; i++) {
    var row = parseCSVLine(lines[i]);
    if (row.length >= 3) {
      operators.push({
        gsmaId: parseInt(row[0]) || 0,
        name: row[1] || '',
        country: row[2] || ''
      });
    }
  }
  
  return operators;
}

/**
 * Parses a CSV line handling quoted fields with commas.
 */
function parseCSVLine(line) {
  var result = [];
  var current = '';
  var inQuotes = false;
  
  for (var i = 0; i < line.length; i++) {
    var char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Country code to name mapping for GSMA matching
 */
var COUNTRY_CODE_TO_NAME = {
  AD: 'Andorra', AE: 'United Arab Emirates', AF: 'Afghanistan', AL: 'Albania', AM: 'Armenia',
  AO: 'Angola', AR: 'Argentina', AT: 'Austria', AU: 'Australia', AW: 'Aruba', AZ: 'Azerbaijan',
  BA: 'Bosnia', BD: 'Bangladesh', BE: 'Belgium', BF: 'Burkina Faso', BG: 'Bulgaria', BH: 'Bahrain',
  BI: 'Burundi', BJ: 'Benin', BO: 'Bolivia', BQ: 'Bonaire', BR: 'Brazil', BT: 'Bhutan', BW: 'Botswana',
  BY: 'Belarus', BZ: 'Belize', CA: 'Canada', CD: 'Congo', CH: 'Switzerland', CI: "Côte d'Ivoire",
  CL: 'Chile', CM: 'Cameroon', CN: 'China', CO: 'Colombia', CR: 'Costa Rica', CW: 'Curaçao',
  CY: 'Cyprus', CZ: 'Czechia', DE: 'Germany', DK: 'Denmark', DO: 'Dominican', DZ: 'Algeria',
  EC: 'Ecuador', EE: 'Estonia', EG: 'Egypt', ES: 'Spain', ET: 'Ethiopia', FI: 'Finland', FJ: 'Fiji',
  FR: 'France', GA: 'Gabon', GB: 'United Kingdom', GE: 'Georgia', GH: 'Ghana', GR: 'Greece',
  GT: 'Guatemala', HK: 'Hong Kong', HN: 'Honduras', HR: 'Croatia', HU: 'Hungary', ID: 'Indonesia',
  IE: 'Ireland', IL: 'Israel', IN: 'India', IQ: 'Iraq', IS: 'Iceland', IT: 'Italy', JM: 'Jamaica',
  JO: 'Jordan', JP: 'Japan', KE: 'Kenya', KH: 'Cambodia', KR: 'Korea', KW: 'Kuwait', KZ: 'Kazakhstan',
  LA: 'Lao', LB: 'Lebanon', LK: 'Sri Lanka', LT: 'Lithuania', LU: 'Luxembourg', LV: 'Latvia',
  LY: 'Libya', MA: 'Morocco', MD: 'Moldova', ME: 'Montenegro', MG: 'Madagascar', MK: 'Macedonia',
  ML: 'Mali', MM: 'Myanmar', MN: 'Mongolia', MO: 'Macao', MX: 'Mexico', MY: 'Malaysia',
  MZ: 'Mozambique', NA: 'Namibia', NG: 'Nigeria', NI: 'Nicaragua', NL: 'Netherlands', NO: 'Norway',
  NP: 'Nepal', NZ: 'New Zealand', OM: 'Oman', PA: 'Panama', PE: 'Peru', PH: 'Philippines',
  PK: 'Pakistan', PL: 'Poland', PT: 'Portugal', PY: 'Paraguay', QA: 'Qatar', RO: 'Romania',
  RS: 'Serbia', RU: 'Russia', RW: 'Rwanda', SA: 'Saudi Arabia', SE: 'Sweden', SG: 'Singapore',
  SI: 'Slovenia', SK: 'Slovakia', SN: 'Senegal', TH: 'Thailand', TN: 'Tunisia', TR: 'Turkey',
  TW: 'Taiwan', TZ: 'Tanzania', UA: 'Ukraine', UG: 'Uganda', US: 'United States', UY: 'Uruguay',
  UZ: 'Uzbekistan', VE: 'Venezuela', VN: 'Vietnam', ZA: 'South Africa', ZM: 'Zambia', ZW: 'Zimbabwe'
};

/**
 * Finds the best GSMA match for an operator.
 */
function findGSMAMatch(operatorName, countryCode, gsmaOperators) {
  var countryName = COUNTRY_CODE_TO_NAME[countryCode] || '';
  var opNorm = normalizeName(operatorName);
  
  // Filter by country
  var countryMatches = gsmaOperators.filter(function(g) {
    var gCountry = g.country.toLowerCase();
    return gCountry.indexOf(countryName.toLowerCase()) !== -1 || 
           countryName.toLowerCase().indexOf(gCountry.split(',')[0].toLowerCase()) !== -1;
  });
  
  // Find best name match
  for (var i = 0; i < countryMatches.length; i++) {
    var gsma = countryMatches[i];
    var gsmaNorm = normalizeName(gsma.name);
    
    // Exact match
    if (opNorm === gsmaNorm) {
      return gsma;
    }
    
    // Substring match
    if (opNorm.indexOf(gsmaNorm) !== -1 || gsmaNorm.indexOf(opNorm) !== -1) {
      return gsma;
    }
    
    // First 4 chars match
    if (opNorm.length >= 4 && gsmaNorm.length >= 4 && opNorm.substring(0, 4) === gsmaNorm.substring(0, 4)) {
      return gsma;
    }
  }
  
  return null;
}

/**
 * Normalizes operator name for matching.
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/mobile$/i, '')
    .replace(/móvil$/i, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Sets up a weekly trigger to auto-update GSMA data.
 * Run this once to enable automatic updates.
 */
function setupAutoUpdateTrigger() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'updateGSMAData') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create weekly trigger (every Sunday at 3am)
  ScriptApp.newTrigger('updateGSMAData')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(3)
    .create();
  
  Logger.log('Auto-update trigger created. GSMA data will update every Sunday at 3am.');
  SpreadsheetApp.getUi().alert('Auto-Update Enabled', 'GSMA data will automatically update every Sunday at 3am.', SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Removes the auto-update trigger.
 */
function removeAutoUpdateTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'updateGSMAData') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log('Removed ' + removed + ' auto-update trigger(s).');
  SpreadsheetApp.getUi().alert('Auto-Update Disabled', 'Removed ' + removed + ' trigger(s).', SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Manual test - fetches GSMA data and shows results.
 */
function testGSMAFetch() {
  var result = updateGSMAData();
  var message = result.success 
    ? 'Success! Updated ' + result.updated + '/' + result.total + ' operators with GSMA IDs.'
    : 'Error: ' + result.error;
  
  Logger.log(message);
  SpreadsheetApp.getUi().alert('GSMA Update Result', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ============================================================
// NPERF AUTO-UPDATE FUNCTIONS
// ============================================================

/**
 * nPerf API endpoint for fetching operators by country
 */
var NPERF_API_URL = 'https://www.nperf.com/en/map/get-isp-list-by-country';

/**
 * All ISO 3166-1 alpha-2 country codes
 */
var ALL_COUNTRY_CODES = [
  "AD", "AE", "AF", "AL", "AM", "AO", "AR", "AT", "AU", "AW", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BN", "BO", "BQ", "BR", "BS", "BT", "BW", "BY", "BZ",
  "CA", "CD", "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CY", "CZ",
  "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FO", "FR",
  "GA", "GB", "GD", "GE", "GF", "GH", "GL", "GM", "GN", "GP", "GQ", "GR", "GT", "GW", "GY",
  "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT",
  "JM", "JO", "JP", "KE", "KG", "KH", "KM", "KN", "KR", "KW", "KZ",
  "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY",
  "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
  "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NZ",
  "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ",
  "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO", "TR", "TT", "TW", "TZ",
  "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VI", "VN", "VU", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"
];

/**
 * Fetches ALL operator data from nPerf API and rebuilds the sheet.
 * WARNING: This takes a long time (5-10 minutes) due to rate limiting.
 * Run this monthly or when you need completely fresh data.
 */
function updateNperfData() {
  Logger.log('🚀 Starting Powerful Automated Update...');
  var allOperators = [];
  var matchedGsmaIds = new Set();
  var gsmaOperators = [];

  // 1. Fetch GSMA data to discover ALL countries
  try {
    var gsmaResponse = UrlFetchApp.fetch(GSMA_FEED_URL, {muteHttpExceptions: true, headers: {'User-Agent': 'Mozilla/5.0'}});
    if (gsmaResponse.getResponseCode() === 200) {
      gsmaOperators = parseGSMACSV(gsmaResponse.getContentText());
    }
  } catch (e) { Logger.log('GSMA Error: ' + e); }

  // 2. Build the list of countries automatically from GSMA data
  var dynamicCountryList = [...new Set(gsmaOperators.map(op => op.countryCode))];
  
  // 3. Process nPerf
  for (var i = 0; i < dynamicCountryList.length; i++) {
    var code = dynamicCountryList[i];
    try {
      var nperfOps = fetchNperfCountry(code);
      if (nperfOps && nperfOps.length > 0) {
        nperfOps.forEach(function(op) {
          var match = findGSMAMatch(op.operatorName, op.countryCode, gsmaOperators);
          if (match) {
            op.gsmaId = match.gsmaId;
            matchedGsmaIds.add(match.gsmaId.toString());
          }
          allOperators.push(op);
        });
      }
    } catch (e) { }
    if (i % 10 === 0) Utilities.sleep(200);
  }

  // 4. ADD GSMA-ONLY (VANUATU, ETC.)
  gsmaOperators.forEach(function(gOp) {
    if (!matchedGsmaIds.has(gOp.gsmaId.toString())) {
      allOperators.push({
        countryCode: gOp.countryCode,
        operatorId: 'GSMA_' + gOp.gsmaId,
        operatorName: gOp.operatorName,
        link: 'https://www.gsma.com/coverage/',
        gsmaId: gOp.gsmaId
      });
    }
  });

  // 5. SAVE DATA
  saveOperatorsToSheet(allOperators);
  
  // 6. IMPORTANT: Update the internal ScriptProperties so the Web App knows the new list
  PropertiesService.getScriptProperties().setProperty('VALID_COUNTRIES', JSON.stringify(dynamicCountryList));
  
  return { success: true, total: allOperators.length };
}

/**
 * Fetches operators for a single country from nPerf API.
 */
function fetchNperfCountry(countryCode) {
  var response = UrlFetchApp.fetch(NPERF_API_URL, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({ countryCode: countryCode }),
    muteHttpExceptions: true,
    headers: {
      'accept': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    }
  });
  
  if (response.getResponseCode() !== 200) {
    return [];
  }
  
  var json = JSON.parse(response.getContentText());
  var ispData = null;
  
  if (json.data && json.data.isp) {
    ispData = json.data.isp;
  } else if (json.result) {
    ispData = json.result;
  } else {
    ispData = json;
  }
  
  // Convert to array if object
  var list = [];
  if (Array.isArray(ispData)) {
    list = ispData;
  } else if (typeof ispData === 'object' && ispData !== null) {
    for (var key in ispData) {
      list.push(ispData[key]);
    }
  }
  
  var operators = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var ispId = item.IspId || item.id_isp;
    var ispName = item.IspName || item.name;
    
    if (ispId && ispName) {
      var safeName = ispName.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      operators.push({
        countryCode: countryCode,
        operatorId: ispId,
        operatorName: ispName,
        link: 'https://www.nperf.com/en/map/' + countryCode + '/-/' + ispId + '.' + safeName + '/signal',
        gsmaId: ''
      });
    }
  }
  
  return operators;
}

/**
 * Saves operators array to the Operators sheet.
 */
function saveOperatorsToSheet(operators) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Operators');
  
  if (!sheet) {
    sheet = ss.insertSheet('Operators');
  } else {
    sheet.clear();
  }
  
  // Headers
  sheet.appendRow(['countryCode', 'operatorId', 'operatorName', 'link', 'gsmaId']);
  
  var headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#22c55e');
  headerRange.setFontColor('#ffffff');
  
  // Data in batches
  var batchSize = 100;
  for (var i = 0; i < operators.length; i += batchSize) {
    var batch = operators.slice(i, i + batchSize);
    var data = batch.map(function(op) {
      return [op.countryCode, op.operatorId, op.operatorName, op.link, op.gsmaId];
    });
    sheet.getRange(i + 2, 1, data.length, 5).setValues(data);
  }
  
  sheet.autoResizeColumns(1, 5);
  sheet.setFrozenRows(1);
  
  Logger.log('Saved ' + operators.length + ' operators to sheet');
}

/**
 * Manual test - fetches nPerf data and shows results.
 * WARNING: Takes 5-10 minutes to complete!
 */
function testNperfFetch() {
  SpreadsheetApp.getUi().alert('Starting nPerf Update', 
    'This will fetch fresh data from nPerf for ALL countries.\n\n' +
    'This takes 5-10 minutes. Check Executions log for progress.\n\n' +
    'Click OK to start...',
    SpreadsheetApp.getUi().ButtonSet.OK);
    
  var result = updateNperfData();
  
  var message = result.success 
    ? 'Success!\n\nTotal operators: ' + result.total + '\nWith GSMA IDs: ' + result.withGsma
    : 'Error: ' + result.error;
  
  Logger.log(message);
  SpreadsheetApp.getUi().alert('nPerf Update Complete', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Full update - fetches both nPerf and GSMA data.
 * Run this monthly to keep everything fresh.
 */
function fullDataRefresh() {
  Logger.log('=== FULL DATA REFRESH ===');
  
  // First update nPerf (this includes GSMA matching)
  var result = updateNperfData();
  
  if (result.success) {
    Logger.log('Full refresh complete: ' + result.total + ' operators');
    SpreadsheetApp.getUi().alert('Full Refresh Complete', 
      'Successfully updated operator data!\n\n' +
      'Total operators: ' + result.total + '\n' +
      'With GSMA coverage: ' + result.withGsma,
      SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    Logger.log('Full refresh failed: ' + result.error);
    SpreadsheetApp.getUi().alert('Refresh Failed', 'Error: ' + result.error, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Sets up a monthly trigger for full data refresh.
 */
function setupMonthlyRefreshTrigger() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'fullDataRefresh') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create monthly trigger (1st of each month at 4am)
  ScriptApp.newTrigger('fullDataRefresh')
    .timeBased()
    .onMonthDay(1)
    .atHour(4)
    .create();
  
  Logger.log('Monthly refresh trigger created.');
  SpreadsheetApp.getUi().alert('Monthly Refresh Enabled', 
    'Operator data will automatically refresh on the 1st of each month at 4am.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}
