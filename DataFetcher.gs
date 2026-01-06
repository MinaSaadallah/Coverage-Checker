/**
 * Data Fetcher for Coverage Checker
 * 
 * Converts Node.js data-fetcher.js logic to Google Apps Script.
 * Fetches and updates mobile network operator data from GSMA, nPerf, and REST Countries APIs.
 * 
 * Features:
 * - GSMA CSV feed parsing
 * - nPerf API integration with rate limiting
 * - REST Countries API for country names
 * - Batching to handle 6-minute execution limit
 * - Automatic sheet storage
 * 
 * @file DataFetcher.gs
 * @version 2.0.0
 */

/**
 * Main function to fetch and update all data
 * Coordinates GSMA, nPerf, and Countries API fetching
 * 
 * @returns {Object} Result object with counts and status
 */
function fetchAllData() {
  try {
    logInfo('Starting comprehensive data fetch');
    var startTime = new Date().getTime();
    
    var result = {
      success: false,
      gsmaCount: 0,
      nperfCount: 0,
      countriesCount: 0,
      totalOperators: 0,
      errors: []
    };
    
    // Step 1: Fetch GSMA data
    try {
      var gsmaOperators = fetchGSMAData();
      result.gsmaCount = gsmaOperators.length;
      logInfo('GSMA fetch completed', { count: gsmaOperators.length });
    } catch (e) {
      result.errors.push('GSMA fetch failed: ' + e.message);
      logError('GSMA fetch failed', { error: e.message });
      gsmaOperators = [];
    }
    
    // Step 2: Fetch Countries data
    try {
      fetchCountriesData();
      result.countriesCount = getCountryCount();
      logInfo('Countries fetch completed', { count: result.countriesCount });
    } catch (e) {
      result.errors.push('Countries fetch failed: ' + e.message);
      logError('Countries fetch failed', { error: e.message });
    }
    
    // Step 3: Fetch nPerf data (this may take time, check execution limit)
    var elapsedTime = new Date().getTime() - startTime;
    var config = typeof CONFIG !== 'undefined' ? CONFIG : { MAX_EXECUTION_TIME: 330000 };
    
    if (elapsedTime < (config.MAX_EXECUTION_TIME - 60000)) { // Leave 1 minute buffer
      try {
        var nperfResult = fetchNPerfDataBatched(gsmaOperators, 0);
        result.nperfCount = nperfResult.count;
        result.totalOperators = nperfResult.total;
        logInfo('nPerf fetch completed', { count: nperfResult.count, total: nperfResult.total });
      } catch (e) {
        result.errors.push('nPerf fetch failed: ' + e.message);
        logError('nPerf fetch failed', { error: e.message });
      }
    } else {
      logWarning('Skipping nPerf fetch due to time limit');
      result.errors.push('Time limit reached, nPerf fetch skipped');
    }
    
    result.success = result.errors.length === 0;
    var duration = Math.round((new Date().getTime() - startTime) / 1000);
    logInfo('Data fetch completed', { duration: duration + 's', result: result });
    
    return result;
  } catch (e) {
    logError('Fatal error in fetchAllData', { error: e.message, stack: e.stack });
    return {
      success: false,
      error: e.message
    };
  }
}

/**
 * Fetches operator data from GSMA CSV feed
 * Stores raw data in GSMA_Raw sheet
 * 
 * @returns {Array<Object>} Array of GSMA operator objects
 */
function fetchGSMAData() {
  try {
    logInfo('Fetching GSMA data');
    
    var config = getAPIConfig();
    var url = config.gsmaUrl;
    
    // Fetch CSV data
    var response = UrlFetchApp.fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error('GSMA fetch failed with status: ' + response.getResponseCode());
    }
    
    var csvData = response.getContentText();
    var operators = parseGSMACSV(csvData);
    
    // Store in GSMA_Raw sheet
    storeGSMARaw(operators);
    
    // Cache the data
    cachePut('gsma_raw_data', operators, 604800); // Cache for 1 week
    
    logInfo('GSMA data fetched and stored', { count: operators.length });
    return operators;
  } catch (e) {
    logError('GSMA fetch error', { error: e.message });
    throw e;
  }
}

/**
 * Parses GSMA CSV data into structured objects
 * @param {string} csvData - Raw CSV data
 * @returns {Array<Object>} Parsed operator objects
 */
