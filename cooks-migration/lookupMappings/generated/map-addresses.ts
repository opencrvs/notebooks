#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Address Mapping Script
 *
 * This script processes free text addresses with typos and maps them to:
 * 1. Facilities (health clinics/hospitals)
 * 2. Local addresses (Cook Islands locations)
 * 3. International addresses (with country codes)
 * 4. Garbage (invalid/unrecognizable data)
 */

interface SeededLocation {
  admin0Pcode: string
  admin0Name_en: string
  admin1Pcode: string
  admin1Name_en: string
  admin2Pcode: string
  admin2Name_en: string
  admin3Pcode?: string
  admin3Name_en?: string
}

interface Facility {
  name: string
  id: string
}

interface Country {
  code: string
  name: string
}

interface InternationalMapping {
  country: string
  town: string
}

// Load data files
const allUniqueAddresses: string[] = JSON.parse(
  await Deno.readTextFile('../allUniqueAddresses.json'),
)

const seededLocations: SeededLocation[] = JSON.parse(
  await Deno.readTextFile('../seededLocations.json'),
)

const seededFacilities: Facility[] = JSON.parse(
  await Deno.readTextFile('../seededFacilities.json'),
)

// Extract countries from addressConfig.ts
const countries: Country[] = [
  { code: 'ABW', name: 'Aruba' },
  { code: 'AFG', name: 'Afghanistan' },
  { code: 'AGO', name: 'Angola' },
  { code: 'AIA', name: 'Anguilla' },
  { code: 'ALA', name: 'Åland Islands' },
  { code: 'ALB', name: 'Albania' },
  { code: 'AND', name: 'Andorra' },
  { code: 'ARE', name: 'United Arab Emirates' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'ARM', name: 'Armenia' },
  { code: 'ASM', name: 'American Samoa' },
  { code: 'ATA', name: 'Antarctica' },
  { code: 'ATF', name: 'French Southern Territories' },
  { code: 'ATG', name: 'Antigua and Barbuda' },
  { code: 'AUS', name: 'Australia' },
  { code: 'AUT', name: 'Austria' },
  { code: 'AZE', name: 'Azerbaijan' },
  { code: 'BDI', name: 'Burundi' },
  { code: 'BEL', name: 'Belgium' },
  { code: 'BEN', name: 'Benin' },
  { code: 'BES', name: 'Bonaire, Sint Eustatius and Saba' },
  { code: 'BFA', name: 'Burkina Faso' },
  { code: 'BGD', name: 'Bangladesh' },
  { code: 'BGR', name: 'Bulgaria' },
  { code: 'BHR', name: 'Bahrain' },
  { code: 'BHS', name: 'Bahamas' },
  { code: 'BIH', name: 'Bosnia and Herzegovina' },
  { code: 'BLM', name: 'Saint Barthélemy' },
  { code: 'BLR', name: 'Belarus' },
  { code: 'BLZ', name: 'Belize' },
  { code: 'BMU', name: 'Bermuda' },
  { code: 'BOL', name: 'Bolivia (Plurinational State of)' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'BRB', name: 'Barbados' },
  { code: 'BRN', name: 'Brunei Darussalam' },
  { code: 'BTN', name: 'Bhutan' },
  { code: 'BVT', name: 'Bouvet Island' },
  { code: 'BWA', name: 'Botswana' },
  { code: 'CAF', name: 'Central African Republic' },
  { code: 'CAN', name: 'Canada' },
  { code: 'CCK', name: 'Cocos (Keeling) Islands' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'CHL', name: 'Chile' },
  { code: 'CHN', name: 'China' },
  { code: 'CIV', name: "Côte d'Ivoire" },
  { code: 'CMR', name: 'Cameroon' },
  { code: 'COD', name: 'Democratic Republic of the Congo' },
  { code: 'COG', name: 'Congo' },
  { code: 'COK', name: 'Cook Islands' },
  { code: 'COL', name: 'Colombia' },
  { code: 'COM', name: 'Comoros' },
  { code: 'CPV', name: 'Cabo Verde' },
  { code: 'CRI', name: 'Costa Rica' },
  { code: 'CUB', name: 'Cuba' },
  { code: 'CUW', name: 'Curaçao' },
  { code: 'CXR', name: 'Christmas Island' },
  { code: 'CYM', name: 'Cayman Islands' },
  { code: 'CYP', name: 'Cyprus' },
  { code: 'CZE', name: 'Czechia' },
  { code: 'DEU', name: 'Germany' },
  { code: 'DJI', name: 'Djibouti' },
  { code: 'DMA', name: 'Dominica' },
  { code: 'DNK', name: 'Denmark' },
  { code: 'DOM', name: 'Dominican Republic' },
  { code: 'DZA', name: 'Algeria' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'ERI', name: 'Eritrea' },
  { code: 'ESH', name: 'Western Sahara' },
  { code: 'ESP', name: 'Spain' },
  { code: 'EST', name: 'Estonia' },
  { code: 'ETH', name: 'Ethiopia' },
  { code: 'FAR', name: 'Farajaland' },
  { code: 'FIN', name: 'Finland' },
  { code: 'FJI', name: 'Fiji' },
  { code: 'FLK', name: 'Falkland Islands (Malvinas)' },
  { code: 'FRA', name: 'France' },
  { code: 'FRO', name: 'Faroe Islands' },
  { code: 'FSM', name: 'Micronesia (Federated States of)' },
  { code: 'GAB', name: 'Gabon' },
  { code: 'GBR', name: 'United Kingdom of Great Britain and Northern Ireland' },
  { code: 'GEO', name: 'Georgia' },
  { code: 'GGY', name: 'Guernsey' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'GIB', name: 'Gibraltar' },
  { code: 'GIN', name: 'Guinea' },
  { code: 'GLP', name: 'Guadeloupe' },
  { code: 'GMB', name: 'Gambia' },
  { code: 'GNB', name: 'Guinea-Bissau' },
  { code: 'GNQ', name: 'Equatorial Guinea' },
  { code: 'GRC', name: 'Greece' },
  { code: 'GRD', name: 'Grenada' },
  { code: 'GRL', name: 'Greenland' },
  { code: 'GTM', name: 'Guatemala' },
  { code: 'GUF', name: 'French Guiana' },
  { code: 'GUM', name: 'Guam' },
  { code: 'GUY', name: 'Guyana' },
  { code: 'HKG', name: 'China, Hong Kong Special Administrative Region' },
  { code: 'HMD', name: 'Heard Island and McDonald Islands' },
  { code: 'HND', name: 'Honduras' },
  { code: 'HRV', name: 'Croatia' },
  { code: 'HTI', name: 'Haiti' },
  { code: 'HUN', name: 'Hungary' },
  { code: 'IDN', name: 'Indonesia' },
  { code: 'IMN', name: 'Isle of Man' },
  { code: 'IND', name: 'India' },
  { code: 'IOT', name: 'British Indian Ocean Territory' },
  { code: 'IRL', name: 'Ireland' },
  { code: 'IRN', name: 'Iran (Islamic Republic of)' },
  { code: 'IRQ', name: 'Iraq' },
  { code: 'ISL', name: 'Iceland' },
  { code: 'ISR', name: 'Israel' },
  { code: 'ITA', name: 'Italy' },
  { code: 'JAM', name: 'Jamaica' },
  { code: 'JEY', name: 'Jersey' },
  { code: 'JOR', name: 'Jordan' },
  { code: 'JPN', name: 'Japan' },
  { code: 'KAZ', name: 'Kazakhstan' },
  { code: 'KEN', name: 'Kenya' },
  { code: 'KGZ', name: "Lao People's Democratic Republic Republic" },
  { code: 'KHM', name: 'Cambodia' },
  { code: 'KIR', name: 'Kiribati' },
  { code: 'KNA', name: 'Saint Kitts and Nevis' },
  { code: 'KOR', name: 'Republic of Korea' },
  { code: 'KWT', name: 'Kuwait' },
  { code: 'LBN', name: 'Lebanon' },
  { code: 'LBR', name: 'Liberia' },
  { code: 'LBY', name: 'Libya' },
  { code: 'LCA', name: 'Saint Lucia' },
  { code: 'LIE', name: 'Liechtenstein' },
  { code: 'LKA', name: 'Sri Lanka' },
  { code: 'LSO', name: 'Lesotho' },
  { code: 'LTU', name: 'Lithuania' },
  { code: 'LUX', name: 'Luxembourg' },
  { code: 'LVA', name: 'Latvia' },
  { code: 'MAC', name: 'China, Macao Special Administrative Region' },
  { code: 'MAF', name: 'Saint Martin (French Part)' },
  { code: 'MAR', name: 'Morocco' },
  { code: 'MCO', name: 'Monaco' },
  { code: 'MDA', name: 'Republic of Moldova' },
  { code: 'MDG', name: 'Madagascar' },
  { code: 'MDV', name: 'Maldives' },
  { code: 'MEX', name: 'Mexico' },
  { code: 'MHL', name: 'Marshall Islands' },
  { code: 'MKD', name: 'The former Yugoslav Republic of Macedonia' },
  { code: 'MLI', name: 'Mali' },
  { code: 'MLT', name: 'Malta' },
  { code: 'MMR', name: 'Myanmar' },
  { code: 'MNE', name: 'Montenegro' },
  { code: 'MNG', name: 'Mongolia' },
  { code: 'MNP', name: 'Northern Mariana Islands' },
  { code: 'MOZ', name: 'Mozambique' },
  { code: 'MRT', name: 'Mauritania' },
  { code: 'MSR', name: 'Montserrat' },
  { code: 'MTQ', name: 'Martinique' },
  { code: 'MUS', name: 'Mauritius' },
  { code: 'MWI', name: 'Malawi' },
  { code: 'MYS', name: 'Malaysia' },
  { code: 'MYT', name: 'Mayotte' },
  { code: 'NAM', name: 'Namibia' },
  { code: 'NCL', name: 'New Caledonia' },
  { code: 'NER', name: 'Niger' },
  { code: 'NFK', name: 'Norfolk Island' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'NIC', name: 'Nicaragua' },
  { code: 'NIU', name: 'Niue' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'NOR', name: 'Norway' },
  { code: 'NPL', name: 'Nepal' },
  { code: 'NRU', name: 'Nauru' },
  { code: 'NZL', name: 'New Zealand' },
  { code: 'OMN', name: 'Oman' },
  { code: 'PAK', name: 'Pakistan' },
  { code: 'PAN', name: 'Panama' },
  { code: 'PCN', name: 'Pitcairn' },
  { code: 'PER', name: 'Peru' },
  { code: 'PHL', name: 'Philippines' },
  { code: 'PLW', name: 'Palau' },
  { code: 'PNG', name: 'Papua New Guinea' },
  { code: 'POL', name: 'Poland' },
  { code: 'PRI', name: 'Puerto Rico' },
  { code: 'PRK', name: "Democratic People's Republic of Korea" },
  { code: 'PRT', name: 'Portugal' },
  { code: 'PRY', name: 'Paraguay' },
  { code: 'PSE', name: 'State of Palestine' },
  { code: 'PYF', name: 'French Polynesia' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'REU', name: 'Réunion' },
  { code: 'ROU', name: 'Romania' },
  { code: 'RUS', name: 'Russian Federation' },
  { code: 'RWA', name: 'Rwanda' },
  { code: 'SAU', name: 'Saudi Arabia' },
  { code: 'SDN', name: 'Sudan' },
  { code: 'SEN', name: 'Senegal' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'SGS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SHN', name: 'Saint Helena' },
  { code: 'SJM', name: 'Svalbard and Jan Mayen Islands' },
  { code: 'SLB', name: 'Solomon Islands' },
  { code: 'SLE', name: 'Sierra Leone' },
  { code: 'SLV', name: 'El Salvador' },
  { code: 'SMR', name: 'San Marino' },
  { code: 'SOM', name: 'Somalia' },
  { code: 'SPM', name: 'Saint Pierre and Miquelon' },
  { code: 'SRB', name: 'Serbia' },
  { code: 'SSD', name: 'South Sudan' },
  { code: 'STP', name: 'Sao Tome and Principe' },
  { code: 'SUR', name: 'Suriname' },
  { code: 'SVK', name: 'Slovakia' },
  { code: 'SVN', name: 'Slovenia' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'SWZ', name: 'Eswatini' },
  { code: 'SXM', name: 'Sint Maarten (Dutch part)' },
  { code: 'SYC', name: 'Seychelles' },
  { code: 'SYR', name: 'Syrian Arab Republic' },
  { code: 'TCA', name: 'Turks and Caicos Islands' },
  { code: 'TCD', name: 'Chad' },
  { code: 'TGO', name: 'Togo' },
  { code: 'THA', name: 'Thailand' },
  { code: 'TJK', name: 'Tajikistan' },
  { code: 'TKL', name: 'Tokelau' },
  { code: 'TKM', name: 'Turkmenistan' },
  { code: 'TLS', name: 'Timor-Leste' },
  { code: 'TON', name: 'Tonga' },
  { code: 'TTO', name: 'Trinidad and Tobago' },
  { code: 'TUN', name: 'Tunisia' },
  { code: 'TUR', name: 'Turkey' },
  { code: 'TUV', name: 'Tuvalu' },
  { code: 'TZA', name: 'United Republic of Tanzania' },
  { code: 'UGA', name: 'Uganda' },
  { code: 'UKR', name: 'Ukraine' },
  { code: 'UMI', name: 'United States Minor Outlying Islands' },
  { code: 'URY', name: 'Uruguay' },
  { code: 'USA', name: 'United States of America' },
  { code: 'UZB', name: 'Uzbekistan' },
  { code: 'VAT', name: 'Holy See' },
  { code: 'VCT', name: 'Saint Vincent and the Grenadines' },
  { code: 'VEN', name: 'Venezuela (Bolivarian Republic of)' },
  { code: 'VGB', name: 'British Virgin Islands' },
  { code: 'VIR', name: 'United States Virgin Islands' },
  { code: 'VNM', name: 'Viet Nam' },
  { code: 'VUT', name: 'Vanuatu' },
  { code: 'WLF', name: 'Wallis and Futuna Islands' },
  { code: 'WSM', name: 'Samoa' },
  { code: 'YEM', name: 'Yemen' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'ZMB', name: 'Zambia' },
  { code: 'ZWE', name: 'Zimbabwe' },
]

