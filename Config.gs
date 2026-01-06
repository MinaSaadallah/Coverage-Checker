/**
 * Centralized Configuration for Coverage Checker System
 * 
 * This file contains all configuration constants and settings for the autonomous
 * coverage checker system. Modify these values to customize system behavior.
 * 
 * @file Config.gs
 * @version 2.0.0
 */

/**
 * Configuration object containing all system settings
 * @const {Object}
 */
var CONFIG = {
  // ============================================================================
  // SPREADSHEET SETTINGS
  // ============================================================================
  
  /**
   * Spreadsheet ID for the Coverage Checker
   * IMPORTANT: Update this with your own Spreadsheet ID before deployment
   * To find your ID: Open your Google Sheet and look at the URL
   * Example: https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit
   * @type {string}
   */
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE', // TODO: Replace with your Spreadsheet ID
  
  /**
   * Example Spreadsheet ID (for reference only - DO NOT USE IN PRODUCTION)
   * @type {string}
   * @private
   */
  _EXAMPLE_SPREADSHEET_ID: '1byFsl37OEaHYjYEV2ObVWDoHC_VrBB0RSS9tet1s59E',
  
  /**
   * Sheet names used in the system
   * @type {Object}
   */
  SHEET_NAMES: {
    DATA: 'Data',
    ANALYTICS: 'Analytics',
    OPERATORS: 'Operators',
    TERRITORIES: 'Territories',
    GSMA_RAW: 'GSMA_Raw',
    COUNTRIES: 'Countries',
    DASHBOARD: 'Dashboard',
    SYSTEM_LOGS: 'System_Logs',
    SYSTEM_HEALTH: 'System_Health',
    SYNC_HISTORY: 'Sync_History'
  },
  
  // ============================================================================
  // CACHE SETTINGS
  // ============================================================================
  
  /**
   * Cache duration in seconds (6 hours = 21600 seconds)
   * @type {number}
   */
  CACHE_DURATION_SECONDS: 21600,
  
  /**
   * Maximum size for a single cache chunk in characters (90KB)
   * Apps Script cache limit is 100KB per key, use 90KB for safety
   * @type {number}
   */
  MAX_CACHE_CHUNK_SIZE: 90000,
  
  /**
   * Maximum number of cache chunks to check when removing
   * @type {number}
   */
  MAX_CACHE_CHUNKS_TO_CLEAR: 20,
  
  /**
   * Cache key prefixes for organization
   * @type {Object}
   */
  CACHE_KEYS: {
    OPERATORS: 'operators_data',
    OPERATORS_CHUNKS: 'operators_chunks',
    OPERATORS_CHUNK_PREFIX: 'operators_chunk_',
    COUNTRIES: 'countries_data',
    GSMA_RAW: 'gsma_raw_data',
    CACHE_STATS: 'cache_stats'
  },
  
  // ============================================================================
  // EMAIL SETTINGS
  // ============================================================================
  
  /**
   * Email recipient for reports and alerts
   * IMPORTANT: Update this with your email address before deployment
   * @type {string}
   */
  EMAIL_RECIPIENT: 'your.email@example.com', // TODO: Replace with your email
  
  /**
   * Example email address (for reference only - DO NOT USE IN PRODUCTION)
   * @type {string}
   * @private
   */
  _EXAMPLE_EMAIL: 'mina.saadallah@transcom.com',
  
  /**
   * Email subject prefixes
   * @type {Object}
   */
  EMAIL_SUBJECTS: {
    DAILY_REPORT: '[Coverage Checker] Daily Report',
    WEEKLY_REPORT: '[Coverage Checker] Weekly Report',
    ALERT: '[Coverage Checker] ALERT',
    MONTHLY_REPORT: '[Coverage Checker] Monthly Report'
  },
  
  /**
   * Quiet hours configuration (no alerts sent during these hours)
   * @type {Object}
   */
  QUIET_HOURS: {
    START: 22, // 10 PM
    END: 7     // 7 AM
  },
  
  // ============================================================================
  // EXTERNAL API SETTINGS
  // ============================================================================
  
  /**
   * GSMA feed URL for operator data
   * @type {string}
   */
  GSMA_FEED_URL: 'https://www.gsma.com/wp-content/uploads/feed.csv',
  
  /**
   * nPerf API URL for coverage data
   * @type {string}
   */
  NPERF_API_URL: 'https://www.nperf.com/en/map/get-isp-list-by-country',
  
  /**
   * REST Countries API URL for country names
   * @type {string}
   */
  COUNTRIES_API_URL: 'https://restcountries.com/v3.1/all?fields=cca2,name',
  
  /**
   * API request timeout in milliseconds
   * @type {number}
   */
  API_TIMEOUT: 5000,
  
  /**
   * Delay between nPerf API requests in milliseconds (rate limiting)
   * @type {number}
   */
  API_DELAY: 50,
  
  // ============================================================================
  // TRIGGER SETTINGS
  // ============================================================================
  
  /**
   * Trigger configuration for automated tasks
   * @type {Object}
   */
  TRIGGERS: {
    /**
     * Edit trigger debounce settings
     * @type {Object}
     */
    EDIT: {
      DEBOUNCE_WAIT: 3,      // Seconds to wait after last edit
      MINIMUM_INTERVAL: 10    // Minimum seconds between executions
    },
    
    /**
     * Quick health check interval (minutes)
     * @type {number}
     */
    HEALTH_CHECK_INTERVAL: 15,
    
    /**
     * External data refresh check interval (minutes)
     * @type {number}
     */
    DATA_CHECK_INTERVAL: 60,
    
    /**
     * Full analytics recalculation interval (hours)
     * @type {number}
     */
    ANALYTICS_INTERVAL: 6,
    
    /**
     * Daily report time (hour, 24-hour format)
     * @type {number}
     */
    DAILY_REPORT_HOUR: 8,
    
    /**
     * Weekly maintenance configuration
     * @type {Object}
     */
    WEEKLY: {
      DAY: ScriptApp.WeekDay.SUNDAY,
      HOUR: 3
    },
    
    /**
     * Monthly archive configuration
     * @type {Object}
     */
    MONTHLY: {
      DAY: 1,
      HOUR: 4
    }
  },
  
  // ============================================================================
  // DATA PROCESSING SETTINGS
  // ============================================================================
  
  /**
   * Batch size for nPerf country fetching (to stay under 6-minute limit)
   * @type {number}
   */
  NPERF_BATCH_SIZE: 50,
  
  /**
   * Maximum execution time in milliseconds (5.5 minutes, leaving buffer)
   * @type {number}
   */
  MAX_EXECUTION_TIME: 330000,
  
  /**
   * Duplicate detection window in milliseconds (5 seconds)
   * @type {number}
   */
  DUPLICATE_WINDOW_MS: 5000,
  
  /**
   * Maximum rows to check for duplicates
   * @type {number}
   */
  MAX_ROWS_TO_CHECK: 10,
  
  /**
   * Log retention period in days
   * @type {number}
   */
  LOG_RETENTION_DAYS: 30,
  
  /**
   * Data retention period in days
   * @type {number}
   */
  DATA_RETENTION_DAYS: 90,
  
  // ============================================================================
  // HEALTH CHECK SETTINGS
  // ============================================================================
  
  /**
   * Health score thresholds
   * @type {Object}
   */
  HEALTH_THRESHOLDS: {
    CRITICAL: 50,   // Below this triggers alert
    WARNING: 70,    // Below this shows warning
    GOOD: 85        // Above this is considered good
  },
  
  /**
   * Health check weights for scoring
   * @type {Object}
   */
  HEALTH_WEIGHTS: {
    SHEETS_EXIST: 20,
    TRIGGERS_INSTALLED: 20,
    DATA_FRESH: 20,
    CACHE_HEALTHY: 15,
    OPERATORS_LOADED: 15,
    EXTERNAL_APIS: 10
  },
  
  // ============================================================================
  // LOGGING SETTINGS
  // ============================================================================
  
  /**
   * Log levels
   * @type {Object}
   */
  LOG_LEVELS: {
    DEBUG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
    CRITICAL: 4
  },
  
  /**
   * Current log level (messages below this level are not logged)
   * @type {number}
   */
  CURRENT_LOG_LEVEL: 1, // INFO
  
  /**
   * Maximum log entries to keep in memory
   * @type {number}
   */
  MAX_LOG_ENTRIES: 1000,
  
  /**
   * Maximum health reports to retain in System_Health sheet
   * @type {number}
   */
  MAX_HEALTH_REPORTS: 100,
  
  /**
   * Minimum string length for fuzzy name matching
   * @type {number}
   */
  MIN_FUZZY_MATCH_LENGTH: 3,
  
  /**
   * Default max chunks to clear (fallback value)
   * @type {number}
   */
  DEFAULT_MAX_CHUNKS: 20,
  
  /**
   * API health check timeout in milliseconds
   * @type {number}
   */
  API_HEALTH_CHECK_TIMEOUT: 2000,
  
  // ============================================================================
  // VERSION INFORMATION
  // ============================================================================
  
  /**
   * System version
   * @type {string}
   */
  VERSION: '2.0.0',
  
  /**
   * Last updated timestamp
   * @type {string}
   */
  LAST_UPDATED: '2026-01-06'
};

