interface LocationEntry {
  name: string
  map: string | null
  facilityCode: string | null
  country: string | null
  intlTown: string | null
}

// Normalize string for comparison
function normalize(str: string): string {
  return str
    .toUpperCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1, // substitution
        )
      }
    }
  }

  return dp[m][n]
}

// Calculate similarity score (0-1, where 1 is perfect match)
function similarityScore(str1: string, str2: string): number {
  const norm1 = normalize(str1)
  const norm2 = normalize(str2)

  // Exact match
  if (norm1 === norm2) return 1.0

  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return 0.95
  }

  const maxLen = Math.max(norm1.length, norm2.length)
  if (maxLen === 0) return 0

  const distance = levenshteinDistance(norm1, norm2)
  return 1 - distance / maxLen
}

// Country codes and names array (derived from Countries type in addressConfig.ts)
const countries = [
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
] as const

// Common country name variations and abbreviations
const countryAliases: Record<string, string[]> = {
  USA: [
    'UNITED STATES',
    'UNITED STATES OF AMERICA',
    'U.S.A',
    'U S A',
    'US',
    'AMERICA',
  ],
  GBR: [
    'ENGLAND',
    'SCOTLAND',
    'WALES',
    'UNITED KINGDOM',
    'UK',
    'GREAT BRITAIN',
  ],
  NZL: [
    'NEW ZEALAND',
    'NEW ZEALANDA',
    'NEW ZEALNAD',
    'NEW ZELAND',
    'NZ',
    'N.Z',
    'N Z',
  ],
  AUS: ['AUSTRALIA', 'AUSTRLIA', 'AUSTRLAIA', 'ASTRALIA'],
  DEU: ['GERMANY', 'DEUTSCHLAND'],
  NLD: ['NETHERLANDS', 'HOLLAND'],
  CHN: ['CHINA', 'PRC', 'PEOPLES REPUBLIC OF CHINA'],
  FRA: ['FRANCE'],
  CAN: ['CANADA'],
  WSM: ['SAMOA', 'WESTERN SAMOA', 'W SAMOA'],
  ASM: ['AMERICAN SAMOA'],
  FJI: ['FIJI'],
  TON: ['TONGA'],
  PNG: ['PAPUA NEW GUINEA'],
  SLB: ['SOLOMON ISLANDS', 'SOLOMON ISLAND', 'SOLOMON', 'SOLOMONA ISLAND'],
  KIR: ['KIRIBATI'],
  PHL: ['PHILIPPINES', 'PHILLIPINE', 'PHILLIPINES'],
  THA: ['THAILAND'],
  IDN: ['INDONESIA'],
  MYS: ['MALAYSIA'],
  SGP: ['SINGAPORE'],
  JPN: ['JAPAN'],
  HKG: ['HONG KONG'],
  PYF: ['FRENCH POLYNESIA', 'TAHITI'],
  VUT: ['VANUATU'],
  NIU: ['NIUE'],
  GUM: ['GUAM'],
}

// Check if this looks like a domestic-only street address (no country name present)
function looksLikeDomesticStreetAddress(address: string): boolean {
  const normAddress = normalize(address)

  // Contains "C/O", "PO BOX", "ABOARD" - likely domestic
  if (/(C\/O|PO BOX|P\.O\. BOX|ABOARD)/i.test(normAddress)) {
    return true
  }

  // Check if it contains any country names or common country keywords
  const hasCountryKeyword =
    /(NEW ZEALAND|AUSTRALIA|SAMOA|FIJI|TONGA|KIRIBATI|USA|AMERICA|ENGLAND|SCOTLAND|WALES|GERMANY|FRANCE|CANADA|JAPAN|CHINA|SINGAPORE|MALAYSIA|THAILAND|INDONESIA|PHILIPPINES|NIUE)/i.test(
      address,
    )

  // If it has a country keyword, it's international (not domestic-only)
  if (hasCountryKeyword) {
    return false
  }

  // Now check for street addresses without country names
  // Starts with a number (street number) AND has street indicators
  if (/^\d+/.test(normAddress)) {
    if (
      /\b(ST|STREET|RD|ROAD|AVE|AVENUE|DR|DRIVE|LN|LANE|WAY|BLVD|BOULEVARD|PL|PLACE|CT|COURT)\b/.test(
        normAddress,
      )
    ) {
      return true
    }
  }

  return false
}