// Build country lookup with variations
const countryLookup = new Map<string, string>()

// Add all country names and variations
for (const country of countries) {
  // Skip Cook Islands
  if (country.code === 'COK') continue

  // Normalize and add full name
  countryLookup.set(country.name.toUpperCase(), country.code)

  // Add common variations
  const variations: Record<string, string[]> = {
    NZL: ['NEW ZEALAND', 'NZ', 'NEWZEALAND', 'N.Z.'],
    AUS: ['AUSTRALIA', 'AUST', 'AU', 'AUSTRALIE'],
    USA: [
      'UNITED STATES',
      'USA',
      'US',
      'AMERICA',
      'U.S.A',
      'U.S.',
      'UNITED STATES OF AMERICA',
    ],
    GBR: [
      'UNITED KINGDOM',
      'UK',
      'U.K.',
      'BRITAIN',
      'ENGLAND',
      'SCOTLAND',
      'WALES',
      'GREAT BRITAIN',
    ],
    FRA: ['FRANCE', 'FRENCH'],
    DEU: ['GERMANY', 'DEUTSCHLAND'],
    TON: ['TONGA'],
    FJI: ['FIJI'],
    WSM: ['SAMOA'],
    PYF: ['FRENCH POLYNESIA', 'TAHITI'],
    CAN: ['CANADA'],
    NLD: ['NETHERLANDS', 'THE NETHERLANDS', 'HOLLAND'],
    AUT: ['AUSTRIA'],
  }

  if (variations[country.code]) {
    for (const variant of variations[country.code]) {
      countryLookup.set(variant, country.code)
    }
  }
}