function parseGSMACSV(csvData) {
  try {
    var lines = csvData.split('\n');
    var operators = [];
    
    // Skip header row
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV parsing (handles basic cases)
      var columns = parseCSVLine(line);
      
      if (columns.length >= 3) {
        operators.push({
          gsmaId: columns[0] || '',
          name: columns[1] || '',
          country: columns[2] || ''
        });
      }
    }
    
    return operators;
  } catch (e) {
    logError('CSV parsing error', { error: e.message });
    throw e;
  }
}

/**
 * Parses a single CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array<string>} Array of column values
 */
function parseCSVLine(line) {
  var columns = [];
  var current = '';
  var inQuotes = false;
  
  for (var i = 0; i < line.length; i++) {
    var char = line.charAt(i);
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      columns.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  columns.push(current.trim());
  return columns;
}

/**
 * Stores GSMA raw data in the GSMA_Raw sheet
 * @param {Array<Object>} operators - Array of operator objects
 */
function storeGSMARaw(operators) {
  try {
    var ss = getSpreadsheet();
    if (!ss) throw new Error('Cannot access spreadsheet');
    
    var sheet = ss.getSheetByName('GSMA_Raw');
    if (!sheet) {
      sheet = createGSMARawSheet(ss);
    }
    
    // Clear existing data (keep headers)
    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
    
    // Prepare data for insertion
    var data = operators.map(function(op) {
      return [op.gsmaId, op.name, op.country];
    });
    
    if (data.length > 0) {
      sheet.getRange(2, 1, data.length, 3).setValues(data);
    }
    
    // Add timestamp
    sheet.getRange(1, 4).setValue('Last Updated: ' + new Date().toISOString());
    
    logInfo('GSMA raw data stored in sheet', { rows: data.length });
  } catch (e) {
    logError('Failed to store GSMA raw data', { error: e.message });
  }
}

/**
 * Creates the GSMA_Raw sheet with headers
 * @param {Spreadsheet} ss - Spreadsheet object
 * @returns {Sheet} Created sheet
 */
function createGSMARawSheet(ss) {
  try {
    var sheet = ss.insertSheet('GSMA_Raw');
    
    var headers = ['GSMA ID', 'Operator Name', 'Country'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4ade80');
    
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 300);
    sheet.setColumnWidth(3, 200);
    
    sheet.setFrozenRows(1);
    
    logInfo('Created GSMA_Raw sheet');
    return sheet;
  } catch (e) {
    logError('Failed to create GSMA_Raw sheet', { error: e.message });
    throw e;
  }
}

/**
 * Fetches nPerf data with batching support
 * Processes countries in batches to stay under 6-minute execution limit
 * 
 * @param {Array<Object>} gsmaOperators - GSMA operators for matching
 * @param {number} batchIndex - Current batch index (0-based)
 * @returns {Object} Result with count and total
 */
function fetchNPerfDataBatched(gsmaOperators, batchIndex) {
  try {
    batchIndex = batchIndex || 0;
    
    var config = typeof CONFIG !== 'undefined' ? CONFIG : { NPERF_BATCH_SIZE: 50 };
    var allCountries = getAllCountryCodes();
    var batchSize = config.NPERF_BATCH_SIZE || 50;
    
    var startIdx = batchIndex * batchSize;
    var endIdx = Math.min(startIdx + batchSize, allCountries.length);
    var countriesBatch = allCountries.slice(startIdx, endIdx);
    
    logInfo('Fetching nPerf data batch', { 
      batch: batchIndex, 
      countries: countriesBatch.length,
      range: startIdx + '-' + endIdx 
    });
    
    var nperfOperators = [];
    var matchedGsmaIds = new Set();
    
    var apiConfig = getAPIConfig();
    
    for (var i = 0; i < countriesBatch.length; i++) {
      var code = countriesBatch[i];
      
      try {
        var response = UrlFetchApp.fetch(apiConfig.nperfUrl, {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify({ countryCode: code }),
          headers: { 'User-Agent': 'Mozilla/5.0' },
          muteHttpExceptions: true
        });
        
        if (response.getResponseCode() === 200) {
          var data = JSON.parse(response.getContentText());
          var ispList = extractNPerfISPs(data);
          
          ispList.forEach(function(isp) {
            var op = createOperatorObject(code, isp);
            
            // Match with GSMA
            var match = findGSMAMatch(op, gsmaOperators);
            if (match) {
              op.gsmaId = match.gsmaId;
              matchedGsmaIds.add(String(match.gsmaId));
            }
            
            nperfOperators.push(op);
          });
        }
      } catch (e) {
        logDebug('Failed to fetch nPerf for country: ' + code, { error: e.message });
      }
      
      // Rate limiting delay
      Utilities.sleep(apiConfig.delay || 50);
    }
    
    // Add GSMA-only operators for this batch
    var missingGsma = gsmaOperators.filter(function(g) {
      return !matchedGsmaIds.has(String(g.gsmaId));
    });
    
    missingGsma.forEach(function(g) {
      var code = mapCountryNameToCode(g.country);
      if (code && countriesBatch.indexOf(code) !== -1) {
        nperfOperators.push({
          countryCode: code,
          operatorId: 'GSMA_' + g.gsmaId,
          operatorName: g.name,
          link: '',
          gsmaId: g.gsmaId
        });
      }
    });
    
    // Store in cache or sheet
    storeOperatorsData(nperfOperators, batchIndex === 0);
    
    var hasMore = endIdx < allCountries.length;
    logInfo('nPerf batch completed', { 
      batch: batchIndex,
      operators: nperfOperators.length,
      hasMore: hasMore
    });
    
    return {
      count: nperfOperators.length,
      total: nperfOperators.length, // In batch mode, this is batch count
      hasMore: hasMore,
      nextBatch: hasMore ? batchIndex + 1 : -1
    };
  } catch (e) {
    logError('nPerf batch fetch error', { batch: batchIndex, error: e.message });
    throw e;
  }
}

/**
 * Extracts ISP list from nPerf API response
 * @param {Object} data - API response data
 * @returns {Array} Array of ISP objects
 */
function extractNPerfISPs(data) {
  var list = [];
  
  if (data.data && data.data.isp) {
    list = data.data.isp;
  } else if (data.result) {
    list = data.result;
  }
  
  if (!Array.isArray(list) && typeof list === 'object') {
    list = Object.values(list);
  }
  
  return Array.isArray(list) ? list : [];
}

/**
 * Creates operator object from nPerf ISP data
 * @param {string} countryCode - Country code
 * @param {Object} isp - ISP object from nPerf
 * @returns {Object} Operator object
 */
function createOperatorObject(countryCode, isp) {
  var ispId = isp.IspId || isp.id_isp || '';
  var ispName = isp.IspName || isp.name || '';
  
  var safeName = ispName.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  
  return {
    countryCode: countryCode,
    operatorId: String(ispId),
    operatorName: ispName,
    link: 'https://www.nperf.com/en/map/' + countryCode + '/-/' + ispId + '.' + safeName + '/signal',
    gsmaId: ''
  };
}

/**
 * Finds matching GSMA operator using fuzzy name matching
 * @param {Object} nperfOp - nPerf operator object
 * @param {Array<Object>} gsmaOperators - Array of GSMA operators
 * @returns {Object|null} Matched GSMA operator or null
 */
function findGSMAMatch(nperfOp, gsmaOperators) {
  var nperfNorm = normalizeOperatorName(nperfOp.operatorName);
  
  for (var i = 0; i < gsmaOperators.length; i++) {
    var gsma = gsmaOperators[i];
    var gsmaNorm = normalizeOperatorName(gsma.name);
    
    if (gsmaNorm === nperfNorm) {
      return gsma;
    }
    
    if (gsmaNorm.length > 3 && nperfNorm.length > 3) {
      if (gsmaNorm.indexOf(nperfNorm) !== -1 || nperfNorm.indexOf(gsmaNorm) !== -1) {
        return gsma;
      }
    }
  }
  
  return null;
}

/**
 * Normalizes operator name for comparison
 * @param {string} name - Operator name
 * @returns {string} Normalized name
 */
function normalizeOperatorName(name) {
  if (!name) return '';
  
  var normalized = name.toLowerCase();
  
  // Remove accents
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Remove content in parentheses
  normalized = normalized.replace(/\([^)]*\)/g, '');
  
  // Remove common suffixes
  normalized = normalized.replace(/\b(movil|mobile|cellular|wireless|telecom|communications|ltd|inc|s\.a|gmbh)\b/g, '');
  
  // Remove all non-alphanumeric
  normalized = normalized.replace(/[^a-z0-9]/g, '');
  
  return normalized.trim();
}

