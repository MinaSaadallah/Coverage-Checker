/**
 * Complete ISO 3166-1 Country Code to Full Name Mapping
 * 
 * This file contains the complete mapping of ISO 3166-1 alpha-2 country codes
 * to their full official names. No abbreviations are used.
 * 
 * Data source: ISO 3166-1 standard with ~250 countries and territories
 * Last updated: 2026-01-06
 * 
 * @file CountryNames.gs
 */

/**
 * Complete mapping of ISO 3166-1 alpha-2 codes to full country names
 * All countries use their full official names - NO abbreviations
 * 
 * Examples:
 * - AE → "United Arab Emirates" (not "UAE")
 * - GB → "United Kingdom" (not "UK")
 * - US → "United States of America" (not "USA")
 * - KR → "South Korea" (not "Korea")
 * - LA → "Lao People's Democratic Republic" (not "Lao")
 * - BA → "Bosnia and Herzegovina" (not "Bosnia")
 * 
 * @const {Object<string, string>}
 */
var COUNTRY_CODE_TO_NAME = {
  // A
  AD: 'Andorra',
  AE: 'United Arab Emirates',
  AF: 'Afghanistan',
  AG: 'Antigua and Barbuda',
  AI: 'Anguilla',
  AL: 'Albania',
  AM: 'Armenia',
  AO: 'Angola',
  AQ: 'Antarctica',
  AR: 'Argentina',
  AS: 'American Samoa',
  AT: 'Austria',
  AU: 'Australia',
  AW: 'Aruba',
  AX: 'Åland Islands',
  AZ: 'Azerbaijan',
  
  // B
  BA: 'Bosnia and Herzegovina',
  BB: 'Barbados',
  BD: 'Bangladesh',
  BE: 'Belgium',
  BF: 'Burkina Faso',
  BG: 'Bulgaria',
  BH: 'Bahrain',
  BI: 'Burundi',
  BJ: 'Benin',
  BL: 'Saint Barthélemy',
  BM: 'Bermuda',
  BN: 'Brunei Darussalam',
  BO: 'Bolivia',
  BQ: 'Bonaire, Sint Eustatius and Saba',
  BR: 'Brazil',
  BS: 'Bahamas',
  BT: 'Bhutan',
  BV: 'Bouvet Island',
  BW: 'Botswana',
  BY: 'Belarus',
  BZ: 'Belize',
  
  // C
  CA: 'Canada',
  CC: 'Cocos (Keeling) Islands',
  CD: 'Democratic Republic of the Congo',
  CF: 'Central African Republic',
  CG: 'Congo',
  CH: 'Switzerland',
  CI: 'Côte d\'Ivoire',
  CK: 'Cook Islands',
  CL: 'Chile',
  CM: 'Cameroon',
  CN: 'China',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  CV: 'Cabo Verde',
  CW: 'Curaçao',
  CX: 'Christmas Island',
  CY: 'Cyprus',
  CZ: 'Czechia',
  
  // D
  DE: 'Germany',
  DJ: 'Djibouti',
  DK: 'Denmark',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  DZ: 'Algeria',
  
  // E
  EC: 'Ecuador',
  EE: 'Estonia',
  EG: 'Egypt',
  EH: 'Western Sahara',
  ER: 'Eritrea',
  ES: 'Spain',
  ET: 'Ethiopia',
  
  // F
  FI: 'Finland',
  FJ: 'Fiji',
  FK: 'Falkland Islands',
  FM: 'Micronesia',
  FO: 'Faroe Islands',
  FR: 'France',
  
  // G
  GA: 'Gabon',
  GB: 'United Kingdom',
  GD: 'Grenada',
  GE: 'Georgia',
  GF: 'French Guiana',
  GG: 'Guernsey',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GL: 'Greenland',
  GM: 'Gambia',
  GN: 'Guinea',
  GP: 'Guadeloupe',
  GQ: 'Equatorial Guinea',
  GR: 'Greece',
  GS: 'South Georgia and the South Sandwich Islands',
  GT: 'Guatemala',
  GU: 'Guam',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  
  // H
  HK: 'Hong Kong',
  HM: 'Heard Island and McDonald Islands',
  HN: 'Honduras',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  
  // I
  ID: 'Indonesia',
  IE: 'Ireland',
  IL: 'Israel',
  IM: 'Isle of Man',
  IN: 'India',
  IO: 'British Indian Ocean Territory',
  IQ: 'Iraq',
  IR: 'Iran',
  IS: 'Iceland',
  IT: 'Italy',
  
  // J
  JE: 'Jersey',
  JM: 'Jamaica',
  JO: 'Jordan',
  JP: 'Japan',
  
  // K
  KE: 'Kenya',
  KG: 'Kyrgyzstan',
  KH: 'Cambodia',
  KI: 'Kiribati',
  KM: 'Comoros',
  KN: 'Saint Kitts and Nevis',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KY: 'Cayman Islands',
  KZ: 'Kazakhstan',
  
  // L
  LA: 'Lao People\'s Democratic Republic',
  LB: 'Lebanon',
  LC: 'Saint Lucia',
  LI: 'Liechtenstein',
  LK: 'Sri Lanka',
  LR: 'Liberia',
  LS: 'Lesotho',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  LY: 'Libya',
  
  // M
  MA: 'Morocco',
  MC: 'Monaco',
  MD: 'Moldova',
  ME: 'Montenegro',
  MF: 'Saint Martin',
  MG: 'Madagascar',
  MH: 'Marshall Islands',
  MK: 'North Macedonia',
  ML: 'Mali',
  MM: 'Myanmar',
  MN: 'Mongolia',
  MO: 'Macao',
  MP: 'Northern Mariana Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MS: 'Montserrat',
  MT: 'Malta',
  MU: 'Mauritius',
  MV: 'Maldives',
  MW: 'Malawi',
  MX: 'Mexico',
  MY: 'Malaysia',
  MZ: 'Mozambique',
  
  // N
  NA: 'Namibia',
  NC: 'New Caledonia',
  NE: 'Niger',
  NF: 'Norfolk Island',
  NG: 'Nigeria',
  NI: 'Nicaragua',
  NL: 'Netherlands',
  NO: 'Norway',
  NP: 'Nepal',
  NR: 'Nauru',
  NU: 'Niue',
  NZ: 'New Zealand',
  
  // O
  OM: 'Oman',
  
  // P
  PA: 'Panama',
  PE: 'Peru',
  PF: 'French Polynesia',
  PG: 'Papua New Guinea',
  PH: 'Philippines',
  PK: 'Pakistan',
  PL: 'Poland',
  PM: 'Saint Pierre and Miquelon',
  PN: 'Pitcairn',
  PR: 'Puerto Rico',
  PS: 'Palestine',
  PT: 'Portugal',
  PW: 'Palau',
  PY: 'Paraguay',
  
  // Q
  QA: 'Qatar',
  
  // R
  RE: 'Réunion',
  RO: 'Romania',
  RS: 'Serbia',
  RU: 'Russia',
  RW: 'Rwanda',
  
  // S
  SA: 'Saudi Arabia',
  SB: 'Solomon Islands',
  SC: 'Seychelles',
  SD: 'Sudan',
  SE: 'Sweden',
  SG: 'Singapore',
  SH: 'Saint Helena, Ascension and Tristan da Cunha',
  SI: 'Slovenia',
  SJ: 'Svalbard and Jan Mayen',
  SK: 'Slovakia',
  SL: 'Sierra Leone',
  SM: 'San Marino',
  SN: 'Senegal',
  SO: 'Somalia',
  SR: 'Suriname',
  SS: 'South Sudan',
  ST: 'São Tomé and Príncipe',
  SV: 'El Salvador',
  SX: 'Sint Maarten',
  SY: 'Syria',
  SZ: 'Eswatini',
  
  // T
  TC: 'Turks and Caicos Islands',
  TD: 'Chad',
  TF: 'French Southern Territories',
  TG: 'Togo',
  TH: 'Thailand',
  TJ: 'Tajikistan',
  TK: 'Tokelau',
  TL: 'Timor-Leste',
  TM: 'Turkmenistan',
  TN: 'Tunisia',
  TO: 'Tonga',
  TR: 'Turkey',
  TT: 'Trinidad and Tobago',
  TV: 'Tuvalu',
  TW: 'Taiwan',
  TZ: 'Tanzania',
  
  // U
  UA: 'Ukraine',
  UG: 'Uganda',
  UM: 'United States Minor Outlying Islands',
  US: 'United States of America',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  
  // V
  VA: 'Vatican City',
  VC: 'Saint Vincent and the Grenadines',
  VE: 'Venezuela',
  VG: 'British Virgin Islands',
  VI: 'United States Virgin Islands',
  VN: 'Vietnam',
  VU: 'Vanuatu',
  
  // W
  WF: 'Wallis and Futuna',
  WS: 'Samoa',
  
  // X
  XK: 'Kosovo',
  
  // Y
  YE: 'Yemen',
  YT: 'Mayotte',
  
  // Z
  ZA: 'South Africa',
  ZM: 'Zambia',
  ZW: 'Zimbabwe'
};