// Build location lookup structures with level tracking
const locationsByName = new Map<
  string,
  Array<{ location: SeededLocation; level: number; pcode: string }>
>()
for (const location of seededLocations) {
  // Index by all admin levels, tracking which level the name is at
  if (location.admin3Name_en && location.admin3Pcode) {
    const key = location.admin3Name_en.toUpperCase()
    if (!locationsByName.has(key)) locationsByName.set(key, [])
    locationsByName
      .get(key)!
      .push({ location, level: 3, pcode: location.admin3Pcode })
  }
  if (location.admin2Name_en) {
    const key = location.admin2Name_en.toUpperCase()
    if (!locationsByName.has(key)) locationsByName.set(key, [])
    locationsByName
      .get(key)!
      .push({ location, level: 2, pcode: location.admin2Pcode })
  }
  if (location.admin1Name_en) {
    const key = location.admin1Name_en.toUpperCase()
    if (!locationsByName.has(key)) locationsByName.set(key, [])
    locationsByName
      .get(key)!
      .push({ location, level: 1, pcode: location.admin1Pcode })
  }
}

// Build facility lookup with variations
const facilityByName = new Map<string, string>()
for (const facility of seededFacilities) {
  const normalized = normalize(facility.name)
  facilityByName.set(normalized, facility.id)

  // Add common island name patterns for hospital variants
  // e.g., "HOSPITAL RAROTONGA" or "RAROTONGA HOSPITAL" -> Rarotonga Hospital
  const match = facility.name.match(
    /^(Rarotonga|Aitutaki|Mangaia|Mauke|Atiu|Mitiaro|Manihiki|Rakahanga|Penrhyn|Pukapuka|Nassau|Palmerston)/i,
  )
  if (match) {
    const island = match[1].toUpperCase()
    facilityByName.set(`HOSPITAL ${island}`, facility.id)
    facilityByName.set(`${island} HOSPITAL`, facility.id)
  }
}

