/**
 * Comprehensive Logging System for Coverage Checker
 * 
 * This module provides a multi-level logging system that writes to both
 * Apps Script Logger and a dedicated System_Logs sheet.
 * 
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
 * - Automatic log sheet creation
 * - Auto-cleanup of old logs
 * - Context tracking
 * - User tracking
 * 
 * @file Logger.gs
 * @version 2.0.0
 */

/**
 * Logs a debug message
 * @param {string} message - The log message
 * @param {Object} context - Optional context object
 * 
 * @example
 * logDebug('Processing operator data', {operatorCount: 100});
 */
function logDebug(message, context) {
  writeLog('DEBUG', message, context);
}

/**
 * Logs an info message
 * @param {string} message - The log message
 * @param {Object} context - Optional context object
 * 
 * @example
 * logInfo('Data fetch completed successfully');
 */
function logInfo(message, context) {
  writeLog('INFO', message, context);
}

/**
 * Logs a warning message
 * @param {string} message - The log message
 * @param {Object} context - Optional context object
 * 
 * @example
 * logWarning('Cache hit rate below threshold', {hitRate: 0.45});
 */
function logWarning(message, context) {
  writeLog('WARNING', message, context);
}

/**
 * Logs an error message
 * @param {string} message - The log message
 * @param {Object} context - Optional context object or Error object
 * 
 * @example
 * logError('Failed to fetch GSMA data', {error: e.message});
 */
function logError(message, context) {
  writeLog('ERROR', message, context);
}

/**
 * Logs a critical message
 * @param {string} message - The log message
 * @param {Object} context - Optional context object
 * 
 * @example
 * logCritical('System health below 50%', {health: 45});
 */
function logCritical(message, context) {
  writeLog('CRITICAL', message, context);
}

/**
 * Main logging function that writes to Apps Script Logger and sheet
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} context - Optional context data
 */
function writeLog(level, message, context) {
  try {
    // Get configuration
    var config = typeof getLoggingConfig === 'function' ? getLoggingConfig() : {
      levels: { DEBUG: 0, INFO: 1, WARNING: 2, ERROR: 3, CRITICAL: 4 },
      currentLevel: 1
    };
    
    // Check if message should be logged based on level
    var levelValue = config.levels[level] || 1;
    if (levelValue < config.currentLevel) {
      return; // Skip logging for levels below threshold
    }
    
    // Write to Apps Script Logger
    var logMessage = '[' + level + '] ' + message;
    if (context) {
      logMessage += ' | Context: ' + JSON.stringify(context);
    }
    Logger.log(logMessage);
    
    // Write to sheet (async, don't block on errors)
    try {
      writeLogToSheet(level, message, context);
    } catch (sheetError) {
      // Silent fail for sheet logging to prevent infinite loops
      Logger.log('Failed to write to log sheet: ' + sheetError.message);
    }
  } catch (e) {
    // Fallback to basic logging
    Logger.log('[LOGGER ERROR] ' + e.message);
  }
}

/**
 * Writes log entry to System_Logs sheet
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} context - Optional context data
 */
function writeLogToSheet(level, message, context) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return;
    
    var sheet = ss.getSheetByName('System_Logs');
    if (!sheet) {
      sheet = createSystemLogsSheet(ss);
    }
    
    if (!sheet) return; // Could not create sheet
    
    // Prepare log entry
    var timestamp = new Date();
    var user = Session.getActiveUser().getEmail() || 'System';
    var contextStr = context ? JSON.stringify(context) : '';
    
    // Truncate long context strings
    if (contextStr.length > 500) {
      contextStr = contextStr.substring(0, 497) + '...';
    }
    
    // Append row
    sheet.appendRow([timestamp, level, message, contextStr, user]);
    
    // Auto-cleanup old logs periodically (every 100 entries)
    var lastRow = sheet.getLastRow();
    if (lastRow > 100 && lastRow % 100 === 0) {
      cleanupOldLogs();
    }
  } catch (e) {
    // Silent fail - logging should not break functionality
    Logger.log('Sheet log write error: ' + e.message);
  }
}

/**
 * Creates the System_Logs sheet with proper headers
 * @param {Spreadsheet} ss - The spreadsheet object
 * @returns {Sheet} The created sheet or null
 */
function createSystemLogsSheet(ss) {
  try {
    var sheet = ss.insertSheet('System_Logs');
    
    // Add headers
    var headers = ['Timestamp', 'Level', 'Message', 'Context', 'User'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4ade80');
    headerRange.setHorizontalAlignment('center');
    
    // Set column widths
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 80);  // Level
    sheet.setColumnWidth(3, 400); // Message
    sheet.setColumnWidth(4, 300); // Context
    sheet.setColumnWidth(5, 200); // User
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Add conditional formatting for log levels
    addLogLevelFormatting(sheet);
    
    logInfo('Created System_Logs sheet');
    return sheet;
  } catch (e) {
    Logger.log('Failed to create System_Logs sheet: ' + e.message);
    return null;
  }
}

/**
 * Adds conditional formatting to highlight log levels
 * @param {Sheet} sheet - The System_Logs sheet
 */
