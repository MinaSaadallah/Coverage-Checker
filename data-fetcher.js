/**
 * Data Fetcher Script
 * Fetches and updates mobile network operator data from GSMA and nPerf APIs
 * 
 * Data Sources:
 * - GSMA: Official mobile operator registry (https://www.gsma.com/wp-content/uploads/feed.csv)
 * - nPerf: Network performance testing service with coverage data
 * 
 * Process:
 * 1. Fetch GSMA operator data
 * 2. Fetch nPerf operator data for all countries
 * 3. Match nPerf operators with GSMA IDs
 * 4. Add GSMA-only operators not found in nPerf
 * 5. Save combined data to operators.json
 * 
 * @module data-fetcher
 */

const fs = require('fs');
const axios = require('axios');
const { parse } = require('csv-parse/sync');
const config = require('./config');
const logger = require('./utils/logger');

// API URLs
const GSMA_FEED_URL = config.api.gsmaFeedUrl;
const NPERF_API_URL = config.api.nperfApiUrl;

/**
 * Full list of ISO 3166-1 alpha-2 country codes
 * @constant {Array<string>}
 */
const ALL_COUNTRIES = [
  "AD", "AE", "AF", "AL", "AM", "AO", "AR", "AT", "AU", "AW", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BN", "BO", "BQ", "BR", "BS", "BT", "BW", "BY", "BZ",
  "CA", "CD", "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CY", "CZ",
  "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FO", "FR",
  "GA", "GB", "GD", "GE", "GF", "GH", "GL", "GM", "GN", "GP", "GQ", "GR", "GT", "GW", "GY",
  "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT",
  "JM", "JO", "JP", "KE", "KG", "KH", "KM", "KN", "KR", "KW", "KZ",
  "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY",
  "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
  "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NZ",
  "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ",
  "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO", "TR", "TT", "TW", "TZ",
  "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VI", "VN", "VU", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"
];

/**
 * Country name to ISO code mapping
 * Used to convert GSMA country names to ISO codes
 * @constant {Object}
 */
const COUNTRY_NAME_MAP = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "American Samoa": "AS", "Andorra": "AD", 
  "Angola": "AO", "Anguilla": "AI", "Antarctica": "AQ", "Antigua and Barbuda": "AG", "Argentina": "AR", 
  "Armenia": "AM", "Aruba": "AW", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ",
  "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY", 
  "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", "Bermuda": "BM", "Bhutan": "BT", 
  "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR", 
  "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI",
  "Cabo Verde": "CV", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Cayman Islands": "KY", 
  "Central African Republic": "CF", "Chad": "TD", "Chile": "CL", "China": "CN", "Colombia": "CO", 
  "Comoros": "KM", "Congo": "CG", "Democratic Republic of the Congo": "CD", "Cook Islands": "CK", 
  "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Curaçao": "CW", "Cyprus": "CY", "Czechia": "CZ",
  "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO", 
  "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", 
  "Estonia": "EE", "Eswatini": "SZ", "Ethiopia": "ET",
  "Falkland Islands": "FK", "Faroe Islands": "FO", "Fiji": "FJ", "Finland": "FI", "France": "FR", 
  "French Guiana": "GF", "French Polynesia": "PF", "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", 
  "Germany": "DE", "Ghana": "GH", "Gibraltar": "GI", "Greece": "GR", "Greenland": "GL", 
  "Grenada": "GD", "Guadeloupe": "GP", "Guam": "GU", "Guatemala": "GT", "Guinea": "GN", 
  "Guinea-Bissau": "GW", "Guyana": "GY",
  "Haiti": "HT", "Honduras": "HN", "Hong Kong": "HK", "Hungary": "HU", "Iceland": "IS", 
  "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE", "Israel": "IL", 
  "Italy": "IT", "Ivory Coast": "CI", "Jamaica": "JM", "Japan": "JP", "Jordan": "JO", 
  "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", "Kuwait": "KW", "Kyrgyzstan": "KG",
  "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR", "Libya": "LY", 
  "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "Macao": "MO", "Madagascar": "MG", 
  "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT", 
  "Marshall Islands": "MH", "Martinique": "MQ", "Mauritania": "MR", "Mauritius": "MU", 
  "Mayotte": "YT", "Mexico": "MX", "Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", 
  "Mongolia": "MN", "Montenegro": "ME", "Montserrat": "MS", "Morocco": "MA", "Mozambique": "MZ", 
  "Myanmar": "MM",
  "Namibia": "NA", "Nauru": "NR", "Nepal": "NP", "Netherlands": "NL", "New Caledonia": "NC", 
  "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", "Niue": "NU", 
  "Norfolk Island": "NF", "North Korea": "KP", "North Macedonia": "MK", "Northern Mariana Islands": "MP", 
  "Norway": "NO",
  "Oman": "OM", "Pakistan": "PK", "Palau": "PW", "Palestine": "PS", "Panama": "PA", 
  "Papua New Guinea": "PG", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL", 
  "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA", "Romania": "RO", "Russia": "RU", 
  "Rwanda": "RW", "Reunion": "RE",
  "Saint Barthélemy": "BL", "Saint Helena": "SH", "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC", 
  "Saint Martin": "MF", "Saint Pierre and Miquelon": "PM", "Saint Vincent and the Grenadines": "VC", 
  "Samoa": "WS", "San Marino": "SM", "Sao Tome and Principe": "ST", "Saudi Arabia": "SA", 
  "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG", 
  "Sint Maarten": "SX", "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", 
  "South Africa": "ZA", "South Korea": "KR", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK", 
  "Sudan": "SD", "Suriname": "SR", "Sweden": "SE", "Switzerland": "CH", "Syria": "SY",
  "Taiwan": "TW", "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH", "Timor-Leste": "TL", 
  "Togo": "TG", "Tokelau": "TK", "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN", 
  "Turkey": "TR", "Turkmenistan": "TM", "Turks and Caicos Islands": "TC", "Tuvalu": "TV", 
  "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB", 
  "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU", "Venezuela": "VE", 
  "Vietnam": "VN", "Wallis and Futuna": "WF", "Western Sahara": "EH", "Yemen": "YE", 
  "Zambia": "ZM", "Zimbabwe": "ZW"
};

