/**
 * Smart Multi-Tier Caching System for Coverage Checker
 * 
 * This module implements a sophisticated 4-tier caching system:
 * - Tier 1: In-memory cache (fastest, resets each execution)
 * - Tier 2: Script Cache (CacheService, 6-hour TTL)
 * - Tier 3: Script Properties (persistent, up to 500KB)
 * - Tier 4: Sheet-based cache (permanent storage)
 * 
 * Features:
 * - Automatic tier fallback
 * - Large data chunking (>100KB split into 90KB chunks)
 * - Cache warming on startup
 * - Hit/miss statistics tracking
 * - Auto-expiration with configurable TTLs
 * 
 * @file SmartCache.gs
 * @version 2.0.0
 */

// In-memory cache (Tier 1) - fastest but temporary
var memoryCache = {};

/**
 * Gets data from cache using all available tiers
 * @param {string} key - Cache key
 * @returns {*} Cached data or null if not found
 * 
 * @example
 * var operators = cacheGet('operators_data');
 */
function cacheGet(key) {
  try {
    // Tier 1: Memory cache (fastest)
    if (memoryCache[key]) {
      recordCacheHit('memory', key);
      return memoryCache[key];
    }
    
    // Tier 2: Script Cache
    var scriptCache = CacheService.getScriptCache();
    var cached = scriptCache.get(key);
    if (cached) {
      try {
        var data = JSON.parse(cached);
        memoryCache[key] = data; // Promote to memory
        recordCacheHit('script', key);
        return data;
      } catch (e) {
        // Check for chunked data
        var chunkCount = scriptCache.get(key + '_chunks');
        if (chunkCount) {
          var chunks = [];
          var count = parseInt(chunkCount, 10);
          for (var i = 0; i < count; i++) {
            var chunk = scriptCache.get(key + '_chunk_' + i);
            if (!chunk) {
              recordCacheMiss(key);
              return null;
            }
            chunks.push(chunk);
          }
          var data = JSON.parse(chunks.join(''));
          memoryCache[key] = data; // Promote to memory
          recordCacheHit('script_chunked', key);
          return data;
        }
      }
    }
    
    // Tier 3: Properties
    var props = PropertiesService.getScriptProperties();
    var stored = props.getProperty(key);
    if (stored) {
      try {
        var data = JSON.parse(stored);
        memoryCache[key] = data; // Promote to memory
        cachePutScriptCache(key, data); // Promote to script cache
        recordCacheHit('properties', key);
        return data;
      } catch (e) {
        // Invalid data
      }
    }
    
    // Tier 4: Sheet-based cache (not implemented in this version for performance)
    // Could be added for very large datasets
    
    recordCacheMiss(key);
    return null;
  } catch (e) {
    logError('Cache get error for key: ' + key, { error: e.message });
    recordCacheMiss(key);
    return null;
  }
}

/**
 * Stores data in cache across all tiers
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} True if successfully cached
 * 
 * @example
 * cachePut('operators_data', operatorsArray, 21600);
 */
function cachePut(key, data, ttl) {
  try {
    if (!data) return false;
    
    var config = typeof getCacheConfig === 'function' ? getCacheConfig() : {
      duration: 21600,
      maxChunkSize: 90000
    };
    
    ttl = ttl || config.duration;
    
    // Tier 1: Memory
    memoryCache[key] = data;
    
    // Tier 2: Script Cache
    cachePutScriptCache(key, data, ttl);
    
    // Tier 3: Properties (for smaller data only)
    var json = JSON.stringify(data);
    if (json.length < 500000) { // 500KB limit
      try {
        PropertiesService.getScriptProperties().setProperty(key, json);
      } catch (e) {
        logWarning('Failed to cache in properties', { key: key, error: e.message });
      }
    }
    
    return true;
  } catch (e) {
    logError('Cache put error for key: ' + key, { error: e.message });
    return false;
  }
}

/**
 * Stores data in Script Cache with chunking support
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} ttl - Time to live in seconds
 */