/**
 * Gets the full country name for a given ISO code
 * @param {string} code - ISO 3166-1 alpha-2 country code
 * @returns {string} Full country name or the code itself if not found
 * 
 * @example
 * getCountryName('AE') // Returns: "United Arab Emirates"
 * getCountryName('GB') // Returns: "United Kingdom"
 * getCountryName('US') // Returns: "United States of America"
 */
function getCountryName(code) {
  if (!code) return '';
  var upperCode = String(code).toUpperCase();
  return COUNTRY_CODE_TO_NAME[upperCode] || upperCode;
}

/**
 * Gets all country codes
 * @returns {Array<string>} Array of all ISO country codes
 */
function getAllCountryCodes() {
  return Object.keys(COUNTRY_CODE_TO_NAME);
}

/**
 * Gets all country names
 * @returns {Array<string>} Array of all country names
 */
function getAllCountryNames() {
  return Object.values(COUNTRY_CODE_TO_NAME);
}

/**
 * Gets the total number of countries in the mapping
 * @returns {number} Total number of countries
 */
function getCountryCount() {
  return Object.keys(COUNTRY_CODE_TO_NAME).length;
}

/**
 * Searches for countries by partial name match
 * @param {string} query - Search query
 * @returns {Array<Object>} Array of matching countries with code and name
 * 
 * @example
 * searchCountries('united') 
 * // Returns: [{code: 'AE', name: 'United Arab Emirates'}, {code: 'GB', name: 'United Kingdom'}, ...]
 */
