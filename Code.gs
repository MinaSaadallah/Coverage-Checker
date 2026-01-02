/**
 * Google Apps Script Backend for Coverage Checker
 */

var SPREADSHEET_ID = '1byFsl37OEaHYjYEV2ObVWDoHC_VrBB0RSS9tet1s59E';
var CACHE_DURATION_SECONDS = 21600;
var MAX_CACHE_CHUNK_SIZE = 90000;

var COUNTRY_CODE_TO_NAME = {
  AD:'Andorra',AE:'UAE',AF:'Afghanistan',AL:'Albania',AM:'Armenia',
  AO:'Angola',AR:'Argentina',AT:'Austria',AU:'Australia',AW:'Aruba',
  AZ:'Azerbaijan',BA:'Bosnia',BD:'Bangladesh',BE:'Belgium',BF:'Burkina Faso',
  BG:'Bulgaria',BH:'Bahrain',BI:'Burundi',BJ:'Benin',BO:'Bolivia',
  BR:'Brazil',BT:'Bhutan',BW:'Botswana',BY:'Belarus',BZ:'Belize',
  CA:'Canada',CD:'Congo',CH:'Switzerland',CI:'Ivory Coast',CL:'Chile',
  CM:'Cameroon',CN:'China',CO:'Colombia',CR:'Costa Rica',CY:'Cyprus',
  CZ:'Czechia',DE:'Germany',DK:'Denmark',DO:'Dominican',DZ:'Algeria',
  EC:'Ecuador',EE:'Estonia',EG:'Egypt',ES:'Spain',ET:'Ethiopia',
  FI:'Finland',FJ:'Fiji',FR:'France',GA:'Gabon',GB:'UK',GE:'Georgia',
  GH:'Ghana',GR:'Greece',GT:'Guatemala',HK:'Hong Kong',HN:'Honduras',
  HR:'Croatia',HU:'Hungary',ID:'Indonesia',IE:'Ireland',IL:'Israel',
  IN:'India',IQ:'Iraq',IS:'Iceland',IT:'Italy',JM:'Jamaica',JO:'Jordan',
  JP:'Japan',KE:'Kenya',KH:'Cambodia',KR:'Korea',KW:'Kuwait',
  KZ:'Kazakhstan',LA:'Lao',LB:'Lebanon',LK:'Sri Lanka',LT:'Lithuania',
  LU:'Luxembourg',LV:'Latvia',LY:'Libya',MA:'Morocco',MD:'Moldova',
  ME:'Montenegro',MG:'Madagascar',MK:'Macedonia',ML:'Mali',MM:'Myanmar',
  MN:'Mongolia',MO:'Macao',MX:'Mexico',MY:'Malaysia',MZ:'Mozambique',
  NA:'Namibia',NG:'Nigeria',NI:'Nicaragua',NL:'Netherlands',NO:'Norway',
  NP:'Nepal',NZ:'New Zealand',OM:'Oman',PA:'Panama',PE:'Peru',
  PH:'Philippines',PK:'Pakistan',PL:'Poland',PT:'Portugal',PY:'Paraguay',
  QA:'Qatar',RO:'Romania',RS:'Serbia',RU:'Russia',RW:'Rwanda',
  SA:'Saudi Arabia',SE:'Sweden',SG:'Singapore',SI:'Slovenia',SK:'Slovakia',
  SN:'Senegal',TH:'Thailand',TN:'Tunisia',TR:'Turkey',TW:'Taiwan',
  TZ:'Tanzania',UA:'Ukraine',UG:'Uganda',US:'USA',UY:'Uruguay',
  UZ:'Uzbekistan',VE:'Venezuela',VN:'Vietnam',ZA:'South Africa',
  ZM:'Zambia',ZW:'Zimbabwe'
};

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Coverage Checker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode. ALLOWALL);
}

function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  if (SPREADSHEET_ID && SPREADSHEET_ID.length > 10) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      Logger.log('Cannot open spreadsheet: ' + e. message);
    }
  }
  return null;
}

function getOperators() {
  var operators = loadFromSheet();
  if (operators. length > 0) {
    Logger.log('Loaded ' + operators.length + ' from sheet');
    return operators;
  }
  
  operators = loadFromCache();
  if (operators.length > 0) {
    Logger.log('Loaded ' + operators.length + ' from cache');
    return operators;
  }
  
  operators = loadFromProperties();
  if (operators.length > 0) {
    Logger.log('Loaded ' + operators.length + ' from properties');
    return operators;
  }
  
  operators = loadFromImportFallback();
  if (operators.length > 0) {
    Logger.log('Loaded ' + operators.length + ' from fallback');
    saveToCache(operators);
    saveToProperties(operators);
    return operators;
  }
  
  Logger.log('ERROR: All data sources failed');
  return [];
}