// Find country in address string
function findCountryInAddress(
  address: string,
): { code: string; countryName: string; remainingAddress: string } | null {
  const normAddress = normalize(address)

  // Skip obvious domestic-only street addresses
  if (looksLikeDomesticStreetAddress(address)) {
    return null
  }

  // Try exact matches and aliases first
  for (const country of countries) {
    const countryCode = country.code
    const countryName = country.name

    // Check if country name appears in address
    const normCountryName = normalize(countryName)
    if (normAddress.includes(normCountryName)) {
      // Extract the town part (everything before the country name)
      const countryIndex = normAddress.indexOf(normCountryName)
      const townPart = address.substring(0, countryIndex).trim()
      return {
        code: countryCode,
        countryName: countryName,
        remainingAddress: townPart,
      }
    }

    // Check aliases
    const aliases = countryAliases[countryCode] || []
    for (const alias of aliases) {
      const normAlias = normalize(alias)
      if (normAddress.includes(normAlias)) {
        const aliasIndex = normAddress.indexOf(normAlias)
        const townPart = address.substring(0, aliasIndex).trim()
        return {
          code: countryCode,
          countryName: alias,
          remainingAddress: townPart,
        }
      }
    }
  }

  // Try fuzzy matching for potential misspellings
  // ONLY match if the country name appears near the END of the address
  for (const country of countries) {
    const countryCode = country.code
    const countryName = country.name
    const normCountryName = normalize(countryName)

    // Skip very short country names for fuzzy matching (too many false positives)
    if (normCountryName.length < 4) {
      continue
    }

    // Split address into words and look for fuzzy matches
    const words = normAddress.split(/\s+/)

    // Only check the last few words (country names typically appear at the end)
    const startIndex = Math.max(0, words.length - 5)

    for (let i = startIndex; i < words.length; i++) {
      // Try single words (must be long enough to avoid false positives)
      if (words[i].length >= 5) {
        const score = similarityScore(words[i], normCountryName)
        if (score >= 0.9) {
          // Higher threshold for single words
          const beforeCountry = address
            .split(/\s+/)
            .slice(0, i)
            .join(' ')
            .trim()
          // Ensure there's actually a town/city part
          if (beforeCountry.length > 0) {
            return {
              code: countryCode,
              countryName: countryName,
              remainingAddress: beforeCountry,
            }
          }
        }
      }

      // Try two-word combinations (for "NEW ZEALAND", etc.)
      if (i < words.length - 1) {
        const twoWords = words[i] + ' ' + words[i + 1]
        const score2 = similarityScore(twoWords, normCountryName)
        if (score2 >= 0.85) {
          const beforeCountry = address
            .split(/\s+/)
            .slice(0, i)
            .join(' ')
            .trim()
          return {
            code: countryCode,
            countryName: countryName,
            remainingAddress: beforeCountry,
          }
        }
      }

      // Try three-word combinations (for "UNITED STATES OF AMERICA", etc.)
      if (i < words.length - 2) {
        const threeWords = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]
        const score3 = similarityScore(threeWords, normCountryName)
        if (score3 >= 0.85) {
          const beforeCountry = address
            .split(/\s+/)
            .slice(0, i)
            .join(' ')
            .trim()
          return {
            code: countryCode,
            countryName: countryName,
            remainingAddress: beforeCountry,
          }
        }
      }
    }

    // Also check aliases with fuzzy matching (only at the end)
    const aliases = countryAliases[countryCode] || []
    for (const alias of aliases) {
      const normAlias = normalize(alias)
      const aliasWords = normAlias.split(/\s+/)

      // Skip very short aliases
      if (normAlias.length < 3) {
        continue
      }

      const startIndex = Math.max(0, words.length - aliasWords.length - 2)
      for (let i = startIndex; i <= words.length - aliasWords.length; i++) {
        const segment = words.slice(i, i + aliasWords.length).join(' ')
        const score = similarityScore(segment, normAlias)
        if (score >= 0.85) {
          const beforeCountry = address
            .split(/\s+/)
            .slice(0, i)
            .join(' ')
            .trim()
          // Ensure there's actually a town/city part
          if (beforeCountry.length > 0) {
            return {
              code: countryCode,
              countryName: alias,
              remainingAddress: beforeCountry,
            }
          }
        }
      }
    }
  }

  return null
}

