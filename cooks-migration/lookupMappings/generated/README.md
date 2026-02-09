# Generated Address Mappings

This directory contains the output of the address mapping script that processes free-text addresses from migration data and maps them to structured locations.

**Key features:**
- Uses ALL 260+ countries from addressConfig
- Handles multiple spaces (e.g., "NEW  ZEALAND")
- Hospital variant matching (e.g., "HOSPITAL RAROTNGA" → Rarotonga Hospital)
- Word-boundary matching for country names
- Fuzzy matching for typos with Levenshtein distance

## Generated Files

### 1. `facility.json` (147 mappings, 0.68%)
Maps addresses to Cook Islands health facilities (hospitals and clinics).

**Format:** `Record<addressString, facilityId>`

**Example:**
```json
{
  "AITUTAKI HOSPITAL": "nLhbC6Mf8qCQRUXf7oRpoS",
  "RAROTONGA HOSPITAL": "bBn8BC9cfog8L1DFgojhfp"
}
```

### 2. `local.json` (9,000 mappings, 41.54%)
Maps addresses to Cook Islands administrative locations using Pcodes.

**Format:** `Record<addressString, Pcode>`

**Example:**
```json
{
  "ARORANGI,RAROTONGA": "COK-001-005",
  "AVARUA": "COK-001-001"
}
```

**Notes:**
- The script favors the highest-level location match
- Pcodes follow the format: `COK-{admin1}-{admin2}-{admin3}`
- Admin levels: 1=Island, 2=District, 3=Village

### 3. `intl.json` (10,230 mappings, 47.21%)
Maps addresses to international locations with country codes and town information.

**Format:** `Record<addressString, { country: string, town: string }>`

**Example:**
```json
{
  "10 DILLON CRES WIRI AUCKLAND NEW ZEALAND": {
    "country": "NZL",
    "town": "10 DILLON CRES WIRI AUCKLAND"
  }
}
```

**Notes:**
- Country codes are ISO 3166-1 alpha-3 format (e.g., NZL, AUS, GBR)
- The town field contains the address with the country name removed

### 4. `garbage.json` (2,122 entries, 9.79%)
Contains addresses that could not be mapped to any valid location.

**Format:** `string[]`

**Examples:**
- Addresses with no alphabetical characters: `"0"`, `"---------------"`
- Invalid data: `"(AT WAR)"`, dates like `"03/12/2019"`
- Incomplete addresses that don't match any known location

## Mapping Algorithm

The script processes each address through the following steps:

1. **Invalid Entry Filter**: Discard obviously invalid entries (too short, dates, pure numbers)
2. **Garbage Filter**: Discard entries with no alphabetical characters
3. **Address Preprocessing**: Handle truncated addresses, Auckland implied-NZ, Czech Republic variants
4. **International Matching**: Detect country names and extract remaining address as town
5. **Facility Matching**: Try to match hospital/clinic names using fuzzy matching
6. **Local Location Matching**: Match Cook Islands locations, preferring higher admin levels
7. **Final Garbage**: If all attempts fail, mark as garbage

### Fuzzy Matching

The script uses several techniques to handle typos and variations:
- Normalization (uppercase, remove non-alphanumeric)
- Levenshtein distance calculation
- Substring matching
- Country name variations (e.g., "NZ" → "New Zealand", "UK" → "United Kingdom")
- Truncation completion for addresses cut at 50 characters
- Implied country detection (e.g., "AUCKLAND" → adds "NEW ZEALAND")
- Country name normalization (e.g., "CZECH REPUBLIC" → "CZECHIA")

## Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| **Total Addresses** | 21,667 | 100% |
| Facility mappings | 147 | 0.68% |
| Local mappings | 9,000 | 41.54% |
| International | 10,398 | 47.99% |
| Garbage | 2,122 | 9.79% |

**Success Rate: 90.21%** (non-garbage entries)

**Total Improvements:**
- Reduced garbage by 590 entries (21.8% reduction from 2,712 → 2,122)
- Added 621 international mappings (from 9,777 → 10,398)
- Improved success rate from 87.48% → 90.21% (2.73% improvement)

