/**
 * Analytics Module for Coverage Checker
 * 
 * Provides analytics calculations and dashboard updates:
 * - Country analytics refresh
 * - Dashboard statistics
 * - Trend analysis
 * 
 * @file Analytics.gs
 * @version 2.0.0
 */

/**
 * Updates the dashboard with current statistics
 * Should be called periodically to keep dashboard fresh
 */
function updateDashboard() {
  try {
    logInfo('Updating dashboard');
    
    var ss = getSpreadsheet();
    if (!ss) return;
    
    var dashboard = ss.getSheetByName('Dashboard');
    if (!dashboard) {
      createDashboardSheet(ss);
      dashboard = ss.getSheetByName('Dashboard');
    }
    
    if (!dashboard) return;
    
    // Gather statistics
    var stats = gatherDashboardStats();
    
    // Update values (starting at row 4, column 2)
    var values = [
      [stats.totalEntries],
      [stats.totalCountries],
      [stats.totalOperators],
      [stats.healthScore + '%'],
      [stats.cacheHitRate + '%'],
      [stats.lastDataSync],
      [stats.gsmaOperators],
      [stats.nperfOperators],
      [stats.systemVersion],
      [stats.uptimeDays + ' days']
    ];
    
    dashboard.getRange(4, 2, values.length, 1).setValues(values);
    
    // Add last updated timestamp
    dashboard.getRange(15, 1, 1, 2).setValues([['Last Updated:', new Date().toLocaleString()]]);
    
    logInfo('Dashboard updated successfully');
  } catch (e) {
    logError('Dashboard update failed', { error: e.message });
  }
}

/**
 * Gathers statistics for dashboard
 * @returns {Object} Dashboard statistics
 */
function gatherDashboardStats() {
  var stats = {
    totalEntries: 0,
    totalCountries: 0,
    totalOperators: 0,
    healthScore: 0,
    cacheHitRate: 0,
    lastDataSync: 'Never',
    gsmaOperators: 0,
    nperfOperators: 0,
    systemVersion: '2.0.0',
    uptimeDays: 0
  };
  
  try {
    var ss = getSpreadsheet();
    if (!ss) return stats;
    
    // Total entries from Data sheet
    var dataSheet = ss.getSheetByName('Data');
    if (dataSheet && dataSheet.getLastRow() > 1) {
      stats.totalEntries = dataSheet.getLastRow() - 1;
    }
    
    // Total countries from Analytics
    var analyticsSheet = ss.getSheetByName('Analytics');
    if (analyticsSheet && analyticsSheet.getLastRow() > 1) {
      stats.totalCountries = analyticsSheet.getLastRow() - 1;
    }
    
    // Operators
    var operators = getOperators();
    if (operators) {
      stats.totalOperators = operators.length;
      stats.gsmaOperators = operators.filter(function(op) { return op.gsmaId; }).length;
      stats.nperfOperators = operators.filter(function(op) { 
        return op.operatorId && String(op.operatorId).indexOf('GSMA_') === -1; 
      }).length;
    }
    
    // Health score
    var health = quickHealthCheck();
    stats.healthScore = health.score || 0;
    
    // Cache hit rate
    stats.cacheHitRate = getCacheHitRate();
    
    // Last data sync
    var gsmaData = cacheGet('gsma_raw_data');
    if (gsmaData) {
      stats.lastDataSync = 'Recently';
    }
    
    // System version
    if (typeof getVersionInfo === 'function') {
      var versionInfo = getVersionInfo();
      stats.systemVersion = versionInfo.version;
    }
    
    // Calculate uptime (days since system installation)
    // This is a simple estimate based on oldest health record
    var healthSheet = ss.getSheetByName('System_Health');
    if (healthSheet && healthSheet.getLastRow() > 1) {
      var firstRecord = healthSheet.getRange(2, 1).getValue();
      if (firstRecord) {
        var daysSince = Math.floor((new Date() - new Date(firstRecord)) / (1000 * 60 * 60 * 24));
        stats.uptimeDays = daysSince;
      }
    }
  } catch (e) {
    logError('Failed to gather dashboard stats', { error: e.message });
  }
  
  return stats;
}

/**
 * Analyzes trends in coverage check data
 * @param {number} days - Number of days to analyze (default: 7)
 * @returns {Object} Trend analysis
 */
function analyzeTrends(days) {
  try {
    days = days || 7;
    
    var ss = getSpreadsheet();
    if (!ss) return null;
    
    var dataSheet = ss.getSheetByName('Data');
    if (!dataSheet || dataSheet.getLastRow() <= 1) {
      return {
        trend: 'no_data',
        dailyAverage: 0,
        growingCountries: [],
        decliningCountries: []
      };
    }
    
    var cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    var data = dataSheet.getRange(2, 2, dataSheet.getLastRow() - 1, 3).getValues(); // Timestamp, Source, Link
    
    // Filter data for the period
    var periodData = data.filter(function(row) {
      var date = new Date(row[0]);
      return date >= cutoffDate;
    });
    
    var trend = {
      period: days + ' days',
      totalChecks: periodData.length,
      dailyAverage: Math.round(periodData.length / days),
      sourceBreakdown: {
        nperf: 0,
        gsma: 0
      }
    };
    
    // Count by source
    periodData.forEach(function(row) {
      var source = String(row[1]).toLowerCase();
      if (source === 'nperf') {
        trend.sourceBreakdown.nperf++;
      } else if (source === 'gsma') {
        trend.sourceBreakdown.gsma++;
      }
    });
    
    return trend;
  } catch (e) {
    logError('Trend analysis failed', { error: e.message });
    return null;
  }
}

/**
 * Exports analytics data to JSON format
 * Useful for external reporting or backup
 * 
 * @returns {Object} Complete analytics export
 */
function exportAnalyticsData() {
  try {
    var ss = getSpreadsheet();
    if (!ss) return null;
    
    var export_data = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      dashboard: gatherDashboardStats(),
      trends: analyzeTrends(30),
      countries: []
    };
    
    // Get country analytics
    var analyticsSheet = ss.getSheetByName('Analytics');
    if (analyticsSheet && analyticsSheet.getLastRow() > 1) {
      var countryData = analyticsSheet.getRange(2, 7, analyticsSheet.getLastRow() - 1, 2).getValues();
      export_data.countries = countryData.map(function(row) {
        return {
          country: row[0],
          count: row[1]
        };
      });
    }
    
    return export_data;
  } catch (e) {
    logError('Analytics export failed', { error: e.message });
    return null;
  }
}
