/**
 * Master Trigger System for Coverage Checker
 * 
 * Comprehensive trigger management system that handles all automated tasks:
 * - On Edit triggers with debouncing
 * - Time-based triggers (15min, hourly, 6h, daily, weekly, monthly)
 * - One-click installation with INSTALL_COVERAGE_CHECKER_SYSTEM()
 * 
 * Features:
 * - Debounced edit triggers (3s wait, 10s minimum interval)
 * - Smart scheduling to avoid execution time limits
 * - Automatic cleanup of old triggers
 * - Health monitoring and reporting
 * 
 * @file MasterTriggers.gs
 * @version 2.0.0
 */

/**
 * ONE-CLICK SYSTEM INSTALLER
 * 
 * Run this function ONCE to set up the entire Coverage Checker automation system.
 * This will:
 * - Install all required triggers
 * - Create all required sheets
 * - Initialize cache
 * - Run initial health check
 * - Send confirmation email
 * 
 * After running this, the system will be fully autonomous!
 * 
 * @returns {Object} Installation result
 */
function INSTALL_COVERAGE_CHECKER_SYSTEM() {
  try {
    logInfo('========================================');
    logInfo('INSTALLING COVERAGE CHECKER SYSTEM');
    logInfo('========================================');
    
    var result = {
      success: false,
      steps: [],
      errors: []
    };
    
    // Step 1: Clean up any existing triggers
    logInfo('Step 1: Cleaning up old triggers');
    try {
      cleanupAllTriggers();
      result.steps.push('✓ Cleaned up old triggers');
    } catch (e) {
      result.errors.push('Failed to cleanup triggers: ' + e.message);
      logError('Trigger cleanup failed', { error: e.message });
    }
    
    // Step 2: Install all triggers
    logInfo('Step 2: Installing triggers');
    try {
      installAllTriggers();
      result.steps.push('✓ Installed all triggers');
    } catch (e) {
      result.errors.push('Failed to install triggers: ' + e.message);
      logError('Trigger installation failed', { error: e.message });
    }
    
    // Step 3: Create required sheets
    logInfo('Step 3: Creating required sheets');
    try {
      var healthCheck = runSystemHealthCheck(true); // Auto-fix enabled
      result.steps.push('✓ Created required sheets (health score: ' + Math.round(healthCheck.overallScore) + ')');
    } catch (e) {
      result.errors.push('Failed to create sheets: ' + e.message);
      logError('Sheet creation failed', { error: e.message });
    }
    
    // Step 4: Initialize cache
    logInfo('Step 4: Warming up cache');
    try {
      warmupCache();
      result.steps.push('✓ Cache warmed up');
    } catch (e) {
      result.errors.push('Failed to warm cache: ' + e.message);
      logError('Cache warmup failed', { error: e.message });
    }
    
    // Step 5: Fetch initial data (optional, can be done later)
    logInfo('Step 5: System ready - data fetch scheduled');
    result.steps.push('✓ System ready - first data sync will run on schedule');
    
    // Step 6: Send confirmation email
    logInfo('Step 6: Sending confirmation email');
    try {
      sendInstallationConfirmation(result);
      result.steps.push('✓ Confirmation email sent');
    } catch (e) {
      result.errors.push('Failed to send email: ' + e.message);
      logWarning('Email sending failed', { error: e.message });
    }
    
    result.success = result.errors.length === 0;
    
    logInfo('========================================');
    logInfo('INSTALLATION ' + (result.success ? 'COMPLETED SUCCESSFULLY' : 'COMPLETED WITH ERRORS'));
    logInfo('========================================');
    
    return result;
  } catch (e) {
    logError('Installation failed', { error: e.message, stack: e.stack });
    return {
      success: false,
      error: e.message,
      steps: [],
      errors: [e.message]
    };
  }
}

/**
 * Installs all required triggers for the system
 */