// Output containers
const facilityMappings: Record<string, string> = {}
const localMappings: Record<string, string> = {}
const intlMappings: Record<string, InternationalMapping> = {}
const garbage: string[] = []

// Statistics
let stats = {
  total: 0,
  garbage: 0,
  facility: 0,
  local: 0,
  intl: 0,
}

/**
 * Normalize a string for matching
 */
function normalize(str: string): string {
  return str
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Check if a string has at least one alphabetical character
 */
function hasAlphabeticalChars(str: string): boolean {
  return /[A-Za-z]/.test(str)
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshtein(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1
      }
    }
  }

  return dp[m][n]
}

/**
 * Try to match an address to a facility
 */
function matchFacility(address: string): string | null {
  const normalized = normalize(address)
  const words = normalized.split(' ')

  // Look for hospital/clinic keywords
  const facilityKeywords = [
    'HOSPITAL',
    'CLINIC',
    'HEALTH',
    'MEDICAL',
    'CENTRE',
    'CENTER',
  ]
  const hasFacilityKeyword = facilityKeywords.some((kw) =>
    normalized.includes(kw),
  )

  if (!hasFacilityKeyword) return null

  // Try exact match first
  for (const [name, id] of facilityByName.entries()) {
    if (normalized === name || normalized.includes(name)) {
      return id
    }
  }

  // Try fuzzy match with high threshold
  let bestMatch: { id: string; distance: number } | null = null

  for (const [name, id] of facilityByName.entries()) {
    const distance = levenshtein(normalized, name)
    const threshold = Math.floor(name.length * 0.3) // Allow 30% error

    if (distance <= threshold) {
      if (!bestMatch || distance < bestMatch.distance) {
        bestMatch = { id, distance }
      }
    }
  }

  return bestMatch?.id ?? null
}