/**
 * Main execution function
 * Fetches data from GSMA and nPerf, combines and saves to file
 */
async function run() {
  logger.info('Starting data update...');

  // 1. Fetch GSMA Data
  const gsmaOperators = await fetchGSMAData();

  // 2. Fetch nPerf Data
  const nperfOperators = await fetchNPerfData(gsmaOperators);

  // 3. Sort and save
  nperfOperators.sort((a, b) => 
    a.countryCode.localeCompare(b.countryCode) || a.operatorName.localeCompare(b.operatorName)
  );

  try {
    fs.writeFileSync('operators.json', JSON.stringify(nperfOperators, null, 2));
    logger.info(`✅ Successfully saved \${nperfOperators.length} operators to operators.json`);
  } catch (error) {
    logger.error('Failed to write operators.json', error);
    process.exit(1);
  }
}

/**
 * Fetches operator data from GSMA feed
 * @returns {Promise<Array>} Array of GSMA operator objects
 */
async function fetchGSMAData() {
  logger.info('Fetching GSMA data...');
  
  try {
    const response = await axios.get(GSMA_FEED_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: config.api.requestTimeout
    });

    const operators = parse(response.data, {
      columns: false,
      skip_empty_lines: true
    }).slice(1).map(row => ({
      gsmaId: row[0],
      name: row[1],
      country: row[2],
    }));

    logger.info(`Loaded \${operators.length} operators from GSMA`);
    return operators;
  } catch (error) {
    logger.error('GSMA fetch error', error);
    return [];
  }
}

/**
 * Fetches operator data from nPerf API for all countries
 * @param {Array} gsmaOperators - Array of GSMA operators for matching
 * @returns {Promise<Array>} Array of combined operator objects
 */