/**
 * Gets the spreadsheet configuration
 * @returns {Object} Spreadsheet configuration
 */
function getSpreadsheetConfig() {
  return {
    id: CONFIG.SPREADSHEET_ID,
    sheetNames: CONFIG.SHEET_NAMES
  };
}

/**
 * Gets cache configuration
 * @returns {Object} Cache configuration
 */
function getCacheConfig() {
  return {
    duration: CONFIG.CACHE_DURATION_SECONDS,
    maxChunkSize: CONFIG.MAX_CACHE_CHUNK_SIZE,
    keys: CONFIG.CACHE_KEYS
  };
}

/**
 * Gets email configuration
 * @returns {Object} Email configuration
 */
function getEmailConfig() {
  return {
    recipient: CONFIG.EMAIL_RECIPIENT,
    subjects: CONFIG.EMAIL_SUBJECTS,
    quietHours: CONFIG.QUIET_HOURS
  };
}

/**
 * Gets API configuration
 * @returns {Object} API configuration
 */
function getAPIConfig() {
  return {
    gsmaUrl: CONFIG.GSMA_FEED_URL,
    nperfUrl: CONFIG.NPERF_API_URL,
    countriesUrl: CONFIG.COUNTRIES_API_URL,
    timeout: CONFIG.API_TIMEOUT,
    delay: CONFIG.API_DELAY
  };
}