function loadFromSheet() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return [];
    var sheet = ss.getSheetByName('Operators');
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    var headers = data[0];
    var result = [];
    for (var i = 1; i < data. length; i++) {
      var row = data[i];
      var obj = {};
      for (var j = 0; j < headers. length; j++) {
        obj[headers[j]] = row[j];
      }
      result.push(obj);
    }
    return result;
  } catch (e) {
    Logger.log('Sheet load error: ' + e.message);
    return [];
  }
}

function loadFromCache() {
  try {
    var cache = CacheService.getScriptCache();
    var cached = cache.get('operators_data');
    if (cached) {
      return JSON.parse(cached);
    }
    var chunkCount = cache.get('operators_chunks');
    if (chunkCount) {
      var chunks = [];
      var count = parseInt(chunkCount, 10);
      for (var i = 0; i < count; i++) {
        var chunk = cache.get('operators_chunk_' + i);
        if (! chunk) return [];
        chunks.push(chunk);
      }
      return JSON.parse(chunks. join(''));
    }
    return [];
  } catch (e) {
    Logger.log('Cache load error: ' + e. message);
    return [];
  }
}

function loadFromProperties() {
  try {
    var props = PropertiesService.getScriptProperties();
    var stored = props.getProperty('operators_json');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    Logger.log('Properties load error: ' + e. message);
    return [];
  }
}

function loadFromImportFallback() {
  try {
    if (typeof getOperatorsFromImport === 'function') {
      var data = getOperatorsFromImport();
      return Array.isArray(data) ? data : [];
    }
    return [];
  } catch (e) {
    Logger.log('Import fallback error: ' + e. message);
    return [];
  }
}

function saveToCache(operators) {
  try {
    var cache = CacheService.getScriptCache();
    var json = JSON.stringify(operators);
    if (json.length < MAX_CACHE_CHUNK_SIZE) {
      cache.put('operators_data', json, CACHE_DURATION_SECONDS);
    } else {
      var chunks = chunkString(json, MAX_CACHE_CHUNK_SIZE);
      cache.put('operators_chunks', String(chunks. length), CACHE_DURATION_SECONDS);
      for (var i = 0; i < chunks.length; i++) {
        cache.put('operators_chunk_' + i, chunks[i], CACHE_DURATION_SECONDS);
      }
    }
  } catch (e) {
    Logger.log('Cache save error: ' + e.message);
  }
}

function saveToProperties(operators) {
  try {
    var json = JSON.stringify(operators);
    if (json.length < 500000) {
      PropertiesService.getScriptProperties().setProperty('operators_json', json);
    }
  } catch (e) {
    Logger.log('Properties save error: ' + e.message);
  }
}

function chunkString(str, size) {
  var chunks = [];
  for (var i = 0; i < str.length; i += size) {
    chunks.push(str.substring(i, i + size));
  }
  return chunks;
}

function clearCache() {
  var cache = CacheService.getScriptCache();
  cache.remove('operators_data');
  cache.remove('operators_chunks');
  for (var i = 0; i < 10; i++) {
    cache.remove('operators_chunk_' + i);
  }
  PropertiesService.getScriptProperties().deleteProperty('operators_json');
  Logger.log('Cache cleared');
}

function refreshNow() {
  clearCache();
  var operators = getOperators();
  Logger.log('Refreshed:  ' + operators.length + ' operators');
}

function expandUrl(shortUrl) {
  try {
    var url = shortUrl.trim();
    if (url.indexOf('maps.apple/') !== -1 && url.indexOf('maps.apple. com') === -1) {
      url = url.replace('maps.apple/', 'maps.apple.com/');
    }
    
    var coords = extractCoords(url);
    if (coords) {
      return { expandedUrl: url, coords: coords };
    }
    
    var result = followRedirects(url);
    if (result. coords) {
      return result;
    }
    
    if (result.content) {
      coords = extractCoordsFromHtml(result.content);
      if (coords) {
        return { expandedUrl: result.finalUrl, coords: coords };
      }
    }
    
    return { error: 'Could not find coordinates', expandedUrl: result.finalUrl };
  } catch (e) {
    Logger.log('expandUrl error: ' + e.message);
    return { error: e.message };
  }
}

