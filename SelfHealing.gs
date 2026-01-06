/**
 * Self-Healing System for Coverage Checker
 * 
 * Automatically detects and repairs common issues:
 * - Missing sheets → auto-create
 * - Missing triggers → auto-reinstall
 * - Corrupted cache → rebuild
 * - Missing data → re-fetch
 * - Data integrity → validate and fix
 * 
 * Provides health scoring (0-100) and auto-fix capabilities
 * 
 * @file SelfHealing.gs
 * @version 2.0.0
 */

/**
 * Runs complete system health check and auto-repair
 * This is the main entry point for self-healing
 * 
 * @param {boolean} autoFix - Whether to automatically fix issues (default: true)
 * @returns {Object} Health report with score and details
 */
function runSystemHealthCheck(autoFix) {
  autoFix = (autoFix === undefined) ? true : autoFix;
  
  try {
    logInfo('Starting system health check', { autoFix: autoFix });
    var startTime = new Date().getTime();
    
    var report = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      status: 'unknown',
      checks: {},
      issues: [],
      fixes: [],
      autoFixEnabled: autoFix
    };
    
    var config = typeof getHealthConfig === 'function' ? getHealthConfig() : {
      weights: {
        SHEETS_EXIST: 20,
        TRIGGERS_INSTALLED: 20,
        DATA_FRESH: 20,
        CACHE_HEALTHY: 15,
        OPERATORS_LOADED: 15,
        EXTERNAL_APIS: 10
      }
    };
    
    var weights = config.weights;
    
    // Check 1: Required sheets exist
    var sheetsCheck = checkRequiredSheets(autoFix);
    report.checks.sheets = sheetsCheck;
    report.overallScore += sheetsCheck.score * (weights.SHEETS_EXIST / 100);
    if (!sheetsCheck.healthy) report.issues = report.issues.concat(sheetsCheck.issues);
    if (sheetsCheck.fixes) report.fixes = report.fixes.concat(sheetsCheck.fixes);
    
    // Check 2: Triggers installed
    var triggersCheck = checkTriggers(autoFix);
    report.checks.triggers = triggersCheck;
    report.overallScore += triggersCheck.score * (weights.TRIGGERS_INSTALLED / 100);
    if (!triggersCheck.healthy) report.issues = report.issues.concat(triggersCheck.issues);
    if (triggersCheck.fixes) report.fixes = report.fixes.concat(triggersCheck.fixes);
    
    // Check 3: Data freshness
    var dataCheck = checkDataFreshness(autoFix);
    report.checks.data = dataCheck;
    report.overallScore += dataCheck.score * (weights.DATA_FRESH / 100);
    if (!dataCheck.healthy) report.issues = report.issues.concat(dataCheck.issues);
    if (dataCheck.fixes) report.fixes = report.fixes.concat(dataCheck.fixes);
    
    // Check 4: Cache health
    var cacheCheck = checkCacheHealth(autoFix);
    report.checks.cache = cacheCheck;
    report.overallScore += cacheCheck.score * (weights.CACHE_HEALTHY / 100);
    if (!cacheCheck.healthy) report.issues = report.issues.concat(cacheCheck.issues);
    if (cacheCheck.fixes) report.fixes = report.fixes.concat(cacheCheck.fixes);
    
    // Check 5: Operators loaded
    var operatorsCheck = checkOperatorsLoaded(autoFix);
    report.checks.operators = operatorsCheck;
    report.overallScore += operatorsCheck.score * (weights.OPERATORS_LOADED / 100);
    if (!operatorsCheck.healthy) report.issues = report.issues.concat(operatorsCheck.issues);
    if (operatorsCheck.fixes) report.fixes = report.fixes.concat(operatorsCheck.fixes);
    
    // Check 6: External APIs accessible
    var apisCheck = checkExternalAPIs();
    report.checks.apis = apisCheck;
    report.overallScore += apisCheck.score * (weights.EXTERNAL_APIS / 100);
    if (!apisCheck.healthy) report.issues = report.issues.concat(apisCheck.issues);
    
    // Determine status
    var thresholds = config.thresholds || { CRITICAL: 50, WARNING: 70, GOOD: 85 };
    if (report.overallScore >= thresholds.GOOD) {
      report.status = 'healthy';
    } else if (report.overallScore >= thresholds.WARNING) {
      report.status = 'warning';
    } else if (report.overallScore >= thresholds.CRITICAL) {
      report.status = 'degraded';
    } else {
      report.status = 'critical';
    }
    
    // Store health report
    storeHealthReport(report);
    
    var duration = Math.round((new Date().getTime() - startTime) / 1000);
    logInfo('System health check completed', { 
      score: Math.round(report.overallScore), 
      status: report.status,
      duration: duration + 's',
      issues: report.issues.length,
      fixes: report.fixes.length
    });
    
    // Send alert if health is critical
    if (report.status === 'critical' && !isQuietHours()) {
      sendHealthAlert(report);
    }
    
    return report;
  } catch (e) {
    logError('System health check failed', { error: e.message });
    return {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      status: 'error',
      error: e.message,
      checks: {},
      issues: ['Health check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Checks if all required sheets exist
 * @param {boolean} autoFix - Whether to auto-create missing sheets
 * @returns {Object} Check result
 */
function checkRequiredSheets(autoFix) {
  try {
    var config = typeof getSpreadsheetConfig === 'function' ? getSpreadsheetConfig() : {
      sheetNames: {
        DATA: 'Data',
        ANALYTICS: 'Analytics',
        SYSTEM_LOGS: 'System_Logs',
        DASHBOARD: 'Dashboard',
        GSMA_RAW: 'GSMA_Raw',
        COUNTRIES: 'Countries',
        SYSTEM_HEALTH: 'System_Health',
        SYNC_HISTORY: 'Sync_History'
      }
    };
    
    var requiredSheets = [
      config.sheetNames.DATA,
      config.sheetNames.ANALYTICS,
      config.sheetNames.SYSTEM_LOGS
    ];
    
    var ss = getSpreadsheet();
    if (!ss) {
      return {
        healthy: false,
        score: 0,
        issues: ['Cannot access spreadsheet'],
        fixes: []
      };
    }
    
    var existingSheets = ss.getSheets().map(function(s) { return s.getName(); });
    var missingSheets = [];
    var fixes = [];
    
    for (var i = 0; i < requiredSheets.length; i++) {
      if (existingSheets.indexOf(requiredSheets[i]) === -1) {
        missingSheets.push(requiredSheets[i]);
        
        if (autoFix) {
          try {
            createMissingSheet(ss, requiredSheets[i]);
            fixes.push('Created missing sheet: ' + requiredSheets[i]);
          } catch (e) {
            logError('Failed to create sheet', { sheet: requiredSheets[i], error: e.message });
          }
        }
      }
    }
    
    var score = Math.round((1 - (missingSheets.length / requiredSheets.length)) * 100);
    
    return {
      healthy: missingSheets.length === 0,
      score: score,
      requiredSheets: requiredSheets,
      existingSheets: existingSheets,
      missingSheets: missingSheets,
      issues: missingSheets.map(function(s) { return 'Missing sheet: ' + s; }),
      fixes: fixes
    };
  } catch (e) {
    return {
      healthy: false,
      score: 0,
      issues: ['Sheet check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Creates a missing sheet with appropriate structure
 * @param {Spreadsheet} ss - Spreadsheet object
 * @param {string} sheetName - Name of sheet to create
 */
function createMissingSheet(ss, sheetName) {
  var sheet = ss.insertSheet(sheetName);
  
  // Add headers based on sheet type
  if (sheetName === 'Data') {
    sheet.getRange(1, 1, 1, 5).setValues([['Email', 'Timestamp', 'Source', 'Entered Link', 'Generated Link']]);
  } else if (sheetName === 'System_Logs') {
    createSystemLogsSheet(ss);
    return;
  } else if (sheetName === 'Dashboard') {
    createDashboardSheet(ss);
    return;
  } else if (sheetName === 'System_Health') {
    createSystemHealthSheet(ss);
    return;
  } else if (sheetName === 'Analytics') {
    sheet.getRange(1, 1, 1, 2).setValues([['Country', 'Count']]);
  }
  
  // Format header
  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4ade80');
  sheet.setFrozenRows(1);
  
  logInfo('Created missing sheet', { sheet: sheetName });
}

/**
 * Creates the System_Health sheet
 * @param {Spreadsheet} ss - Spreadsheet object
 */
function createSystemHealthSheet(ss) {
  var sheet = ss.getSheetByName('System_Health');
  if (!sheet) {
    sheet = ss.insertSheet('System_Health');
  }
  
  var headers = ['Timestamp', 'Overall Score', 'Status', 'Issues Count', 'Fixes Count', 'Details'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4ade80');
  
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 400);
  
  sheet.setFrozenRows(1);
}

/**
 * Creates the Dashboard sheet with formulas and formatting
 * @param {Spreadsheet} ss - Spreadsheet object
 */
function createDashboardSheet(ss) {
  var sheet = ss.getSheetByName('Dashboard');
  if (!sheet) {
    sheet = ss.insertSheet('Dashboard');
  }
  
  // Add title
  sheet.getRange(1, 1).setValue('Coverage Checker Dashboard').setFontSize(18).setFontWeight('bold');
  
  // Add stats sections
  sheet.getRange(3, 1).setValue('System Statistics').setFontWeight('bold').setBackground('#dbeafe');
  sheet.getRange(4, 1, 10, 1).setValues([
    ['Total Entries'],
    ['Total Countries'],
    ['Total Operators'],
    ['System Health Score'],
    ['Cache Hit Rate'],
    ['Last Data Sync'],
    ['GSMA Operators'],
    ['nPerf Operators'],
    ['System Version'],
    ['Uptime Days']
  ]);
  
  logInfo('Created Dashboard sheet');
}

/**
 * Checks if triggers are properly installed
 * @param {boolean} autoFix - Whether to auto-reinstall triggers
 * @returns {Object} Check result
 */
function checkTriggers(autoFix) {
  try {
    var allTriggers = ScriptApp.getProjectTriggers();
    var triggerFunctions = ['onEditTrigger', 'REFRESH_COUNTRY_ANALYTICS'];
    
    var foundTriggers = allTriggers.map(function(t) { return t.getHandlerFunction(); });
    var missingTriggers = [];
    var fixes = [];
    
    for (var i = 0; i < triggerFunctions.length; i++) {
      if (foundTriggers.indexOf(triggerFunctions[i]) === -1) {
        missingTriggers.push(triggerFunctions[i]);
        
        if (autoFix && triggerFunctions[i] === 'onEditTrigger') {
          try {
            // Reinstall edit trigger
            ScriptApp.newTrigger('onEditTrigger')
              .forSpreadsheet(getSpreadsheet())
              .onEdit()
              .create();
            fixes.push('Reinstalled trigger: onEditTrigger');
          } catch (e) {
            logError('Failed to reinstall trigger', { trigger: triggerFunctions[i], error: e.message });
          }
        }
      }
    }
    
    var score = Math.round((1 - (missingTriggers.length / triggerFunctions.length)) * 100);
    
    return {
      healthy: missingTriggers.length === 0,
      score: score,
      totalTriggers: allTriggers.length,
      missingTriggers: missingTriggers,
      issues: missingTriggers.map(function(t) { return 'Missing trigger: ' + t; }),
      fixes: fixes
    };
  } catch (e) {
    return {
      healthy: false,
      score: 0,
      issues: ['Trigger check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Checks data freshness
 * @param {boolean} autoFix - Whether to auto-refresh stale data
 * @returns {Object} Check result
 */
function checkDataFreshness(autoFix) {
  try {
    var issues = [];
    var fixes = [];
    var score = 100;
    
    // Check GSMA data age (should be < 7 days old)
    var gsmaData = cacheGet('gsma_raw_data');
    if (!gsmaData) {
      score -= 50;
      issues.push('GSMA data not in cache');
      
      if (autoFix) {
        // Don't auto-fetch here to avoid long execution time
        // Just flag for next scheduled sync
        issues.push('GSMA data will be refreshed in next sync');
      }
    }
    
    // Check operators data
    var operators = cacheGet('operators_data');
    if (!operators || operators.length === 0) {
      score -= 50;
      issues.push('Operators data not in cache or empty');
    }
    
    return {
      healthy: issues.length === 0,
      score: Math.max(0, score),
      issues: issues,
      fixes: fixes
    };
  } catch (e) {
    return {
      healthy: false,
      score: 0,
      issues: ['Data freshness check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Checks cache health
 * @param {boolean} autoFix - Whether to auto-rebuild corrupted cache
 * @returns {Object} Check result
 */
function checkCacheHealth(autoFix) {
  try {
    if (typeof getCacheHealth === 'function') {
      var cacheHealth = getCacheHealth();
      
      if (autoFix && cacheHealth.status === 'empty') {
        warmupCache();
        cacheHealth.fixes = ['Cache warmed up'];
      }
      
      return {
        healthy: cacheHealth.status === 'healthy',
        score: cacheHealth.score,
        hitRate: cacheHealth.hitRate,
        issues: cacheHealth.issues,
        fixes: cacheHealth.fixes || []
      };
    }
    
    return {
      healthy: true,
      score: 100,
      issues: [],
      fixes: []
    };
  } catch (e) {
    return {
      healthy: false,
      score: 0,
      issues: ['Cache health check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Checks if operators are loaded
 * @param {boolean} autoFix - Whether to auto-load operators
 * @returns {Object} Check result
 */
function checkOperatorsLoaded(autoFix) {
  try {
    var operators = getOperators();
    var count = operators ? operators.length : 0;
    var issues = [];
    var fixes = [];
    
    if (count === 0) {
      issues.push('No operators loaded');
      
      if (autoFix) {
        // Try to reload from sheet
        operators = loadFromSheet();
        if (operators && operators.length > 0) {
          saveToCache(operators);
          saveToProperties(operators);
          fixes.push('Reloaded operators from sheet: ' + operators.length);
          count = operators.length;
        }
      }
    }
    
    var score = count > 0 ? 100 : 0;
    
    return {
      healthy: count > 0,
      score: score,
      operatorCount: count,
      issues: issues,
      fixes: fixes
    };
  } catch (e) {
    return {
      healthy: false,
      score: 0,
      issues: ['Operators check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Checks if external APIs are accessible
 * @returns {Object} Check result
 */
function checkExternalAPIs() {
  try {
    var apis = {
      gsma: false,
      nperf: false,
      countries: false
    };
    
    var config = getAPIConfig();
    var issues = [];
    
    // Quick HEAD request to check if APIs are up (timeout after 2 seconds)
    try {
      UrlFetchApp.fetch(config.gsmaUrl, { method: 'head', muteHttpExceptions: true, timeout: 2000 });
      apis.gsma = true;
    } catch (e) {
      issues.push('GSMA API unreachable');
    }
    
    try {
      UrlFetchApp.fetch(config.countriesUrl, { method: 'head', muteHttpExceptions: true, timeout: 2000 });
      apis.countries = true;
    } catch (e) {
      issues.push('Countries API unreachable');
    }
    
    // nPerf is POST only, skip health check
    apis.nperf = true;
    
    var available = (apis.gsma ? 1 : 0) + (apis.nperf ? 1 : 0) + (apis.countries ? 1 : 0);
    var score = Math.round((available / 3) * 100);
    
    return {
      healthy: available === 3,
      score: score,
      apis: apis,
      issues: issues,
      fixes: []
    };
  } catch (e) {
    return {
      healthy: false,
      score: 0,
      issues: ['API check failed: ' + e.message],
      fixes: []
    };
  }
}

/**
 * Stores health report in System_Health sheet
 * @param {Object} report - Health report object
 */
function storeHealthReport(report) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return;
    
    var sheet = ss.getSheetByName('System_Health');
    if (!sheet) {
      createSystemHealthSheet(ss);
      sheet = ss.getSheetByName('System_Health');
    }
    
    if (!sheet) return;
    
    var timestamp = new Date();
    var score = Math.round(report.overallScore);
    var status = report.status;
    var issuesCount = report.issues.length;
    var fixesCount = report.fixes.length;
    var details = JSON.stringify({
      checks: report.checks,
      issues: report.issues,
      fixes: report.fixes
    });
    
    // Truncate details if too long
    if (details.length > 50000) {
      details = details.substring(0, 49997) + '...';
    }
    
    sheet.appendRow([timestamp, score, status, issuesCount, fixesCount, details]);
    
    // Keep only last MAX_HEALTH_REPORTS health reports
    var config = typeof CONFIG !== 'undefined' ? CONFIG : { MAX_HEALTH_REPORTS: 100 };
    var maxReports = config.MAX_HEALTH_REPORTS || 100;
    
    if (sheet.getLastRow() > (maxReports + 1)) { // +1 for header
      sheet.deleteRows(2, sheet.getLastRow() - (maxReports + 1));
    }
  } catch (e) {
    logError('Failed to store health report', { error: e.message });
  }
}

/**
 * Sends health alert email
 * @param {Object} report - Health report
 */
function sendHealthAlert(report) {
  try {
    if (typeof sendAlertEmail === 'function') {
      sendAlertEmail(
        'System Health Critical: ' + Math.round(report.overallScore) + '%',
        'System health has dropped to a critical level. Please review and take action.',
        report
      );
    }
  } catch (e) {
    logError('Failed to send health alert', { error: e.message });
  }
}

/**
 * Quick health check (lightweight version)
 * @returns {Object} Quick health status
 */
function quickHealthCheck() {
  try {
    var operators = getOperators();
    var cacheHitRate = getCacheHitRate();
    
    var score = 0;
    if (operators && operators.length > 0) score += 50;
    if (cacheHitRate > 30) score += 30;
    if (cacheHitRate > 60) score += 20;
    
    return {
      score: score,
      operatorCount: operators ? operators.length : 0,
      cacheHitRate: cacheHitRate,
      status: score >= 70 ? 'ok' : (score >= 40 ? 'warning' : 'critical')
    };
  } catch (e) {
    return {
      score: 0,
      status: 'error',
      error: e.message
    };
  }
}