/**
 * Try to match an address to a local Cook Islands location
 * Returns the Pcode of the highest level match
 */
function matchLocalLocation(address: string): string | null {
  const normalized = normalize(address)
  const words = normalized.split(' ')

  // Collect ALL matches at each stage, then return the highest level
  let allMatches: Array<{ pcode: string; level: number; matchType: string }> =
    []

  // Try exact/word match first
  for (const [name, locationEntries] of locationsByName.entries()) {
    if (normalized === name || words.includes(name)) {
      // Add all matching entries
      for (const entry of locationEntries) {
        allMatches.push({
          pcode: entry.pcode,
          level: entry.level,
          matchType: 'exact',
        })
      }
    }
  }

  // If we have exact matches, return the highest level one
  if (allMatches.length > 0) {
    allMatches.sort((a, b) => b.level - a.level)
    return allMatches[0].pcode
  }

  // Try substring match
  for (const [name, locationEntries] of locationsByName.entries()) {
    if (normalized.includes(name) && name.length > 3) {
      for (const entry of locationEntries) {
        allMatches.push({
          pcode: entry.pcode,
          level: entry.level,
          matchType: 'substring',
        })
      }
    }
  }

  // If we have substring matches, return the highest level one
  if (allMatches.length > 0) {
    allMatches.sort((a, b) => b.level - a.level)
    return allMatches[0].pcode
  }

  // Try fuzzy match with stricter threshold
  let bestMatch: { pcode: string; distance: number; level: number } | null =
    null

  for (const [name, locationEntries] of locationsByName.entries()) {
    const distance = levenshtein(normalized, name)
    const threshold = Math.floor(name.length * 0.25) // Allow 25% error

    if (distance <= threshold && name.length > 3) {
      const sorted = locationEntries.sort((a, b) => b.level - a.level)
      const best = sorted[0]

      if (
        !bestMatch ||
        distance < bestMatch.distance ||
        (distance === bestMatch.distance && best.level > bestMatch.level)
      ) {
        bestMatch = { pcode: best.pcode, distance, level: best.level }
      }
    }
  }

  return bestMatch?.pcode ?? null
}

/**
 * Find the longest matching country name in the address
 */
function findCountryMatch(
  address: string,
): { country: string; matchedText: string; startIdx: number } | null {
  const addressUpper = address.toUpperCase()

  let bestMatch: {
    country: string
    matchedText: string
    startIdx: number
  } | null = null

  // Try all country variations
  for (const [countryText, countryCode] of countryLookup.entries()) {
    // Look for word boundary matches
    const regex = new RegExp(
      '\\b' + countryText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b',
      'i',
    )
    const match = addressUpper.match(regex)

    if (match && match.index !== undefined) {
      // Prefer longer matches (more specific)
      if (!bestMatch || countryText.length > bestMatch.matchedText.length) {
        bestMatch = {
          country: countryCode,
          matchedText: countryText,
          startIdx: match.index,
        }
      }
    }
  }

  return bestMatch
}