/**
 * Maps country name to ISO code using CountryNames.gs mapping
 * @param {string} countryName - Full country name
 * @returns {string} ISO code or empty string
 */
function mapCountryNameToCode(countryName) {
  if (typeof findCountryCode === 'function') {
    return findCountryCode(countryName);
  }
  
  // Fallback: basic mapping
  var basicMap = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'United Arab Emirates': 'AE',
    'South Korea': 'KR'
  };
  
  return basicMap[countryName] || '';
}

/**
 * Stores operators data in Operators sheet
 * @param {Array<Object>} operators - Array of operator objects
 * @param {boolean} clearFirst - Whether to clear existing data first
 */
function storeOperatorsData(operators, clearFirst) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return;
    
    var sheet = ss.getSheetByName('Operators');
    if (!sheet) {
      sheet = ss.insertSheet('Operators');
      var headers = ['countryCode', 'operatorId', 'operatorName', 'link', 'gsmaId'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    
    if (clearFirst && sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
    
    if (operators.length > 0) {
      var data = operators.map(function(op) {
        return [op.countryCode, op.operatorId, op.operatorName, op.link, op.gsmaId || ''];
      });
      
      var startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, data.length, 5).setValues(data);
    }
    
    // Update cache
    cachePut('operators_data', operators);
    
    logInfo('Operators data stored', { count: operators.length });
  } catch (e) {
    logError('Failed to store operators data', { error: e.message });
  }
}

