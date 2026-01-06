/**
 * Email Reporting System for Coverage Checker
 * 
 * Sends automated email reports:
 * - Daily reports (8 AM): Summary stats, top countries, system health
 * - Weekly reports (Sunday): Trends, data quality, weekly activity
 * - Monthly reports: Comprehensive statistics and insights
 * - Alert emails: Critical errors, low health scores
 * 
 * Features:
 * - HTML formatted emails with statistics
 * - Quiet hours support (10 PM - 7 AM)
 * - Configurable recipient
 * - Beautiful email templates
 * 
 * @file EmailReports.gs
 * @version 2.0.0
 */

/**
 * Sends daily report email
 * Called by dailyReportTrigger at 8 AM
 */
function sendDailyReport() {
  try {
    if (isQuietHours()) {
      logInfo('Daily report skipped (quiet hours)');
      return;
    }
    
    logInfo('Generating daily report');
    
    var stats = gatherDailyStats();
    var health = quickHealthCheck();
    
    var config = getEmailConfig();
    var subject = config.subjects.DAILY_REPORT + ' - ' + new Date().toLocaleDateString();
    
    var htmlBody = buildDailyReportHTML(stats, health);
    
    MailApp.sendEmail({
      to: config.recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    
    logInfo('Daily report sent', { recipient: config.recipient });
  } catch (e) {
    logError('Failed to send daily report', { error: e.message });
  }
}

/**
 * Sends weekly report email
 * Called by weeklyMaintenanceTrigger on Sunday
 */
function sendWeeklyReport() {
  try {
    if (isQuietHours()) {
      logInfo('Weekly report skipped (quiet hours)');
      return;
    }
    
    logInfo('Generating weekly report');
    
    var stats = gatherWeeklyStats();
    var health = runSystemHealthCheck(false); // Don't auto-fix during report
    
    var config = getEmailConfig();
    var subject = config.subjects.WEEKLY_REPORT + ' - ' + getWeekRange();
    
    var htmlBody = buildWeeklyReportHTML(stats, health);
    
    MailApp.sendEmail({
      to: config.recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    
    logInfo('Weekly report sent', { recipient: config.recipient });
  } catch (e) {
    logError('Failed to send weekly report', { error: e.message });
  }
}

/**
 * Sends monthly report email
 * Called by monthlyArchiveTrigger on 1st of month
 */
function sendMonthlyReport() {
  try {
    logInfo('Generating monthly report');
    
    var stats = gatherMonthlyStats();
    var health = runSystemHealthCheck(false);
    
    var config = getEmailConfig();
    var monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    var subject = config.subjects.MONTHLY_REPORT + ' - ' + monthName;
    
    var htmlBody = buildMonthlyReportHTML(stats, health);
    
    MailApp.sendEmail({
      to: config.recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    
    logInfo('Monthly report sent', { recipient: config.recipient });
  } catch (e) {
    logError('Failed to send monthly report', { error: e.message });
  }
}

/**
 * Sends alert email for critical issues
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Object} details - Additional details object
 */
function sendAlertEmail(title, message, details) {
  try {
    if (isQuietHours()) {
      logInfo('Alert email skipped (quiet hours)', { title: title });
      return;
    }
    
    var config = getEmailConfig();
    var subject = config.subjects.ALERT + ': ' + title;
    
    var htmlBody = buildAlertEmailHTML(title, message, details);
    
    MailApp.sendEmail({
      to: config.recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    
    logInfo('Alert email sent', { recipient: config.recipient, title: title });
  } catch (e) {
    logError('Failed to send alert email', { error: e.message });
  }
}

/**
 * Gathers statistics for daily report
 * @returns {Object} Daily statistics
 */
function gatherDailyStats() {
  try {
    var ss = getSpreadsheet();
    var stats = {
      totalEntries: 0,
      entriesToday: 0,
      topCountries: [],
      recentActivity: [],
      cacheHitRate: 0,
      operatorCount: 0
    };
    
    if (!ss) return stats;
    
    // Get data sheet
    var dataSheet = ss.getSheetByName('Data');
    if (dataSheet && dataSheet.getLastRow() > 1) {
      stats.totalEntries = dataSheet.getLastRow() - 1;
      
      // Count today's entries
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      
      var data = dataSheet.getRange(2, 2, stats.totalEntries, 1).getValues(); // Timestamps
      stats.entriesToday = data.filter(function(row) {
        var date = new Date(row[0]);
        return date >= today;
      }).length;
    }
    
    // Get top countries from Analytics
    var analyticsSheet = ss.getSheetByName('Analytics');
    if (analyticsSheet && analyticsSheet.getLastRow() > 1) {
      var countryData = analyticsSheet.getRange(2, 7, Math.min(5, analyticsSheet.getLastRow() - 1), 2).getValues();
      stats.topCountries = countryData.filter(function(row) { return row[0]; });
    }
    
    // Cache stats
    stats.cacheHitRate = getCacheHitRate();
    
    // Operator count
    var operators = getOperators();
    stats.operatorCount = operators ? operators.length : 0;
    
    return stats;
  } catch (e) {
    logError('Failed to gather daily stats', { error: e.message });
    return {};
  }
}

/**
 * Gathers statistics for weekly report
 * @returns {Object} Weekly statistics
 */
function gatherWeeklyStats() {
  try {
    var ss = getSpreadsheet();
    var stats = {
      totalEntries: 0,
      entriesThisWeek: 0,
      growingCountries: [],
      decliningCountries: [],
      dataQualityScore: 100,
      topCountries: [],
      cacheHitRate: 0,
      healthHistory: []
    };
    
    if (!ss) return stats;
    
    // Get data for this week
    var dataSheet = ss.getSheetByName('Data');
    if (dataSheet && dataSheet.getLastRow() > 1) {
      stats.totalEntries = dataSheet.getLastRow() - 1;
      
      var weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      var data = dataSheet.getRange(2, 2, stats.totalEntries, 1).getValues();
      stats.entriesThisWeek = data.filter(function(row) {
        var date = new Date(row[0]);
        return date >= weekAgo;
      }).length;
    }
    
    // Get analytics
    var analyticsSheet = ss.getSheetByName('Analytics');
    if (analyticsSheet && analyticsSheet.getLastRow() > 1) {
      var countryData = analyticsSheet.getRange(2, 7, Math.min(10, analyticsSheet.getLastRow() - 1), 2).getValues();
      stats.topCountries = countryData.filter(function(row) { return row[0]; });
    }
    
    // Cache stats
    stats.cacheHitRate = getCacheHitRate();
    
    // Health history
    var healthSheet = ss.getSheetByName('System_Health');
    if (healthSheet && healthSheet.getLastRow() > 1) {
      var numRows = Math.min(7, healthSheet.getLastRow() - 1);
      var healthData = healthSheet.getRange(healthSheet.getLastRow() - numRows + 1, 1, numRows, 3).getValues();
      stats.healthHistory = healthData.map(function(row) {
        return {
          date: row[0],
          score: row[1],
          status: row[2]
        };
      });
    }
    
    return stats;
  } catch (e) {
    logError('Failed to gather weekly stats', { error: e.message });
    return {};
  }
}

/**
 * Gathers statistics for monthly report
 * @returns {Object} Monthly statistics
 */
function gatherMonthlyStats() {
  try {
    var ss = getSpreadsheet();
    var stats = {
      totalEntries: 0,
      entriesThisMonth: 0,
      uniqueCountries: 0,
      topCountries: [],
      averageHealthScore: 0,
      totalOperators: 0,
      gsmaOperators: 0,
      nperfOperators: 0
    };
    
    if (!ss) return stats;
    
    // Get data for this month
    var dataSheet = ss.getSheetByName('Data');
    if (dataSheet && dataSheet.getLastRow() > 1) {
      stats.totalEntries = dataSheet.getLastRow() - 1;
      
      var monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      
      var data = dataSheet.getRange(2, 2, stats.totalEntries, 1).getValues();
      stats.entriesThisMonth = data.filter(function(row) {
        var date = new Date(row[0]);
        return date >= monthAgo;
      }).length;
    }
    
    // Get analytics
    var analyticsSheet = ss.getSheetByName('Analytics');
    if (analyticsSheet && analyticsSheet.getLastRow() > 1) {
      stats.uniqueCountries = analyticsSheet.getLastRow() - 1;
      var countryData = analyticsSheet.getRange(2, 7, Math.min(10, analyticsSheet.getLastRow() - 1), 2).getValues();
      stats.topCountries = countryData.filter(function(row) { return row[0]; });
    }
    
    // Operator stats
    var operators = getOperators();
    if (operators) {
      stats.totalOperators = operators.length;
      stats.gsmaOperators = operators.filter(function(op) { return op.gsmaId; }).length;
      stats.nperfOperators = operators.filter(function(op) { 
        return op.operatorId && String(op.operatorId).indexOf('GSMA_') === -1; 
      }).length;
    }
    
    // Average health score
    var healthSheet = ss.getSheetByName('System_Health');
    if (healthSheet && healthSheet.getLastRow() > 1) {
      var healthData = healthSheet.getRange(2, 2, healthSheet.getLastRow() - 1, 1).getValues();
      var sum = 0;
      for (var i = 0; i < healthData.length; i++) {
        sum += healthData[i][0] || 0;
      }
      stats.averageHealthScore = Math.round(sum / healthData.length);
    }
    
    return stats;
  } catch (e) {
    logError('Failed to gather monthly stats', { error: e.message });
    return {};
  }
}

/**
 * Builds HTML for daily report email
 * @param {Object} stats - Daily statistics
 * @param {Object} health - Health check result
 * @returns {string} HTML email body
 */
function buildDailyReportHTML(stats, health) {
  var html = '<html><head><style>';
  html += 'body { font-family: Arial, sans-serif; color: #333; }';
  html += '.container { max-width: 600px; margin: 0 auto; }';
  html += '.header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; }';
  html += '.content { background: #f9fafb; padding: 20px; }';
  html += '.stat-box { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #22c55e; }';
  html += '.stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }';
  html += '.stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }';
  html += '.health-good { color: #22c55e; }';
  html += '.health-warning { color: #f59e0b; }';
  html += '.health-critical { color: #ef4444; }';
  html += '.footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }';
  html += '</style></head><body>';
  
  html += '<div class="container">';
  html += '<div class="header">';
  html += '<h1 style="margin: 0;">Coverage Checker Daily Report</h1>';
  html += '<p style="margin: 5px 0 0 0; opacity: 0.9;">' + new Date().toLocaleDateString() + '</p>';
  html += '</div>';
  
  html += '<div class="content">';
  
  // System Health
  var healthClass = health.status === 'ok' ? 'health-good' : (health.status === 'warning' ? 'health-warning' : 'health-critical');
  html += '<div class="stat-box">';
  html += '<div class="stat-label">System Health</div>';
  html += '<div class="stat-value ' + healthClass + '">' + health.score + '% ' + health.status.toUpperCase() + '</div>';
  html += '</div>';
  
  // Today's Activity
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Coverage Checks Today</div>';
  html += '<div class="stat-value">' + stats.entriesToday + '</div>';
  html += '</div>';
  
  // Total Entries
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Total Coverage Checks</div>';
  html += '<div class="stat-value">' + stats.totalEntries + '</div>';
  html += '</div>';
  
  // Cache Performance
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Cache Hit Rate</div>';
  html += '<div class="stat-value">' + stats.cacheHitRate + '%</div>';
  html += '</div>';
  
  // Top Countries
  if (stats.topCountries && stats.topCountries.length > 0) {
    html += '<div class="stat-box">';
    html += '<div class="stat-label">Top 5 Countries</div>';
    html += '<ol style="margin: 10px 0 0 0; padding-left: 20px;">';
    for (var i = 0; i < Math.min(5, stats.topCountries.length); i++) {
      html += '<li>' + stats.topCountries[i][0] + ' (' + stats.topCountries[i][1] + ' checks)</li>';
    }
    html += '</ol>';
    html += '</div>';
  }
  
  html += '</div>';
  
  html += '<div class="footer">';
  html += 'Coverage Checker v2.0.0 • Autonomous System';
  html += '</div>';
  
  html += '</div></body></html>';
  
  return html;
}

/**
 * Builds HTML for weekly report email
 * @param {Object} stats - Weekly statistics
 * @param {Object} health - Health check result
 * @returns {string} HTML email body
 */
function buildWeeklyReportHTML(stats, health) {
  var html = '<html><head><style>';
  html += 'body { font-family: Arial, sans-serif; color: #333; }';
  html += '.container { max-width: 600px; margin: 0 auto; }';
  html += '.header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 20px; border-radius: 8px 8px 0 0; }';
  html += '.content { background: #f9fafb; padding: 20px; }';
  html += '.stat-box { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }';
  html += '.stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }';
  html += '.stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }';
  html += '.footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }';
  html += '</style></head><body>';
  
  html += '<div class="container">';
  html += '<div class="header">';
  html += '<h1 style="margin: 0;">Weekly Report</h1>';
  html += '<p style="margin: 5px 0 0 0; opacity: 0.9;">' + getWeekRange() + '</p>';
  html += '</div>';
  
  html += '<div class="content">';
  
  // Week's Activity
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Coverage Checks This Week</div>';
  html += '<div class="stat-value">' + stats.entriesThisWeek + '</div>';
  html += '</div>';
  
  // Average Health
  if (stats.healthHistory && stats.healthHistory.length > 0) {
    var avgHealth = stats.healthHistory.reduce(function(sum, h) { return sum + (h.score || 0); }, 0) / stats.healthHistory.length;
    html += '<div class="stat-box">';
    html += '<div class="stat-label">Average System Health</div>';
    html += '<div class="stat-value">' + Math.round(avgHealth) + '%</div>';
    html += '</div>';
  }
  
  // Cache Performance
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Cache Performance</div>';
  html += '<div class="stat-value">' + stats.cacheHitRate + '% Hit Rate</div>';
  html += '</div>';
  
  // Top Countries
  if (stats.topCountries && stats.topCountries.length > 0) {
    html += '<div class="stat-box">';
    html += '<div class="stat-label">Top 10 Countries</div>';
    html += '<ol style="margin: 10px 0 0 0; padding-left: 20px;">';
    for (var i = 0; i < stats.topCountries.length; i++) {
      html += '<li>' + stats.topCountries[i][0] + ' (' + stats.topCountries[i][1] + ')</li>';
    }
    html += '</ol>';
    html += '</div>';
  }
  
  html += '</div>';
  
  html += '<div class="footer">';
  html += 'Coverage Checker v2.0.0 • Weekly Maintenance Completed';
  html += '</div>';
  
  html += '</div></body></html>';
  
  return html;
}

/**
 * Builds HTML for monthly report email
 * @param {Object} stats - Monthly statistics
 * @param {Object} health - Health check result
 * @returns {string} HTML email body
 */
function buildMonthlyReportHTML(stats, health) {
  var monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  var html = '<html><head><style>';
  html += 'body { font-family: Arial, sans-serif; color: #333; }';
  html += '.container { max-width: 600px; margin: 0 auto; }';
  html += '.header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 20px; border-radius: 8px 8px 0 0; }';
  html += '.content { background: #f9fafb; padding: 20px; }';
  html += '.stat-box { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #8b5cf6; }';
  html += '.stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }';
  html += '.stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }';
  html += '.footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }';
  html += '</style></head><body>';
  
  html += '<div class="container">';
  html += '<div class="header">';
  html += '<h1 style="margin: 0;">Monthly Report</h1>';
  html += '<p style="margin: 5px 0 0 0; opacity: 0.9;">' + monthName + '</p>';
  html += '</div>';
  
  html += '<div class="content">';
  
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Coverage Checks This Month</div>';
  html += '<div class="stat-value">' + stats.entriesThisMonth + '</div>';
  html += '</div>';
  
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Unique Countries Checked</div>';
  html += '<div class="stat-value">' + stats.uniqueCountries + '</div>';
  html += '</div>';
  
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Total Operators Available</div>';
  html += '<div class="stat-value">' + stats.totalOperators + '</div>';
  html += '<p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">GSMA: ' + stats.gsmaOperators + ' • nPerf: ' + stats.nperfOperators + '</p>';
  html += '</div>';
  
  html += '<div class="stat-box">';
  html += '<div class="stat-label">Average System Health</div>';
  html += '<div class="stat-value">' + stats.averageHealthScore + '%</div>';
  html += '</div>';
  
  html += '</div>';
  
  html += '<div class="footer">';
  html += 'Coverage Checker v2.0.0 • Monthly Archive Completed';
  html += '</div>';
  
  html += '</div></body></html>';
  
  return html;
}

/**
 * Builds HTML for alert email
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Object} details - Additional details
 * @returns {string} HTML email body
 */
function buildAlertEmailHTML(title, message, details) {
  var html = '<html><head><style>';
  html += 'body { font-family: Arial, sans-serif; color: #333; }';
  html += '.container { max-width: 600px; margin: 0 auto; }';
  html += '.header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px 8px 0 0; }';
  html += '.content { background: #f9fafb; padding: 20px; }';
  html += '.alert-box { background: #fee2e2; border: 2px solid #ef4444; padding: 15px; margin: 10px 0; border-radius: 6px; }';
  html += '.footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }';
  html += '</style></head><body>';
  
  html += '<div class="container">';
  html += '<div class="header">';
  html += '<h1 style="margin: 0;">⚠️ ALERT</h1>';
  html += '<p style="margin: 5px 0 0 0; opacity: 0.9;">' + new Date().toLocaleString() + '</p>';
  html += '</div>';
  
  html += '<div class="content">';
  html += '<div class="alert-box">';
  html += '<h2 style="margin: 0 0 10px 0; color: #dc2626;">' + title + '</h2>';
  html += '<p style="margin: 0;">' + message + '</p>';
  html += '</div>';
  
  if (details) {
    html += '<h3>Details:</h3>';
    html += '<pre style="background: white; padding: 15px; border-radius: 6px; overflow-x: auto;">';
    html += JSON.stringify(details, null, 2);
    html += '</pre>';
  }
  
  html += '</div>';
  
  html += '<div class="footer">';
  html += 'Coverage Checker v2.0.0 • Alert System';
  html += '</div>';
  
  html += '</div></body></html>';
  
  return html;
}

/**
 * Gets week range string for reports
 * @returns {string} Week range (e.g., "Jan 1 - Jan 7, 2026")
 */
function getWeekRange() {
  var end = new Date();
  var start = new Date();
  start.setDate(end.getDate() - 6);
  
  var options = { month: 'short', day: 'numeric' };
  var startStr = start.toLocaleDateString('en-US', options);
  var endStr = end.toLocaleDateString('en-US', options) + ', ' + end.getFullYear();
  
  return startStr + ' - ' + endStr;
}
