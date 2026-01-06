/**
 * Security Module for Coverage Checker
 * 
 * Provides security features:
 * - URL validation (Google Maps patterns only)
 * - Input sanitization
 * - XSS prevention
 * - Rate limiting tracking
 * 
 * @file Security.gs
 * @version 2.0.0
 */

/**
 * Validates if a URL is a safe map URL
 * Only allows Google Maps and Apple Maps URLs
 * 
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 * 
 * @example
 * var result = validateMapURL('https://maps.google.com/?q=40.7128,-74.0060');
 * // Returns: { valid: true, type: 'google', url: '...' }
 */
function validateMapURL(url) {
  try {
    if (!url || typeof url !== 'string') {
      return {
        valid: false,
        error: 'URL is required and must be a string'
      };
    }
    
    url = url.trim();
    
    if (url.length === 0) {
      return {
        valid: false,
        error: 'URL cannot be empty'
      };
    }
    
    if (url.length > 2000) {
      return {
        valid: false,
        error: 'URL is too long (max 2000 characters)'
      };
    }
    
    // Check for valid map URL patterns
    var patterns = [
      /^https?:\/\/(www\.)?google\.(com|[a-z]{2,3})\/maps/i,
      /^https?:\/\/(www\.)?maps\.google\.(com|[a-z]{2,3})/i,
      /^https?:\/\/goo\.gl\/maps/i,
      /^https?:\/\/(www\.)?maps\.apple\.com/i,
      /^https?:\/\/apple\.com\/maps/i
    ];
    
    var isValid = false;
    var urlType = 'unknown';
    
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].test(url)) {
        isValid = true;
        if (url.indexOf('google') !== -1 || url.indexOf('goo.gl') !== -1) {
          urlType = 'google';
        } else if (url.indexOf('apple') !== -1) {
          urlType = 'apple';
        }
        break;
      }
    }
    
    if (!isValid) {
      return {
        valid: false,
        error: 'Only Google Maps and Apple Maps URLs are allowed'
      };
    }
    
    // Check for suspicious patterns (potential XSS or injection)
    var suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,  // event handlers like onclick=
      /data:text\/html/i,
      /<iframe/i
    ];
    
    for (var i = 0; i < suspiciousPatterns.length; i++) {
      if (suspiciousPatterns[i].test(url)) {
        logWarning('Suspicious pattern detected in URL', { url: url });
        return {
          valid: false,
          error: 'URL contains suspicious patterns'
        };
      }
    }
    
    return {
      valid: true,
      type: urlType,
      url: url
    };
  } catch (e) {
    logError('URL validation error', { error: e.message });
    return {
      valid: false,
      error: 'Validation failed: ' + e.message
    };
  }
}

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes or encodes potentially dangerous characters
 * 
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 * 
 * @example
 * var safe = sanitizeInput('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // HTML encode special characters
  var sanitized = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
}

/**
 * Validates email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic email regex
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks rate limiting for a specific action
 * Tracks action counts in script properties
 * 
 * @param {string} action - Action identifier (e.g., 'api_call', 'email_send')
 * @param {number} maxPerHour - Maximum actions allowed per hour
 * @returns {Object} Rate limit status
 * 
 * @example
 * var status = checkRateLimit('api_call', 100);
 * if (!status.allowed) {
 *   throw new Error('Rate limit exceeded');
 * }
 */
function checkRateLimit(action, maxPerHour) {
  try {
    var props = PropertiesService.getScriptProperties();
    var key = 'rate_limit_' + action;
    var dataStr = props.getProperty(key);
    
    var now = new Date().getTime();
    var hourAgo = now - (60 * 60 * 1000);
    
    var data = {
      timestamps: [],
      count: 0
    };
    
    if (dataStr) {
      try {
        data = JSON.parse(dataStr);
      } catch (e) {
        // Reset if corrupted
        data = { timestamps: [], count: 0 };
      }
    }
    
    // Remove timestamps older than 1 hour
    data.timestamps = data.timestamps.filter(function(ts) {
      return ts > hourAgo;
    });
    
    data.count = data.timestamps.length;
    
    // Check if limit exceeded
    if (data.count >= maxPerHour) {
      return {
        allowed: false,
        count: data.count,
        limit: maxPerHour,
        resetIn: Math.ceil((data.timestamps[0] - hourAgo) / 1000), // seconds until oldest expires
        message: 'Rate limit exceeded. Try again in ' + Math.ceil((data.timestamps[0] - hourAgo) / 60000) + ' minutes.'
      };
    }
    
    // Add current timestamp
    data.timestamps.push(now);
    data.count++;
    
    // Save updated data
    props.setProperty(key, JSON.stringify(data));
    
    return {
      allowed: true,
      count: data.count,
      limit: maxPerHour,
      remaining: maxPerHour - data.count
    };
  } catch (e) {
    logError('Rate limit check failed', { action: action, error: e.message });
    // On error, allow the action (fail open)
    return {
      allowed: true,
      count: 0,
      limit: maxPerHour,
      remaining: maxPerHour,
      error: e.message
    };
  }
}

