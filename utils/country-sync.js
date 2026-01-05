/**
 * Country Name Synchronization Utility
 * 
 * Ensures country names are synchronized between data-fetcher.js and index.html
 * by using COUNTRY_NAME_MAP as the single source of truth.
 * 
 * @module utils/country-sync
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Extracts country name mapping from data-fetcher.js
 * @returns {Object} Object mapping country codes to names
 */
function extractCountryNameMapFromDataFetcher() {
  const dataFetcherPath = path.join(__dirname, '..', 'data-fetcher.js');
  const content = fs.readFileSync(dataFetcherPath, 'utf-8');
  
  // Extract COUNTRY_NAME_MAP
  const mapMatch = content.match(/const COUNTRY_NAME_MAP = \{([^}]+)\}/s);
  if (!mapMatch) {
    throw new Error('Could not find COUNTRY_NAME_MAP in data-fetcher.js');
  }
  
  const countryMapStr = mapMatch[1];
  const countryMapEntries = countryMapStr.match(/"([^"]+)":\s*"([A-Z]{2})"/g);
  
  const codeToName = {};
  countryMapEntries.forEach(entry => {
    const [, name, code] = entry.match(/"([^"]+)":\s*"([A-Z]{2})"/);
    codeToName[code] = name;
  });
  
  return codeToName;
}

/**
 * Extracts COUNTRY_NAMES from index.html
 * @returns {Object} Object mapping country codes to names
 */
function extractCountryNamesFromIndexHtml() {
  const indexHtmlPath = path.join(__dirname, '..', 'index.html');
  const content = fs.readFileSync(indexHtmlPath, 'utf-8');
  
  const match = content.match(/var COUNTRY_NAMES = \{([^}]+)\}/s);
  if (!match) {
    throw new Error('Could not find COUNTRY_NAMES in index.html');
  }
  
  const countryNamesStr = match[1];
  const countryNamesEntries = countryNamesStr.match(/([A-Z]{2}):\s*"([^"]+)"/g);
  
  const countryNames = {};
  countryNamesEntries.forEach(entry => {
    const [, code, name] = entry.match(/([A-Z]{2}):\s*"([^"]+)"/);
    countryNames[code] = name;
  });
  
  return countryNames;
}

/**
 * Validates country names and returns missing entries
 * @returns {Object} Object with validation results
 */
function validateCountryNames() {
  logger.info('Validating country names...');
  
  const sourceMap = extractCountryNameMapFromDataFetcher();
  const targetMap = extractCountryNamesFromIndexHtml();
  
  const missing = [];
  const extra = [];
  const mismatched = [];
  
  // Check for missing and mismatched
  Object.keys(sourceMap).forEach(code => {
    if (!targetMap[code]) {
      missing.push({ code, name: sourceMap[code] });
    } else if (targetMap[code] !== sourceMap[code]) {
      mismatched.push({ 
        code, 
        source: sourceMap[code], 
        target: targetMap[code] 
      });
    }
  });
  
  // Check for extra entries in target
  Object.keys(targetMap).forEach(code => {
    if (!sourceMap[code]) {
      extra.push({ code, name: targetMap[code] });
    }
  });
  
  return {
    isValid: missing.length === 0 && mismatched.length === 0,
    missing,
    extra,
    mismatched,
    sourceCount: Object.keys(sourceMap).length,
    targetCount: Object.keys(targetMap).length
  };
}

/**
 * Formats country names object for insertion into index.html
 * @param {Object} countryMap - Object mapping codes to names
 * @returns {string} Formatted string for COUNTRY_NAMES object
 */
function formatCountryNames(countryMap) {
  const codes = Object.keys(countryMap).sort();
  const lines = [];
  let currentLine = '';
  
  codes.forEach((code, index) => {
    const name = countryMap[code];
    const entry = `${code}: "${name}"`;
    
    // Add to current line
    if (currentLine.length === 0) {
      currentLine = entry;
    } else if (currentLine.length + entry.length + 2 < 100) {
      currentLine += ', ' + entry;
    } else {
      lines.push(currentLine + ',');
      currentLine = entry;
    }
  });
  
  // Add last line without trailing comma
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines.join('\n    ');
}