/**
 * Try to match an address to an international location
 */
function matchInternational(address: string): InternationalMapping | null {
  let searchAddress = address

  // Handle truncated addresses - try completing common truncations
  if (address.length >= 48) {
    // Close to 50 char limit
    const completions = [
      { pattern: /NEW ZE(A|AL|ALA|ALAN)?$/i, complete: 'NEW ZEALAND' },
      { pattern: /AUSTRALI?$/i, complete: 'AUSTRALIA' },
      { pattern: /GERMA?$/i, complete: 'GERMANY' },
      { pattern: /ENGLA?$/i, complete: 'ENGLAND' },
    ]

    for (const { pattern, complete } of completions) {
      if (pattern.test(searchAddress)) {
        searchAddress = searchAddress.replace(pattern, complete)
        break
      }
    }
  }

  // Special case: Fix common country name typos
  const upperAddress = searchAddress.toUpperCase()

  // New Zealand typos
  searchAddress = searchAddress.replace(/\bNEW\s{2,}ZEALAND\b/gi, 'NEW ZEALAND') // Multiple spaces
  searchAddress = searchAddress.replace(/\bNEEW\s+ZEALAND\b/gi, 'NEW ZEALAND') // NEEW typo
  searchAddress = searchAddress.replace(/\bNEFW\s+ZEALAND\b/gi, 'NEW ZEALAND') // NEFW typo
  searchAddress = searchAddress.replace(/\bHEW\s+ZEALAND\b/gi, 'NEW ZEALAND') // HEW typo
  searchAddress = searchAddress.replace(/\bNE\s+W?ZEALAND\b/gi, 'NEW ZEALAND') // NE ZEALAND, NE WZEALAND
  searchAddress = searchAddress.replace(/\bNEW\s+ZEALANDA?\b/gi, 'NEW ZEALAND') // NEW ZEALANDA
  searchAddress = searchAddress.replace(/\bNEW\s+ZEALANDER?\b/gi, 'NEW ZEALAND') // NEW ZEALANDER
  searchAddress = searchAddress.replace(/\bNEW\s+ZEALANDS\b/gi, 'NEW ZEALAND') // NEW ZEALANDS (plural)
  searchAddress = searchAddress.replace(/\bNEW\s+ZEALND\b/gi, 'NEW ZEALAND') // NEW ZEALND

  // Philippines typos
  searchAddress = searchAddress.replace(/\bPHILLIPINESS\b/gi, 'PHILIPPINES') // PHILLIPINESS (extra S)
  searchAddress = searchAddress.replace(/\bPHILLIPINES\b/gi, 'PHILIPPINES') // PHILLIPINES
  searchAddress = searchAddress.replace(/\bPHILIPINES\b/gi, 'PHILIPPINES') // PHILIPINES
  searchAddress = searchAddress.replace(
    /\bPHILIPPINE\b(?!\sS)/gi,
    'PHILIPPINES',
  ) // PHILIPPINE (singular)

  // United Kingdom typos
  searchAddress = searchAddress.replace(
    /\bUNTIED\s+KINGDOM\b/gi,
    'UNITED KINGDOM',
  ) // UNTIED KINGDOM
  searchAddress = searchAddress.replace(
    /\bUNITED\s+KINDGOM\b/gi,
    'UNITED KINGDOM',
  ) // KINDGOM

  // Netherlands variations
  searchAddress = searchAddress.replace(/\bNEDERLAND\b(?!S)/gi, 'NETHERLANDS') // NEDERLAND
  searchAddress = searchAddress.replace(/\bNEDERLANDS\b/gi, 'NETHERLANDS') // NEDERLANDS
  searchAddress = searchAddress.replace(/\bNEDERLANDSE\b/gi, 'NETHERLANDS') // NEDERLANDSE

  // Tanzania (already correct, just ensure it's caught)
  searchAddress = searchAddress.replace(/\bTANZANIA\b/gi, 'TANZANIA')

  // Russia variations → Russian Federation (RUS)
  searchAddress = searchAddress.replace(/\bRUSSIA\b/gi, 'RUSSIAN FEDERATION')
  searchAddress = searchAddress.replace(/\bUSSR\b/gi, 'RUSSIAN FEDERATION')

  // Venezuela (already correct, just ensure it's caught)
  searchAddress = searchAddress.replace(/\bVENEZUELA\b/gi, 'VENEZUELA')

  // South Korea → Republic of Korea (KOR)
  searchAddress = searchAddress.replace(
    /\bSOUTH\s+KOREA\b/gi,
    'REPUBLIC OF KOREA',
  )
  searchAddress = searchAddress.replace(
    /\bREPULIC\s+SOUTH\s+KOREA\b/gi,
    'REPUBLIC OF KOREA',
  )

  // Bosnia variations → Bosnia and Herzegovina (BIH)
  searchAddress = searchAddress.replace(
    /\bBOSNIA-HERZEGOVINA\b/gi,
    'BOSNIA AND HERZEGOVINA',
  )
  searchAddress = searchAddress.replace(
    /\bBOSNIA\b(?![\s-]AND)/gi,
    'BOSNIA AND HERZEGOVINA',
  )
  searchAddress = searchAddress.replace(
    /\bBOSNIEN\s+AND\s+HERCEGOVINA\b/gi,
    'BOSNIA AND HERZEGOVINA',
  )

  // Yugoslavia → Serbia (default to most likely successor state for mapping purposes)
  searchAddress = searchAddress.replace(/\bYUGOSLAVIA\b/gi, 'SERBIA')
  searchAddress = searchAddress.replace(
    /\bREPUBLIC\s+OF\s+YUGOSLAVIA\b/gi,
    'SERBIA',
  )

  // Special case: New Zealand city/town implies New Zealand if no country present
  const updatedUpper = searchAddress.toUpperCase()
  const nzCities = [
    'AUCKLAND',
    'WELLINGTON',
    'CHRISTCHURCH',
    'HAMILTON',
    'TAURANGA',
    'NAPIER',
    'DUNEDIN',
    'PALMERSTON NORTH',
    'NELSON',
    'ROTORUA',
    'NEW PLYMOUTH',
    'WHANGAREI',
    'INVERCARGILL',
    'WHANGANUI',
    'GISBORNE',
    'TAUPO',
    'TIMARU',
    'MASTERTON',
    'LEVIN',
    'ASHBURTON',
    'QUEENSTOWN',
    'TOKOROA',
    'PUKEKOHE',
    'MORRINSVILLE',
    'KATIKATI',
    'TAIRUA',
    'KAIAPOI',
    'PARAPARAUMU',
    'HOWICK',
    'PAPAMOA',
    'MANUKAU',
    'BALCLUTHA',
    'DARFIELD',
    'WAKEFIELD',
    'PORIRUA',
    'KAPITI',
  ]

  // Check if any NZ city is present and no country is mentioned
  const hasCountry =
    /\b(NEW\s+ZEALAND|AUSTRALIA|UNITED\s+(KINGDOM|STATES)|CANADA|GERMANY|FRANCE)\b/i.test(
      updatedUpper,
    )
  if (!hasCountry) {
    for (const city of nzCities) {
      if (new RegExp('\\b' + city + '\\b', 'i').test(updatedUpper)) {
        searchAddress = searchAddress + ', NEW ZEALAND'
        break
      }
    }
  }

  // Special case: Australian state codes or major cities imply Australia
  const auStates = [
    'NSW',
    'QLD',
    'VIC',
    'ACT',
    'SA',
    'WA',
    'TAS',
    'NT',
    'QUEENSLAND',
    'VICTORIA',
  ]
  const auCities = [
    'SYDNEY',
    'MELBOURNE',
    'BRISBANE',
    'PERTH',
    'ADELAIDE',
    'CANBERRA',
    'HOBART',
    'DARWIN',
  ]

  if (!hasCountry) {
    // Check for Australian state codes
    for (const state of auStates) {
      if (new RegExp('\\b' + state + '\\b', 'i').test(updatedUpper)) {
        searchAddress = searchAddress + ', AUSTRALIA'
        break
      }
    }
    // If not already added AU, check for major cities
    if (!/\bAUSTRALIA\b/i.test(searchAddress)) {
      for (const city of auCities) {
        if (new RegExp('\\b' + city + '\\b', 'i').test(updatedUpper)) {
          searchAddress = searchAddress + ', AUSTRALIA'
          break
        }
      }
    }
  }

  // Special case: Czech Republic variations
  if (/\bCZECH\s+REPUBLIC\b/i.test(searchAddress)) {
    searchAddress = searchAddress.replace(/CZECH\s+REPUBLIC/gi, 'CZECHIA')
  } else if (/\bCZECH\s+REPULIC\b/i.test(searchAddress)) {
    searchAddress = searchAddress.replace(/CZECH\s+REPULIC/gi, 'CZECHIA')
  } else if (/\bSLOVAK\s+REPUBLIC\b/i.test(searchAddress)) {
    searchAddress = searchAddress.replace(/SLOVAK\s+REPUBLIC/gi, 'SLOVAKIA')
  }

  // Special case: Tahiti/French Polynesia
  const tahitiLocations = [
    'MOOREA',
    'BORA BORA',
    'HUAHINE',
    'PAPEETE',
    'TAHITI',
  ]
  for (const location of tahitiLocations) {
    if (new RegExp('\\b' + location + '\\b', 'i').test(upperAddress)) {
      if (!/\bFRENCH\s+POLYNESIA\b/i.test(upperAddress)) {
        return { country: 'PYF', town: location }
      }
    }
  }

  const match = findCountryMatch(searchAddress)

  if (!match) return null

  // Remove the country from the address to get the town
  let town =
    searchAddress.substring(0, match.startIdx) +
    searchAddress.substring(match.startIdx + match.matchedText.length)

  // Clean up the town
  town = town
    .replace(/,\s*$/g, '') // Remove trailing comma
    .replace(/^\s*,/g, '') // Remove leading comma
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()

  // If town is empty, use original address without country
  if (!town) {
    town = searchAddress
  }

  return {
    country: match.country,
    town: town,
  }
}