async function fetchNPerfData(gsmaOperators) {
  logger.info(`Fetching nPerf data for \${ALL_COUNTRIES.length} countries...`);
  
  const nperfOperators = [];
  const matchedGsmaIds = new Set();
  let processed = 0;

  for (const code of ALL_COUNTRIES) {
    try {
      const res = await axios.post(NPERF_API_URL, 
        { countryCode: code }, 
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          validateStatus: null,
          timeout: config.api.requestTimeout
        }
      );

      if (res.status === 200) {
        let list = [];
        if (res.data.data && res.data.data.isp) list = res.data.data.isp;
        else if (res.data.result) list = res.data.result;

        if (!Array.isArray(list) && typeof list === 'object') {
          list = Object.values(list);
        }

        if (Array.isArray(list)) {
          list.forEach(item => {
            const ispId = item.IspId || item.id_isp;
            const ispName = item.IspName || item.name;
            
            if (ispId && ispName) {
              const safeName = ispName.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
              const op = {
                countryCode: code,
                operatorId: ispId,
                operatorName: ispName,
                link: `https://www.nperf.com/en/map/\${code}/-/\${ispId}.\${safeName}/signal`,
                gsmaId: ''
              };

              // Match with GSMA
              const match = findGsmaMatch(op, gsmaOperators);
              if (match) {
                op.gsmaId = match.gsmaId;
                matchedGsmaIds.add(match.gsmaId.toString());
              }
              
              nperfOperators.push(op);
            }
          });
        }
      }
    } catch (error) {
      logger.debug(`Failed to fetch nPerf data for \${code}: \${error.message}`);
    }

    // Rate limiting delay
    await new Promise(r => setTimeout(r, config.api.apiDelay));
    
    processed++;
    if (processed % 50 === 0) {
      logger.info(`Processed \${processed}/\${ALL_COUNTRIES.length} countries...`);
    }
  }

  logger.info(`Loaded \${nperfOperators.length} operators from nPerf`);

  // Add missing GSMA operators
  const missingGsma = gsmaOperators.filter(g => !matchedGsmaIds.has(g.gsmaId.toString()));
  logger.info(`Found \${missingGsma.length} GSMA operators not in nPerf`);

  missingGsma.forEach(g => {
    const code = mapCountryNameToCode(g.country);
    if (code) {
      nperfOperators.push({
        countryCode: code,
        operatorId: 'GSMA_' + g.gsmaId,
        operatorName: g.name,
        link: '',
        gsmaId: g.gsmaId
      });
    }
  });

  return nperfOperators;
}

/**
 * Normalizes operator name for comparison
 * Removes special characters, common suffixes, and content in parentheses
 * @param {string} str - String to normalize
 * @returns {string} Normalized string
 */
function normalize(str) {
  if (!str) return '';
  let s = str.toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/\([^)]*\)/g, ''); // Remove content in parens
  s = s.replace(/\b(movil|mobile|cellular|wireless|telecom|communications|ltd|inc|s\.a|gmbh)\b/g, '');
  s = s.replace(/[^a-z0-9]/g, '');
  return s.trim();
}

/**
 * Finds matching GSMA operator for an nPerf operator
 * Uses fuzzy matching on normalized names
 * @param {Object} op - nPerf operator object
 * @param {Array} gsmaOperators - Array of GSMA operators
 * @returns {Object|undefined} Matched GSMA operator or undefined
 */
function findGsmaMatch(op, gsmaOperators) {
  const opNorm = normalize(op.operatorName);
  const candidates = gsmaOperators.filter(g => {
    const gNorm = normalize(g.name);
    if (gNorm === opNorm) return true;
    if (gNorm.length > 3 && opNorm.length > 3) {
      return gNorm.includes(opNorm) || opNorm.includes(gNorm);
    }
    return false;
  });
  return candidates[0];
}

/**
 * Maps country name to ISO code
 * @param {string} countryName - Full country name
 * @returns {string} ISO country code or empty string
 */
function mapCountryNameToCode(countryName) {
  const nameClean = countryName.trim();
  
  // Direct match
  if (COUNTRY_NAME_MAP[nameClean]) {
    return COUNTRY_NAME_MAP[nameClean];
  }
  
  // Partial match
  for (const [name, iso] of Object.entries(COUNTRY_NAME_MAP)) {
    if (nameClean.includes(name) || name.includes(nameClean)) {
      return iso;
    }
  }
  
  return '';
}

// Run the script
run().catch(error => {
  logger.error('Fatal error during data update', error);
  process.exit(1);
});