/**
 * Fetches country names from REST Countries API
 * Updates COUNTRY_CODE_TO_NAME mapping
 * 
 * @returns {Object} Country mapping object
 */
function fetchCountriesData() {
  try {
    logInfo('Fetching countries data');
    
    var config = getAPIConfig();
    var url = config.countriesUrl;
    
    var response = UrlFetchApp.fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error('Countries API returned status: ' + response.getResponseCode());
    }
    
    var countries = JSON.parse(response.getContentText());
    var mapping = {};
    
    countries.forEach(function(country) {
      var code = country.cca2;
      var name = country.name && country.name.common ? country.name.common : code;
      mapping[code] = name;
    });
    
    // Store in Countries sheet
    storeCountriesData(mapping);
    
    // Cache the data
    cachePut('countries_data', mapping, 604800); // 1 week
    
    logInfo('Countries data fetched', { count: Object.keys(mapping).length });
    return mapping;
  } catch (e) {
    logError('Countries fetch error', { error: e.message });
    throw e;
  }
}

/**
 * Stores countries data in Countries sheet
 * @param {Object} mapping - Country code to name mapping
 */
function storeCountriesData(mapping) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return;
    
    var sheet = ss.getSheetByName('Countries');
    if (!sheet) {
      sheet = ss.insertSheet('Countries');
      var headers = ['Code', 'Name'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    
    if (sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
    
    var data = [];
    for (var code in mapping) {
      data.push([code, mapping[code]]);
    }
    
    data.sort(function(a, b) { return a[1].localeCompare(b[1]); });
    
    if (data.length > 0) {
      sheet.getRange(2, 1, data.length, 2).setValues(data);
    }
    
    logInfo('Countries data stored in sheet', { count: data.length });
  } catch (e) {
    logError('Failed to store countries data', { error: e.message });
  }
}

/**
 * Continues nPerf fetch from a specific batch
 * Use this to resume after hitting execution time limit
 * 
 * @param {number} batchIndex - Batch index to start from
 */
function continueNPerfFetch(batchIndex) {
  try {
    logInfo('Continuing nPerf fetch from batch', { batch: batchIndex });
    
    // Load GSMA data from cache or sheet
    var gsmaOperators = cacheGet('gsma_raw_data');
    if (!gsmaOperators) {
      gsmaOperators = fetchGSMAData();
    }
    
    return fetchNPerfDataBatched(gsmaOperators, batchIndex);
  } catch (e) {
    logError('Failed to continue nPerf fetch', { batch: batchIndex, error: e.message });
    throw e;
  }
}