function followRedirects(startUrl) {
  var currentUrl = startUrl;
  var finalUrl = startUrl;
  var content = '';
  var foundCoords = null;
  
  for (var i = 0; i < 10; i++) {
    try {
      var isApple = currentUrl.indexOf('apple') !== -1;
      var ua = isApple
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
      
      var response = UrlFetchApp.fetch(currentUrl, {
        followRedirects: false,
        muteHttpExceptions: true,
        headers: { 'User-Agent': ua }
      });
      
      var code = response.getResponseCode();
      var headers = response.getHeaders();
      var location = headers['Location'] || headers['location'];
      
      if (code >= 300 && code < 400 && location) {
        if (location.indexOf('http') !== 0) {
          var m = currentUrl.match(/^(https?:\/\/[^\/]+)/);
          if (m) {
            location = m[1] + (location.charAt(0) === '/' ? '' : '/') + location;
          }
        }
        var coords = extractCoords(location);
        if (coords) foundCoords = coords;
        currentUrl = location;
        finalUrl = location;
      } else {
        content = response. getContentText();
        break;
      }
    } catch (e) {
      break;
    }
  }
  
  if (! foundCoords) {
    foundCoords = extractCoords(finalUrl);
  }
  
  return { finalUrl: finalUrl, coords: foundCoords, content: content };
}