function addLogLevelFormatting(sheet) {
  try {
    var lastRow = Math.max(sheet.getLastRow(), 100); // Format at least 100 rows
    var levelRange = sheet.getRange(2, 2, lastRow - 1, 1);
    
    // Define colors for each level
    var rules = [];
    
    // CRITICAL - Red background
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('CRITICAL')
      .setBackground('#fee2e2')
      .setFontColor('#991b1b')
      .setRanges([levelRange])
      .build());
    
    // ERROR - Orange background
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('ERROR')
      .setBackground('#fed7aa')
      .setFontColor('#9a3412')
      .setRanges([levelRange])
      .build());
    
    // WARNING - Yellow background
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('WARNING')
      .setBackground('#fef3c7')
      .setFontColor('#92400e')
      .setRanges([levelRange])
      .build());
    
    // INFO - Blue background
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('INFO')
      .setBackground('#dbeafe')
      .setFontColor('#1e40af')
      .setRanges([levelRange])
      .build());
    
    // DEBUG - Gray background
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('DEBUG')
      .setBackground('#f3f4f6')
      .setFontColor('#4b5563')
      .setRanges([levelRange])
      .build());
    
    sheet.setConditionalFormatRules(rules);
  } catch (e) {
    Logger.log('Failed to add log level formatting: ' + e.message);
  }
}

/**
 * Cleans up log entries older than configured retention period
 * @returns {number} Number of rows deleted
 */
function cleanupOldLogs() {
  try {
    var config = typeof getLoggingConfig === 'function' ? getLoggingConfig() : { retentionDays: 30 };
    var retentionDays = config.retentionDays || 30;
    
    var ss = getSpreadsheet();
    if (!ss) return 0;
    
    var sheet = ss.getSheetByName('System_Logs');
    if (!sheet) return 0;
    
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return 0; // Only header row
    
    var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // Get timestamps
    var cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    var rowsDeleted = 0;
    
    // Delete from bottom to top to avoid index shifting
    for (var i = data.length - 1; i >= 0; i--) {
      var timestamp = data[i][0];
      if (timestamp && timestamp < cutoffDate) {
        sheet.deleteRow(i + 2); // +2 because of header and 0-based index
        rowsDeleted++;
      }
    }
    
    if (rowsDeleted > 0) {
      logInfo('Cleaned up old log entries', { rowsDeleted: rowsDeleted });
    }
    
    return rowsDeleted;
  } catch (e) {
    Logger.log('Log cleanup error: ' + e.message);
    return 0;
  }
}

/**
 * Gets recent log entries
 * @param {number} count - Number of recent entries to retrieve (default: 50)
 * @param {string} level - Optional filter by log level
 * @returns {Array<Object>} Array of log entry objects
 */
function getRecentLogs(count, level) {
  try {
    count = count || 50;
    
    var ss = getSpreadsheet();
    if (!ss) return [];
    
    var sheet = ss.getSheetByName('System_Logs');
    if (!sheet) return [];
    
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];
    
    var numRows = Math.min(count, lastRow - 1);
    var startRow = Math.max(2, lastRow - numRows + 1);
    
    var data = sheet.getRange(startRow, 1, numRows, 5).getValues();
    
    var logs = [];
    for (var i = data.length - 1; i >= 0; i--) { // Reverse to show newest first
      var row = data[i];
      if (!level || row[1] === level) {
        logs.push({
          timestamp: row[0],
          level: row[1],
          message: row[2],
          context: row[3],
          user: row[4]
        });
      }
    }
    
    return logs;
  } catch (e) {
    Logger.log('Error getting recent logs: ' + e.message);
    return [];
  }
}

/**
 * Gets log statistics
 * @returns {Object} Log statistics including counts by level
 */
function getLogStatistics() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return null;
    
    var sheet = ss.getSheetByName('System_Logs');
    if (!sheet) return null;
    
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return {
        total: 0,
        debug: 0,
        info: 0,
        warning: 0,
        error: 0,
        critical: 0
      };
    }
    
    var data = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // Get levels
    
    var stats = {
      total: data.length,
      debug: 0,
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    };
    
    for (var i = 0; i < data.length; i++) {
      var level = String(data[i][0]).toLowerCase();
      if (stats.hasOwnProperty(level)) {
        stats[level]++;
      }
    }
    
    return stats;
  } catch (e) {
    Logger.log('Error getting log statistics: ' + e.message);
    return null;
  }
}

/**
 * Clears all logs from the System_Logs sheet
 * Use with caution!
 * @returns {boolean} True if successful, false otherwise
 */
function clearAllLogs() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return false;
    
    var sheet = ss.getSheetByName('System_Logs');
    if (!sheet) return false;
    
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    logInfo('All logs cleared');
    return true;
  } catch (e) {
    Logger.log('Error clearing logs: ' + e.message);
    return false;
  }
}

/**
 * Manual cleanup trigger function
 * Can be called manually or by a trigger
 */
function triggerLogCleanup() {
  var deleted = cleanupOldLogs();
  logInfo('Manual log cleanup completed', { rowsDeleted: deleted });
}