function installAllTriggers() {
  var ss = getSpreadsheet();
  if (!ss) throw new Error('Cannot access spreadsheet');
  
  // 1. On Edit Trigger (with debouncing handled in the function itself)
  ScriptApp.newTrigger('onEditTrigger')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  logInfo('Installed: onEditTrigger');
  
  // 2. Quick health check every 15 minutes
  ScriptApp.newTrigger('quickHealthCheckTrigger')
    .timeBased()
    .everyMinutes(15)
    .create();
  logInfo('Installed: quickHealthCheckTrigger (every 15 minutes)');
  
  // 3. Data refresh check every hour
  ScriptApp.newTrigger('hourlyDataCheckTrigger')
    .timeBased()
    .everyHours(1)
    .create();
  logInfo('Installed: hourlyDataCheckTrigger (every hour)');
  
  // 4. Full analytics recalculation every 6 hours
  ScriptApp.newTrigger('analyticsRecalculationTrigger')
    .timeBased()
    .everyHours(6)
    .create();
  logInfo('Installed: analyticsRecalculationTrigger (every 6 hours)');
  
  // 5. Daily report at 8 AM
  ScriptApp.newTrigger('dailyReportTrigger')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();
  logInfo('Installed: dailyReportTrigger (daily at 8 AM)');
  
  // 6. Weekly maintenance (Sunday at 3 AM)
  ScriptApp.newTrigger('weeklyMaintenanceTrigger')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(3)
    .create();
  logInfo('Installed: weeklyMaintenanceTrigger (Sunday at 3 AM)');
  
  // 7. Monthly archive (1st of month at 4 AM)
  ScriptApp.newTrigger('monthlyArchiveTrigger')
    .timeBased()
    .onMonthDay(1)
    .atHour(4)
    .create();
  logInfo('Installed: monthlyArchiveTrigger (1st of month at 4 AM)');
  
  logInfo('All triggers installed successfully');
}

/**
 * Cleans up all existing triggers
 * Useful before reinstalling or when debugging
 */
function cleanupAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  logInfo('Cleaned up ' + triggers.length + ' existing triggers');
}

/**
 * Enhanced on-edit trigger with debouncing
 * Prevents excessive executions and ensures minimum interval
 */
function onEditTrigger(e) {
  try {
    // Safety check
    if (!e || !e.range) return;
    
    var range = e.range;
    var sheet = range.getSheet();
    var sheetName = sheet.getName();
    var column = range.getColumn();
    
    // Only trigger for Column D (4) in the "Data" sheet
    if (sheetName !== 'Data' || column !== 4) {
      return;
    }
    
    var config = getTriggerConfig();
    var debounceWait = (config.EDIT && config.EDIT.DEBOUNCE_WAIT) || 3;
    var minInterval = (config.EDIT && config.EDIT.MINIMUM_INTERVAL) || 10;
    
    // Check last execution time
    var props = PropertiesService.getScriptProperties();
    var lastExecution = props.getProperty('last_edit_trigger_execution');
    var now = new Date().getTime();
    
    if (lastExecution) {
      var elapsed = (now - parseInt(lastExecution, 10)) / 1000;
      if (elapsed < minInterval) {
        logDebug('Edit trigger skipped (too soon)', { elapsed: elapsed + 's' });
        return;
      }
    }
    
    // Wait for debounce period (user might still be editing)
    Utilities.sleep(debounceWait * 1000);
    
    // Execute the analytics refresh
    logInfo('Edit trigger activated', { sheet: sheetName, column: column });
    REFRESH_COUNTRY_ANALYTICS();
    
    // Record execution time
    props.setProperty('last_edit_trigger_execution', String(now));
  } catch (e) {
    logError('Edit trigger error', { error: e.message });
  }
}

/**
 * Quick health check trigger (runs every 15 minutes)
 * Lightweight check to ensure system is responsive
 */
function quickHealthCheckTrigger() {
  try {
    logDebug('Running quick health check');
    var health = quickHealthCheck();
    
    if (health.status === 'critical') {
      logWarning('Quick health check shows critical status', health);
      
      // Run full health check if quick check fails
      if (!isQuietHours()) {
        runSystemHealthCheck(true);
      }
    }
  } catch (e) {
    logError('Quick health check failed', { error: e.message });
  }
}