function searchCountries(query) {
  if (!query) return [];
  
  var lowerQuery = String(query).toLowerCase();
  var results = [];
  
  for (var code in COUNTRY_CODE_TO_NAME) {
    var name = COUNTRY_CODE_TO_NAME[code];
    if (name.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({
        code: code,
        name: name
      });
    }
  }
  
  return results;
}

/**
 * Finds country code by name (exact or fuzzy match)
 * @param {string} name - Country name to search for
 * @returns {string} Country code or empty string if not found
 * 
 * @example
 * findCountryCode('United Kingdom') // Returns: "GB"
 * findCountryCode('UK') // Returns: "" (abbreviation not supported)
 */
function findCountryCode(name) {
  if (!name) return '';
  
  var lowerName = String(name).toLowerCase().trim();
  
  // Exact match
  for (var code in COUNTRY_CODE_TO_NAME) {
    if (COUNTRY_CODE_TO_NAME[code].toLowerCase() === lowerName) {
      return code;
    }
  }
  
  // Fuzzy match - check if name contains the search term
  for (var code in COUNTRY_CODE_TO_NAME) {
    var countryName = COUNTRY_CODE_TO_NAME[code].toLowerCase();
    if (countryName.indexOf(lowerName) !== -1 || lowerName.indexOf(countryName) !== -1) {
      return code;
    }
  }
  
  return '';
}