/**
 * Process a single address
 */
function processAddress(address: string): void {
  const trimmed = address.trim()

  // Step 1: Discard obviously invalid entries
  if (
    trimmed.length <= 3 || // Too short
    /^\d+$/.test(trimmed) || // Pure numbers
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed) || // Dates like "14/02/2020"
    /^-+$/.test(trimmed) || // Dashes only
    trimmed === 'NIL' || // Explicit nulls
    trimmed === 'P' // Single letters
  ) {
    garbage.push(address)
    stats.garbage++
    return
  }

  // Step 2: Check if it's garbage (no alphabetical characters)
  if (!hasAlphabeticalChars(address)) {
    garbage.push(address)
    stats.garbage++
    return
  }

  // Step 3: Try to match to international location FIRST
  // This prevents false matches with local locations
  const intlMapping = matchInternational(address)
  if (intlMapping) {
    intlMappings[address] = intlMapping
    stats.intl++
    return
  }

  // Step 4: Try to match to a facility
  const facilityId = matchFacility(address)
  if (facilityId) {
    facilityMappings[address] = facilityId
    stats.facility++
    return
  }

  // Step 5: Try to match to a local location
  const locationPcode = matchLocalLocation(address)
  if (locationPcode) {
    localMappings[address] = locationPcode
    stats.local++
    return
  }

  // Step 6: If nothing matches, it's garbage
  garbage.push(address)
  stats.garbage++
}