**Features Added:**
- **Country name typo fixes**: Philippines (PHILLIPINES, PHILIPINES, PHILLIPINESS), United Kingdom (UNTIED KINGDOM, KINDGOM)
- **New Zealand typos**: "NEW  ZEALAND", "NEEW ZEALAND", "NE ZEALAND", "HEW ZEALAND", "NE WZEALAND", "NEW ZEALANDS", "NEW ZEALND"
- **Implicit NZ detection**: 36 cities (AUCKLAND, WELLINGTON, CHRISTCHURCH, HAMILTON, TAURANGA, NAPIER, DUNEDIN, etc.)
- **Implicit Australian detection**: State codes (NSW, QLD, VIC, ACT, SA, WA, TAS, NT) and major cities
- **Czech/Slovak Republic** variations handling
- **Truncated address completion** (50-char limit fixes)
- **Tahiti/French Polynesia** special handling (PYF)
- **Netherlands variations**: NEDERLAND, NEDERLANDS, NEDERLANDSE → NETHERLANDS
- **Russia variations**: RUSSIA, USSR → RUSSIAN FEDERATION
- **South Korea**: SOUTH KOREA → REPUBLIC OF KOREA
- **Bosnia**: BOSNIA, BOSNIA-HERZEGOVINA, BOSNIEN AND HERCEGOVINA → BOSNIA AND HERZEGOVINA
- **Yugoslavia**: Mapped to SERBIA (successor state)
- **Tanzania, Venezuela** normalization

### Remaining Garbage Breakdown (2,122 entries)
- **193 entries (8.6%)**: Cook Islands religious/cultural locations (churches, mission grounds, "ARE PURE", "ARE OROMETUA", "CICC", "LMS")
- **~850 entries**: Generic street addresses without city/country context
- **~300 entries**: Truncated addresses that can't be completed
- **~200 entries**: Invalid/ambiguous data (dates, very short entries, single words)
- **~696 entries**: Other (partial addresses, typos that don't match patterns, etc.)

**Success rate:** 87.58% of addresses successfully mapped to valid locations.

## Usage in Migration

These mapping files should be used during data migration to convert legacy free-text addresses into the structured format required by OpenCRVS v2.

### Example Usage

```typescript
import facilityMappings from './generated/facility.json' assert { type: 'json' };
import localMappings from './generated/local.json' assert { type: 'json' };
import intlMappings from './generated/intl.json' assert { type: 'json' };

function resolveAddress(rawAddress: string) {
  // Check facility mapping
  if (facilityMappings[rawAddress]) {
    return { type: 'FACILITY', id: facilityMappings[rawAddress] };
  }
  
  // Check local mapping
  if (localMappings[rawAddress]) {
    return { type: 'DOMESTIC', pcode: localMappings[rawAddress] };
  }
  
  // Check international mapping
  if (intlMappings[rawAddress]) {
    return { 
      type: 'INTERNATIONAL', 
      country: intlMappings[rawAddress].country,
      town: intlMappings[rawAddress].town
    };
  }
  
  // Unknown/garbage
  return { type: 'UNKNOWN', raw: rawAddress };
}
```

## Source Files

- **Input**: `../allUniqueAddresses.json` (21,667 unique addresses)
- **Reference Data**:
  - `../seededLocations.json` - Cook Islands admin structure
  - `../seededFacilities.json` - Health facilities
  - `../../helpers/addressConfig.ts` - Country codes

## Script

The mapping was generated using [`map-addresses.ts`](./map-addresses.ts).

To regenerate the mappings:

```bash
deno run --allow-read --allow-write cooks-migration/lookupMappings/generated/map-addresses.ts
```

## Notes

- Some addresses in `local.json` may have been incorrectly matched if they contain location names as part of international addresses
- Manual review of edge cases in the garbage.json file may reveal additional mappable addresses
- The fuzzy matching threshold can be adjusted in the script for stricter/looser matching