/**
 * Synchronizes country names from data-fetcher.js to index.html
 * @returns {boolean} True if synchronization was successful
 */
function syncCountryNames() {
  logger.info('Starting country name synchronization...');
  
  try {
    // Extract source data
    const sourceMap = extractCountryNameMapFromDataFetcher();
    logger.info(`Found ${Object.keys(sourceMap).length} countries in data-fetcher.js`);
    
    // Read index.html
    const indexHtmlPath = path.join(__dirname, '..', 'index.html');
    let content = fs.readFileSync(indexHtmlPath, 'utf-8');
    
    // Find and replace COUNTRY_NAMES
    const match = content.match(/var COUNTRY_NAMES = \{[^}]+\}/s);
    if (!match) {
      throw new Error('Could not find COUNTRY_NAMES in index.html');
    }
    
    const formattedCountries = formatCountryNames(sourceMap);
    const newCountryNames = `var COUNTRY_NAMES = {\n    ${formattedCountries}\n}`;
    
    content = content.replace(/var COUNTRY_NAMES = \{[^}]+\}/s, newCountryNames);
    
    // Write back to file
    fs.writeFileSync(indexHtmlPath, content, 'utf-8');
    
    logger.info('✅ Successfully synchronized country names to index.html');
    
    // Validate after sync
    const validation = validateCountryNames();
    if (validation.isValid) {
      logger.info(`✅ Validation passed: All ${validation.sourceCount} countries synchronized`);
      return true;
    } else {
      logger.warn('⚠️  Validation found issues after sync');
      return false;
    }
  } catch (error) {
    logger.error('Failed to synchronize country names', error);
    return false;
  }
}

/**
 * Main execution function - validates and optionally syncs
 * @param {Object} options - Options object
 * @param {boolean} options.sync - Whether to perform synchronization
 * @param {boolean} options.verbose - Whether to show detailed output
 */
function run(options = {}) {
  const { sync = false, verbose = false } = options;
  
  if (sync) {
    const success = syncCountryNames();
    process.exit(success ? 0 : 1);
  } else {
    const validation = validateCountryNames();
    
    console.log('\n=== Country Name Validation Report ===\n');
    console.log(`Source (data-fetcher.js): ${validation.sourceCount} countries`);
    console.log(`Target (index.html): ${validation.targetCount} countries\n`);
    
    if (validation.missing.length > 0) {
      console.log('❌ Missing from index.html:');
      validation.missing.forEach(m => {
        console.log(`   ${m.code}: "${m.name}"`);
      });
      console.log(`   Total: ${validation.missing.length}\n`);
    }
    
    if (validation.extra.length > 0) {
      console.log('⚠️  Extra in index.html (not in source):');
      validation.extra.forEach(e => {
        console.log(`   ${e.code}: "${e.name}"`);
      });
      console.log(`   Total: ${validation.extra.length}\n`);
    }
    
    if (validation.mismatched.length > 0) {
      console.log('⚠️  Mismatched names:');
      validation.mismatched.forEach(m => {
        console.log(`   ${m.code}:`);
        console.log(`      Source: "${m.source}"`);
        console.log(`      Target: "${m.target}"`);
      });
      console.log(`   Total: ${validation.mismatched.length}\n`);
    }
    
    if (validation.isValid) {
      console.log('✅ All country names are synchronized!\n');
      process.exit(0);
    } else {
      console.log('❌ Country names are not synchronized.');
      console.log('   Run "npm run sync-countries" to synchronize.\n');
      process.exit(1);
    }
  }
}

// Export functions
module.exports = {
  validateCountryNames,
  syncCountryNames,
  extractCountryNameMapFromDataFetcher,
  extractCountryNamesFromIndexHtml,
  run
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const sync = args.includes('--sync');
  const verbose = args.includes('--verbose') || args.includes('-v');
  
  run({ sync, verbose });
}