function cachePutScriptCache(key, data, ttl) {
  try {
    var config = typeof getCacheConfig === 'function' ? getCacheConfig() : {
      maxChunkSize: 90000
    };
    
    var cache = CacheService.getScriptCache();
    var json = JSON.stringify(data);
    
    if (json.length < config.maxChunkSize) {
      // Small data - store directly
      cache.put(key, json, ttl);
    } else {
      // Large data - chunk it
      var chunks = [];
      for (var i = 0; i < json.length; i += config.maxChunkSize) {
        chunks.push(json.substring(i, i + config.maxChunkSize));
      }
      
      cache.put(key + '_chunks', String(chunks.length), ttl);
      for (var i = 0; i < chunks.length; i++) {
        cache.put(key + '_chunk_' + i, chunks[i], ttl);
      }
      
      logDebug('Cached large data in chunks', { key: key, chunks: chunks.length, size: json.length });
    }
  } catch (e) {
    logWarning('Script cache put failed', { key: key, error: e.message });
  }
}

/**
 * Removes data from all cache tiers
 * @param {string} key - Cache key to remove
 * @returns {boolean} True if successful
 */
function cacheRemove(key) {
  try {
    // Tier 1: Memory
    delete memoryCache[key];
    
    // Tier 2: Script Cache
    var cache = CacheService.getScriptCache();
    cache.remove(key);
    cache.remove(key + '_chunks');
    
    // Get max chunks from config
    var config = typeof CONFIG !== 'undefined' ? CONFIG : { 
      MAX_CACHE_CHUNKS_TO_CLEAR: 20,
      DEFAULT_MAX_CHUNKS: 20
    };
    var maxChunks = config.MAX_CACHE_CHUNKS_TO_CLEAR || config.DEFAULT_MAX_CHUNKS;
    
    // Remove up to maxChunks possible chunks
    for (var i = 0; i < maxChunks; i++) {
      cache.remove(key + '_chunk_' + i);
    }
    
    // Tier 3: Properties
    PropertiesService.getScriptProperties().deleteProperty(key);
    
    return true;
  } catch (e) {
    logError('Cache remove error', { key: key, error: e.message });
    return false;
  }
}

/**
 * Clears all caches (use with caution!)
 * @returns {boolean} True if successful
 */
function cacheClearAll() {
  try {
    // Clear memory
    memoryCache = {};
    
    // Clear script cache
    CacheService.getScriptCache().removeAll(['operators_data', 'operators_chunks', 'countries_data', 'gsma_raw_data', 'cache_stats']);
    
    // Clear specific properties (don't clear all to preserve system settings)
    var props = PropertiesService.getScriptProperties();
    props.deleteProperty('operators_json');
    props.deleteProperty('countries_data');
    props.deleteProperty('gsma_raw_data');
    
    logInfo('All caches cleared');
    return true;
  } catch (e) {
    logError('Cache clear all error', { error: e.message });
    return false;
  }
}

/**
 * Records a cache hit for statistics
 * @param {string} tier - Cache tier (memory, script, properties)
 * @param {string} key - Cache key
 */
function recordCacheHit(tier, key) {
  try {
    var stats = getCacheStats();
    stats.hits = (stats.hits || 0) + 1;
    stats.hitsByTier = stats.hitsByTier || {};
    stats.hitsByTier[tier] = (stats.hitsByTier[tier] || 0) + 1;
    stats.lastHit = new Date().toISOString();
    stats.lastHitKey = key;
    saveCacheStats(stats);
  } catch (e) {
    // Silent fail - stats are not critical
  }
}

/**
 * Records a cache miss for statistics
 * @param {string} key - Cache key
 */
function recordCacheMiss(key) {
  try {
    var stats = getCacheStats();
    stats.misses = (stats.misses || 0) + 1;
    stats.lastMiss = new Date().toISOString();
    stats.lastMissKey = key;
    saveCacheStats(stats);
  } catch (e) {
    // Silent fail - stats are not critical
  }
}

/**
 * Gets cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  try {
    var props = PropertiesService.getScriptProperties();
    var statsJson = props.getProperty('cache_stats');
    if (statsJson) {
      return JSON.parse(statsJson);
    }
  } catch (e) {
    // Return default stats
  }
  
  return {
    hits: 0,
    misses: 0,
    hitsByTier: {},
    lastHit: null,
    lastHitKey: null,
    lastMiss: null,
    lastMissKey: null
  };
}

/**
 * Saves cache statistics
 * @param {Object} stats - Statistics object
 */