/**
 * Gets trigger configuration
 * @returns {Object} Trigger configuration
 */
function getTriggerConfig() {
  return CONFIG.TRIGGERS;
}

/**
 * Gets health check configuration
 * @returns {Object} Health check configuration
 */
function getHealthConfig() {
  return {
    thresholds: CONFIG.HEALTH_THRESHOLDS,
    weights: CONFIG.HEALTH_WEIGHTS
  };
}

/**
 * Gets logging configuration
 * @returns {Object} Logging configuration
 */
function getLoggingConfig() {
  return {
    levels: CONFIG.LOG_LEVELS,
    currentLevel: CONFIG.CURRENT_LOG_LEVEL,
    maxEntries: CONFIG.MAX_LOG_ENTRIES,
    retentionDays: CONFIG.LOG_RETENTION_DAYS
  };
}

/**
 * Checks if current time is within quiet hours
 * @returns {boolean} True if in quiet hours, false otherwise
 */
function isQuietHours() {
  var now = new Date();
  var hour = now.getHours();
  var start = CONFIG.QUIET_HOURS.START;
  var end = CONFIG.QUIET_HOURS.END;
  
  if (start > end) {
    // Quiet hours span midnight
    return hour >= start || hour < end;
  } else {
    return hour >= start && hour < end;
  }
}

/**
 * Gets system version information
 * @returns {Object} Version information
 */
function getVersionInfo() {
  return {
    version: CONFIG.VERSION,
    lastUpdated: CONFIG.LAST_UPDATED
  };
}