// Process all addresses
console.log('Starting address mapping...')
console.log(`Total addresses to process: ${allUniqueAddresses.length}`)

let processed = 0
for (const address of allUniqueAddresses) {
  processAddress(address)
  processed++

  if (processed % 1000 === 0) {
    console.log(
      `Processed ${processed}/${allUniqueAddresses.length} addresses...`,
    )
  }
}

stats.total = allUniqueAddresses.length

// Write output files
console.log('\nWriting output files...')

await Deno.writeTextFile(
  'facility.json',
  JSON.stringify(facilityMappings, null, 2),
)
console.log('✓ facility.json written')

await Deno.writeTextFile('local.json', JSON.stringify(localMappings, null, 2))
console.log('✓ local.json written')

await Deno.writeTextFile('intl.json', JSON.stringify(intlMappings, null, 2))
console.log('✓ intl.json written')

await Deno.writeTextFile('garbage.json', JSON.stringify(garbage, null, 2))
console.log('✓ garbage.json written')

// Print statistics
console.log('\n=== Mapping Statistics ===')
console.log(`Total addresses:     ${stats.total}`)
console.log(
  `Facility mappings:   ${stats.facility} (${((stats.facility / stats.total) * 100).toFixed(2)}%)`,
)
console.log(
  `Local mappings:      ${stats.local} (${((stats.local / stats.total) * 100).toFixed(2)}%)`,
)
console.log(
  `International:       ${stats.intl} (${((stats.intl / stats.total) * 100).toFixed(2)}%)`,
)
console.log(
  `Garbage:             ${stats.garbage} (${((stats.garbage / stats.total) * 100).toFixed(2)}%)`,
)
console.log('\nDone!')