function saveCacheStats(stats) {
  try {
    var props = PropertiesService.getScriptProperties();
    props.setProperty('cache_stats', JSON.stringify(stats));
  } catch (e) {
    // Silent fail
  }
}

/**
 * Calculates cache hit rate
 * @returns {number} Hit rate as percentage (0-100)
 */
function getCacheHitRate() {
  try {
    var stats = getCacheStats();
    var total = stats.hits + stats.misses;
    if (total === 0) return 0;
    return Math.round((stats.hits / total) * 100);
  } catch (e) {
    return 0;
  }
}

/**
 * Warms up cache with commonly used data
 * Call this on system startup or after cache clear
 * 
 * @example
 * warmupCache();
 */
function warmupCache() {
  try {
    logInfo('Starting cache warmup');
    
    // Warm up operators data
    var operators = getOperators();
    if (operators && operators.length > 0) {
      cachePut('operators_data', operators);
      logInfo('Warmed up operators cache', { count: operators.length });
    }
    
    // Warm up country names if available
    if (typeof COUNTRY_CODE_TO_NAME !== 'undefined') {
      cachePut('countries_data', COUNTRY_CODE_TO_NAME);
      logInfo('Warmed up countries cache');
    }
    
    logInfo('Cache warmup completed');
    return true;
  } catch (e) {
    logError('Cache warmup error', { error: e.message });
    return false;
  }
}

/**
 * Gets cache health status
 * @returns {Object} Health status with score and details
 */
function getCacheHealth() {
  try {
    var stats = getCacheStats();
    var hitRate = getCacheHitRate();
    
    var health = {
      score: 100,
      status: 'healthy',
      hitRate: hitRate,
      totalRequests: stats.hits + stats.misses,
      issues: []
    };
    
    // Check hit rate
    if (hitRate < 30) {
      health.score -= 40;
      health.issues.push('Low cache hit rate: ' + hitRate + '%');
    } else if (hitRate < 50) {
      health.score -= 20;
      health.issues.push('Below average cache hit rate: ' + hitRate + '%');
    }
    
    // Check if cache is empty
    if (stats.hits === 0 && stats.misses === 0) {
      health.score = 0;
      health.status = 'empty';
      health.issues.push('Cache is empty - run warmupCache()');
    }
    
    // Determine status
    if (health.score >= 80) {
      health.status = 'healthy';
    } else if (health.score >= 50) {
      health.status = 'warning';
    } else {
      health.status = 'critical';
    }
    
    return health;
  } catch (e) {
    return {
      score: 0,
      status: 'error',
      hitRate: 0,
      totalRequests: 0,
      issues: ['Failed to get cache health: ' + e.message]
    };
  }
}

/**
 * Resets cache statistics
 */
function resetCacheStats() {
  try {
    PropertiesService.getScriptProperties().deleteProperty('cache_stats');
    logInfo('Cache statistics reset');
    return true;
  } catch (e) {
    logError('Failed to reset cache stats', { error: e.message });
    return false;
  }
}

/**
 * Gets cache size information (approximate)
 * @returns {Object} Size information for each tier
 */
function getCacheSizes() {
  try {
    var sizes = {
      memory: 0,
      properties: 0,
      script: 'N/A' // Script cache doesn't expose size
    };
    
    // Memory cache size (rough estimate)
    try {
      sizes.memory = JSON.stringify(memoryCache).length;
    } catch (e) {
      sizes.memory = 'Error';
    }
    
    // Properties size
    try {
      var props = PropertiesService.getScriptProperties();
      var allProps = props.getProperties();
      var totalSize = 0;
      for (var key in allProps) {
        totalSize += allProps[key].length;
      }
      sizes.properties = totalSize;
    } catch (e) {
      sizes.properties = 'Error';
    }
    
    return sizes;
  } catch (e) {
    return { error: e.message };
  }
}