/**
 * Hourly data check trigger
 * Checks if external data needs refresh
 */
function hourlyDataCheckTrigger() {
  try {
    logDebug('Running hourly data check');
    
    // Check cache age
    var stats = getCacheStats();
    
    // If cache is empty or has very low hit rate, warm it up
    var hitRate = getCacheHitRate();
    if (hitRate < 20) {
      logInfo('Cache hit rate low, warming up', { hitRate: hitRate });
      warmupCache();
    }
    
    // Check if operators data exists
    var operators = cacheGet('operators_data');
    if (!operators || operators.length === 0) {
      logWarning('Operators data missing, loading from sheet');
      var ops = loadFromSheet();
      if (ops && ops.length > 0) {
        cachePut('operators_data', ops);
      }
    }
  } catch (e) {
    logError('Hourly data check failed', { error: e.message });
  }
}

/**
 * Analytics recalculation trigger (runs every 6 hours)
 * Full analytics refresh
 */
function analyticsRecalculationTrigger() {
  try {
    logInfo('Running full analytics recalculation');
    REFRESH_COUNTRY_ANALYTICS();
    
    // Update dashboard
    if (typeof updateDashboard === 'function') {
      updateDashboard();
    }
  } catch (e) {
    logError('Analytics recalculation failed', { error: e.message });
  }
}

/**
 * Daily report trigger (runs at 8 AM)
 * Sends daily system report via email
 */
function dailyReportTrigger() {
  try {
    logInfo('Generating daily report');
    
    if (typeof sendDailyReport === 'function') {
      sendDailyReport();
    } else {
      logWarning('sendDailyReport function not found');
    }
  } catch (e) {
    logError('Daily report failed', { error: e.message });
  }
}

/**
 * Weekly maintenance trigger (runs Sunday at 3 AM)
 * Performs full data refresh and system maintenance
 */
function weeklyMaintenanceTrigger() {
  try {
    logInfo('========================================');
    logInfo('STARTING WEEKLY MAINTENANCE');
    logInfo('========================================');
    
    // Step 1: Health check
    logInfo('Step 1: Running health check');
    var health = runSystemHealthCheck(true);
    logInfo('Health check complete', { score: Math.round(health.overallScore) });
    
    // Step 2: Fetch fresh data
    logInfo('Step 2: Fetching fresh data');
    try {
      var dataResult = fetchAllData();
      logInfo('Data fetch complete', dataResult);
    } catch (e) {
      logError('Data fetch failed during maintenance', { error: e.message });
    }
    
    // Step 3: Clean up old logs
    logInfo('Step 3: Cleaning up old logs');
    cleanupOldLogs();
    
    // Step 4: Rebuild cache
    logInfo('Step 4: Rebuilding cache');
    cacheClearAll();
    warmupCache();
    
    // Step 5: Send weekly report
    logInfo('Step 5: Sending weekly report');
    if (typeof sendWeeklyReport === 'function') {
      sendWeeklyReport();
    }
    
    logInfo('========================================');
    logInfo('WEEKLY MAINTENANCE COMPLETED');
    logInfo('========================================');
  } catch (e) {
    logError('Weekly maintenance failed', { error: e.message, stack: e.stack });
  }
}

/**
 * Monthly archive trigger (runs 1st of month at 4 AM)
 * Archives old data and sends monthly report
 */
function monthlyArchiveTrigger() {
  try {
    logInfo('========================================');
    logInfo('STARTING MONTHLY ARCHIVE');
    logInfo('========================================');
    
    // Step 1: Clean old data
    logInfo('Step 1: Cleaning old data');
    var dataRetention = (typeof CONFIG !== 'undefined') ? CONFIG.DATA_RETENTION_DAYS : 90;
    clearOldData(dataRetention);
    
    // Step 2: Clean old health reports (keep last MAX_HEALTH_REPORTS)
    logInfo('Step 2: Cleaning old health reports');
    var ss = getSpreadsheet();
    if (ss) {
      var healthSheet = ss.getSheetByName('System_Health');
      if (healthSheet) {
        var config = typeof CONFIG !== 'undefined' ? CONFIG : { MAX_HEALTH_REPORTS: 100 };
        var maxReports = config.MAX_HEALTH_REPORTS || 100;
        
        if (healthSheet.getLastRow() > (maxReports + 1)) {
          healthSheet.deleteRows(2, healthSheet.getLastRow() - (maxReports + 1));
        }
      }
    }
    
    // Step 3: Send monthly report
    logInfo('Step 3: Sending monthly report');
    if (typeof sendMonthlyReport === 'function') {
      sendMonthlyReport();
    }
    
    logInfo('========================================');
    logInfo('MONTHLY ARCHIVE COMPLETED');
    logInfo('========================================');
  } catch (e) {
    logError('Monthly archive failed', { error: e.message });
  }
}