// Clean up the town/city portion of the address
function cleanTownName(town: string): string {
  return town
    .trim()
    .replace(/[,;]+$/, '') // Remove trailing punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/^\d+\s+/, '') // Remove leading street numbers
    .trim()
}

// Validate that the remaining address has meaningful location information
function hasValidTownName(town: string): boolean {
  if (!town || town.length === 0) {
    return false
  }

  // After cleaning, must have at least one letter
  const cleaned = cleanTownName(town)
  if (!cleaned || cleaned.length === 0) {
    return false
  }

  // Can't be just numbers or punctuation
  if (/^[\d\s,;.'-]+$/.test(cleaned)) {
    return false
  }

  // Must have at least 2 characters of actual content
  if (cleaned.replace(/[\s,;.'-]/g, '').length < 2) {
    return false
  }

  return true
}

// Main function
async function mapInternationalLocations() {
  console.log('Loading locationsRaw.json...')
  const jsonPath = 'cooks-migration/lookupMappings/locationsRaw.json'
  const jsonContent = await Deno.readTextFile(jsonPath)
  const locations: LocationEntry[] = JSON.parse(jsonContent)
  console.log(`Processing ${locations.length} location entries`)

  let matchedCount = 0
  let skippedCookIslands = 0
  let unmatchedCount = 0
  const matchedExamples: Array<{
    name: string
    country: string
    town: string
  }> = []
  const unmatchedExamples: string[] = []

  // First, reset all international location mappings to reprocess with new logic
  console.log('\nResetting international location mappings...')
  let resetCount = 0
  for (const location of locations) {
    // Only reset non-Cook Islands entries
    if (!location.map || !location.map.startsWith('COK-')) {
      if (location.country || location.intlTown) {
        location.country = null
        location.intlTown = null
        resetCount++
      }
    }
  }
  console.log(`Reset ${resetCount} previously mapped international locations`)

  console.log('\nProcessing locations...')
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i]

    if (i % 1000 === 0) {
      console.log(`Progress: ${i}/${locations.length}`)
    }

    // Skip Cook Islands locations (they have a map code starting with "COK-")
    if (location.map && location.map.startsWith('COK-')) {
      skippedCookIslands++
      continue
    }

    // Try to find country in the address name
    const match = findCountryInAddress(location.name)

    if (match && hasValidTownName(match.remainingAddress)) {
      location.country = match.code
      location.intlTown = cleanTownName(match.remainingAddress) || null
      matchedCount++

      // Collect examples
      if (matchedExamples.length < 50) {
        matchedExamples.push({
          name: location.name,
          country: match.code,
          town: location.intlTown || '',
        })
      }
    } else {
      unmatchedCount++
      if (unmatchedExamples.length < 50) {
        unmatchedExamples.push(location.name)
      }
    }
  }

  console.log('\n=== Results ===')
  console.log(`Total entries: ${locations.length}`)
  console.log(`Cook Islands (skipped): ${skippedCookIslands}`)
  console.log(
    `International matched: ${matchedCount} (${((matchedCount / locations.length) * 100).toFixed(1)}%)`,
  )
  console.log(
    `Unmatched/Domestic: ${unmatchedCount} (${((unmatchedCount / locations.length) * 100).toFixed(1)}%)`,
  )

  if (matchedExamples.length > 0) {
    console.log('\nSample matched international addresses:')
    matchedExamples.slice(0, 20).forEach((ex) => {
      console.log(
        `  "${ex.name}" -> ${ex.country} (town: "${ex.town || 'N/A'}")`,
      )
    })
  }

  if (unmatchedExamples.length > 0) {
    console.log('\nSample unmatched names (likely domestic):')
    unmatchedExamples.slice(0, 20).forEach((name) => console.log(`  - ${name}`))
  }

  console.log('\nSaving updated JSON...')
  await Deno.writeTextFile(jsonPath, JSON.stringify(locations, null, 2))

  console.log('Done! Updated file saved to:', jsonPath)
}

// Run the script
if (import.meta.main) {
  await mapInternationalLocations()
}