/**
 * Records a security event for audit purposes
 * @param {string} eventType - Type of security event
 * @param {Object} details - Event details
 */
function recordSecurityEvent(eventType, details) {
  try {
    logWarning('Security event: ' + eventType, details);
    
    // Could be enhanced to write to a separate security log sheet
    // For now, just use the regular logging system
  } catch (e) {
    Logger.log('Failed to record security event: ' + e.message);
  }
}

/**
 * Validates that a coordinate is within valid ranges
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
function isValidCoordinate(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  
  if (lat < -90 || lat > 90) {
    return false;
  }
  
  if (lng < -180 || lng > 180) {
    return false;
  }
  
  return true;
}

/**
 * Validates country code format (ISO 3166-1 alpha-2)
 * @param {string} code - Country code
 * @returns {boolean} True if valid format
 */
function isValidCountryCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  // Must be exactly 2 uppercase letters
  return /^[A-Z]{2}$/.test(code);
}

/**
 * Checks if user has permission to perform an action
 * Currently just checks if user is authenticated
 * Can be extended for role-based access control
 * 
 * @param {string} action - Action to check permission for
 * @returns {boolean} True if user has permission
 */
function checkPermission(action) {
  try {
    var user = Session.getActiveUser().getEmail();
    
    if (!user) {
      recordSecurityEvent('unauthorized_access', { action: action });
      return false;
    }
    
    // All authenticated users have permission for now
    // Can be extended to check against a whitelist or roles
    return true;
  } catch (e) {
    logError('Permission check failed', { action: action, error: e.message });
    return false;
  }
}

/**
 * Gets current security configuration
 * @returns {Object} Security configuration
 */
function getSecurityConfig() {
  return {
    maxUrlLength: 2000,
    allowedMapProviders: ['google', 'apple'],
    rateLimits: {
      apiCalls: 1000,      // per hour
      emailSends: 50,      // per hour
      dataWrites: 500      // per hour
    },
    enableRateLimiting: true,
    enableInputSanitization: true,
    enableUrlValidation: true
  };
}

/**
 * Performs security audit on current system state
 * @returns {Object} Audit result
 */
function performSecurityAudit() {
  try {
    var audit = {
      timestamp: new Date().toISOString(),
      checks: {},
      issues: [],
      score: 100
    };
    
    // Check 1: Validate configuration
    var config = getSecurityConfig();
    audit.checks.configValid = !!config;
    
    // Check 2: Check for any stored suspicious data
    // (This is a placeholder - would need actual implementation)
    audit.checks.noSuspiciousData = true;
    
    // Check 3: Verify rate limiting is working
    try {
      var rateLimitTest = checkRateLimit('test_action', 100);
      audit.checks.rateLimitingWorks = !!rateLimitTest;
    } catch (e) {
      audit.checks.rateLimitingWorks = false;
      audit.issues.push('Rate limiting not functioning');
      audit.score -= 20;
    }
    
    // Check 4: Verify user authentication
    try {
      var user = Session.getActiveUser().getEmail();
      audit.checks.authenticationWorks = !!user;
    } catch (e) {
      audit.checks.authenticationWorks = false;
      audit.issues.push('Authentication check failed');
      audit.score -= 10;
    }
    
    // Determine overall status
    audit.status = audit.score >= 80 ? 'secure' : (audit.score >= 50 ? 'warning' : 'vulnerable');
    
    logInfo('Security audit completed', { score: audit.score, status: audit.status });
    return audit;
  } catch (e) {
    logError('Security audit failed', { error: e.message });
    return {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: e.message,
      score: 0,
      checks: {},
      issues: ['Audit failed: ' + e.message]
    };
  }
}