function extractCoords(url) {
  if (! url) return null;
  
  try { url = decodeURIComponent(url); } catch (e) {}
  
  var lat, lng, m;
  
  // Google place marker (last match)
  var re1 = /! 8m2!3d(-?\d+\. ?\d*)!4d(-?\d+\. ?\d*)/g;
  var last1 = null;
  while ((m = re1.exec(url)) !== null) last1 = m;
  if (last1) {
    lat = parseFloat(last1[1]);
    lng = parseFloat(last1[2]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // Google coords (last match)
  var re2 = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/g;
  var last2 = null;
  while ((m = re2.exec(url)) !== null) last2 = m;
  if (last2) {
    lat = parseFloat(last2[1]);
    lng = parseFloat(last2[2]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // Apple coordinate param
  m = url.match(/[?&]coordinate=(-?\d+\.?\d*)[,%](-?\d+\.?\d*)/);
  if (!m) m = url.match(/[?&]coordinate=(-?\d+\. ?\d*)%2C(-?\d+\.?\d*)/);
  if (m) {
    lat = parseFloat(m[1]);
    lng = parseFloat(m[2]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // @lat,lng
  m = url. match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) {
    lat = parseFloat(m[1]);
    lng = parseFloat(m[2]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // ll, sll, q params
  m = url.match(/[?&](?:q|ll|sll)=(-?\d+\.?\d*)[,%](-?\d+\.?\d*)/);
  if (!m) m = url.match(/[?&](?:q|ll|sll)=(-?\d+\.?\d*)%2C(-?\d+\.?\d*)/);
  if (m) {
    lat = parseFloat(m[1]);
    lng = parseFloat(m[2]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  return null;
}

function isValidCoord(lat, lng) {
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

function extractCoordsFromHtml(html) {
  if (!html) return null;
  
  var lat, lng, m;
  
  // Place location meta
  var latM = html.match(/place: location:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  var lngM = html.match(/place:location:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  if (latM && lngM) {
    lat = parseFloat(latM[1]);
    lng = parseFloat(lngM[1]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // OG meta
  latM = html.match(/og:latitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  lngM = html.match(/og:longitude["']\s+content=["'](-?\d+\.?\d*)["']/);
  if (latM && lngM) {
    lat = parseFloat(latM[1]);
    lng = parseFloat(lngM[1]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // ll param
  m = html.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) {
    lat = parseFloat(m[1]);
    lng = parseFloat(m[2]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  // JSON lat/lng
  latM = html.match(/["']lat["']\s*:\s*(-?\d+\.?\d*)/);
  lngM = html.match(/["']lng["']\s*:\s*(-?\d+\.?\d*)/);
  if (latM && lngM) {
    lat = parseFloat(latM[1]);
    lng = parseFloat(lngM[1]);
    if (isValidCoord(lat, lng)) return { lat: lat, lng: lng };
  }
  
  return null;
}

var DEFAULT_TERRITORIES = {
  PR: { name: 'Puerto Rico', parent: 'US', bbox: [17.883, -67.942, 18.515, -65.22] },
  VI: { name: 'US Virgin Islands', parent: 'US', bbox: [17.636, -65.091, 18.579, -64.33] },
  HK: { name: 'Hong Kong', parent: 'CN', bbox: [22.1, 113.8, 22.6, 114.5] },
  MO: { name: 'Macau', parent: 'CN', bbox: [22.1, 113.5, 22.25, 113.6] }
};

function getTerritories() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return DEFAULT_TERRITORIES;
    var sheet = ss.getSheetByName('Territories');
    if (!sheet) return DEFAULT_TERRITORIES;
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return DEFAULT_TERRITORIES;
    
    var headers = data[0];
    var codeIdx = headers.indexOf('code');
    var nameIdx = headers.indexOf('name');
    var parentIdx = headers.indexOf('parent');
    
    var territories = {};
    for (var i = 1; i < data. length; i++) {
      var row = data[i];
      var code = row[codeIdx];
      if (code) {
        territories[code] = {
          name: row[nameIdx] || '',
          parent: row[parentIdx] || '',
          bbox: [0, 0, 0, 0]
        };
      }
    }
    return territories;
  } catch (e) {
    return DEFAULT_TERRITORIES;
  }
}

function testSpreadsheetAccess() {
  var ss = getSpreadsheet();
  if (!ss) return 'ERROR: No spreadsheet found';
  var sheets = ss.getSheets();
  var names = [];
  for (var i = 0; i < sheets. length; i++) {
    names.push(sheets[i].getName());
  }
  return 'SUCCESS: ' + names.join(', ');
}

function testGetOperators() {
  var ops = getOperators();
  if (!ops || ops.length === 0) return 'ERROR: No operators';
  return 'SUCCESS: ' + ops.length + ' operators';
}

function runFullDiagnostic() {
  var r1 = testSpreadsheetAccess();
  var r2 = testGetOperators();
  var r3 = 'Territories:  ' + Object.keys(getTerritories()).length;
  var output = r1 + '\n' + r2 + '\n' + r3;
  Logger.log(output);
  return output;
}

/**
 * Gets or creates the "Data" sheet for storing coverage check logs
 * @return {Sheet} The Data sheet
 */
function getOrCreateDataSheet() {
  var ss = getSpreadsheet();
  if (!ss) {
    throw new Error('Unable to access spreadsheet');
  }
  
  var sheet = ss.getSheetByName('Data');
  
  if (!sheet) {
    // Create new sheet
    sheet = ss.insertSheet('Data');
    
    // Add headers
    var headers = ['Email', 'Timestamp', 'Source', 'Entered Link', 'Generated Link'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4ade80');
    
    // Set column widths
    sheet.setColumnWidth(1, 200); // Email
    sheet.setColumnWidth(2, 180); // Timestamp
    sheet.setColumnWidth(3, 100); // Source
    sheet.setColumnWidth(4, 300); // Entered Link
    sheet.setColumnWidth(5, 300); // Generated Link
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    Logger.log('Created new Data sheet with headers');
  }
  
  return sheet;
}

/**
 * Saves coverage check data to the Data sheet
 * @param {string} source - Coverage source (nperf or GSMA)
 * @param {string} enteredLink - Original map link entered by user
 * @param {string} generatedLink - Generated coverage check link
 * @return {Object} Result object with success status
 */
function saveDataToSheet(source, enteredLink, generatedLink) {
  try {
    // Validate parameters with specific error messages
    var missingParams = [];
    if (!source) missingParams.push('source');
    if (!enteredLink) missingParams.push('enteredLink');
    if (!generatedLink) missingParams.push('generatedLink');
    
    if (missingParams.length > 0) {
      return { 
        success: false, 
        error: 'Missing required parameters: ' + missingParams.join(', ') 
      };
    }
    
    var sheet = getOrCreateDataSheet();
    
    // Get user email automatically
    var userEmail = Session.getActiveUser().getEmail() || 'Anonymous';
    
    // Check for duplicates - prevent saving if entry exists within last 5 seconds
    if (isDuplicateEntry(sheet, userEmail, source, enteredLink, generatedLink)) {
      Logger.log('Duplicate entry prevented: ' + userEmail + ', ' + source + ', ' + enteredLink);
      return { success: true, message: 'Data already saved (duplicate prevented)' };
    }
    
    // Create data row
    var timestamp = new Date();
    var rowData = [userEmail, timestamp, source, enteredLink, generatedLink];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    Logger.log('Saved data: ' + userEmail + ', ' + source + ', ' + enteredLink);
    return { success: true, message: 'Data saved successfully' };
    
  } catch (e) {
    Logger.log('Error saving data: ' + e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Checks if an entry already exists to prevent duplicates
 * @param {Sheet} sheet - The data sheet
 * @param {string} userEmail - User email
 * @param {string} source - Coverage source
 * @param {string} enteredLink - Entered link
 * @param {string} generatedLink - Generated link
 * @return {boolean} True if duplicate exists
 */
function isDuplicateEntry(sheet, userEmail, source, enteredLink, generatedLink) {
  try {
    // Configuration constants
    var MAX_ROWS_TO_CHECK = 10; // Number of recent rows to check for duplicates
    var DUPLICATE_WINDOW_MS = 5000; // Time window in milliseconds (5 seconds)
    var MIN_ROWS_FOR_CHECK = 2; // Minimum rows needed (header + at least 1 data row)
    var NUM_COLUMNS = 5; // Number of columns to fetch (Email, Timestamp, Source, EnteredLink, GeneratedLink)
    var HEADER_ROWS = 1; // Number of header rows to exclude
    
    var lastRow = sheet.getLastRow();
    
    // Need at least MIN_ROWS_FOR_CHECK rows to check for duplicates
    if (lastRow < MIN_ROWS_FOR_CHECK) {
      return false;
    }
    
    // Fetch only the last N rows for performance (or fewer if sheet has less data)
    var numRowsToCheck = Math.min(MAX_ROWS_TO_CHECK, lastRow - HEADER_ROWS);
    var startRow = lastRow - numRowsToCheck + 1;
    var data = sheet.getRange(startRow, 1, numRowsToCheck, NUM_COLUMNS).getValues();
    
    var now = new Date().getTime();
    var windowStart = now - DUPLICATE_WINDOW_MS;
    
    // Iterate through fetched rows (most recent first)
    for (var i = data.length - 1; i >= 0; i--) {
      var row = data[i];
      var rowEmail = row[0];
      var rowSource = row[2];
      var rowEnteredLink = row[3];
      var rowGeneratedLink = row[4];
      
      // Safely parse timestamp
      var rowTimestamp;
      try {
        rowTimestamp = new Date(row[1]).getTime();
        if (isNaN(rowTimestamp)) {
          continue; // Skip invalid timestamps
        }
      } catch (e) {
        continue; // Skip invalid timestamps
      }
      
      // Early exit optimization: if timestamp is outside window, no need to check further
      // since we're iterating from newest to oldest
      if (rowTimestamp < windowStart) {
        break;
      }
      
      // Check if this entry matches and is within the time window
      if (rowEmail === userEmail &&
          rowSource === source &&
          rowEnteredLink === enteredLink &&
          rowGeneratedLink === generatedLink) {
        return true;
      }
    }
    
    return false;
  } catch (e) {
    Logger.log('Error checking duplicates: ' + e.message);
    return false; // If check fails, allow saving to prevent data loss
  }
}

/**
 * Get all coverage check data (optional - for viewing/reporting)
 * @return {Array} Array of coverage check objects
 */
function getAllCoverageData() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return [];
    
    var sheet = ss.getSheetByName('Data');
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    // Remove header row
    data.shift();
    
    return data.map(function(row) {
      return {
        userEmail: row[0],
        timestamp: row[1],
        source: row[2],
        enteredLink: row[3],
        generatedLink: row[4]
      };
    });
  } catch (e) {
    Logger.log('Error getting data: ' + e.message);
    return [];
  }
}

/**
 * Clear old data from the Data sheet (optional)
 * @param {number} daysOld - Number of days old to clear (default: 30)
 * @return {Object} Result object with success status
 */
function clearOldData(daysOld) {
  try {
    daysOld = daysOld || 30;
    
    var ss = getSpreadsheet();
    if (!ss) {
      return { success: false, error: 'Unable to access spreadsheet' };
    }
    
    var sheet = ss.getSheetByName('Data');
    if (!sheet) {
      return { success: false, error: 'Data sheet not found' };
    }
    
    var data = sheet.getDataRange().getValues();
    var cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Start from bottom to avoid index shifting
    for (var i = data.length - 1; i > 0; i--) {
      var rowDate = new Date(data[i][1]); // Timestamp is in column 2 (index 1)
      if (rowDate < cutoffDate) {
        sheet.deleteRow(i + 1);
      }
    }
    
    return { success: true, message: 'Old data cleared' };
  } catch (e) {
    Logger.log('Error clearing data: ' + e.message);
    return { success: false, error: e.message };
  }
}