/**
 * Sends installation confirmation email
 * @param {Object} result - Installation result
 */
function sendInstallationConfirmation(result) {
  try {
    var config = getEmailConfig();
    var recipient = config.recipient;
    
    var subject = '[Coverage Checker] System Installation Complete';
    
    var body = '<html><body style="font-family: Arial, sans-serif;">';
    body += '<h2 style="color: #22c55e;">✓ Coverage Checker System Installed Successfully</h2>';
    body += '<p>The autonomous Coverage Checker system has been installed and is now running.</p>';
    
    body += '<h3>Installation Steps:</h3>';
    body += '<ul>';
    for (var i = 0; i < result.steps.length; i++) {
      body += '<li>' + result.steps[i] + '</li>';
    }
    body += '</ul>';
    
    if (result.errors.length > 0) {
      body += '<h3 style="color: #ef4444;">Errors:</h3>';
      body += '<ul>';
      for (var i = 0; i < result.errors.length; i++) {
        body += '<li style="color: #ef4444;">' + result.errors[i] + '</li>';
      }
      body += '</ul>';
    }
    
    body += '<h3>Active Triggers:</h3>';
    body += '<ul>';
    body += '<li>On Edit - Instant analytics refresh (debounced)</li>';
    body += '<li>Every 15 minutes - Quick health check</li>';
    body += '<li>Every hour - Data refresh check</li>';
    body += '<li>Every 6 hours - Full analytics recalculation</li>';
    body += '<li>Daily at 8 AM - Daily report</li>';
    body += '<li>Sunday at 3 AM - Weekly maintenance and data sync</li>';
    body += '<li>1st of month at 4 AM - Monthly archive</li>';
    body += '</ul>';
    
    body += '<p>The system will now run autonomously. You will receive daily reports and alerts if any issues occur.</p>';
    body += '<p><small>Powered by Coverage Checker v2.0.0</small></p>';
    body += '</body></html>';
    
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: body
    });
    
    logInfo('Installation confirmation email sent', { recipient: recipient });
  } catch (e) {
    logError('Failed to send installation email', { error: e.message });
  }
}

/**
 * Gets information about installed triggers
 * @returns {Array<Object>} Array of trigger information
 */
function getInstalledTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var info = [];
  
  for (var i = 0; i < triggers.length; i++) {
    var t = triggers[i];
    info.push({
      handlerFunction: t.getHandlerFunction(),
      triggerSource: t.getTriggerSource().toString(),
      eventType: t.getEventType().toString(),
      uniqueId: t.getUniqueId()
    });
  }
  
  return info;
}

/**
 * Manual trigger to uninstall the system
 * Removes all triggers but keeps data intact
 */
function UNINSTALL_COVERAGE_CHECKER_SYSTEM() {
  try {
    logInfo('Uninstalling Coverage Checker System');
    
    cleanupAllTriggers();
    
    var config = getEmailConfig();
    MailApp.sendEmail({
      to: config.recipient,
      subject: '[Coverage Checker] System Uninstalled',
      body: 'All automated triggers have been removed. Your data remains intact in the spreadsheet.'
    });
    
    logInfo('System uninstalled successfully');
    return { success: true, message: 'System uninstalled. All triggers removed.' };
  } catch (e) {
    logError('Uninstall failed', { error: e.message });
    return { success: false, error: e.message };
  }
}
