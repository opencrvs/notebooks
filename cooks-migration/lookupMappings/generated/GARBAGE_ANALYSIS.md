# Garbage Analysis Report

Date: 2026-02-06
Total Garbage Entries: 2,712 (12.52% of 21,667 addresses)

## Executive Summary

The analysis identified 8 major patterns in unmapped addresses, with actionable recommendations to reduce garbage by an estimated **200-400 entries** through improved matching rules.

## Key Findings

### Pattern Breakdown

| Pattern | Count | % of Garbage |
|---------|-------|--------------|
| Single words (likely errors/dates) | 755 | 27.8% |
| Country name present but failed | 73 | 2.7% |
| Hospital/medical facility references | 70 | 2.6% |
| Very short entries (≤3 chars) | 34 | 1.3% |
| Special characters/formatting | 147 | 5.4% |
| Tahiti/French Polynesia | 13 | 0.5% |
| Numeric-only | 7 | 0.3% |
| Cook Islands locations | 2 | 0.1% |

### Top Terms in Garbage

1. **NEW** (163 entries) - Truncated "NEW ZEALAND" addresses (50 char limit)
2. **AUCKLAND** (107 entries) - NZ city addresses without country
3. **CHURCH** (100 entries) - Religious locations (CICC, Catholic, LMS)
4. **N** (76 entries) - Abbreviation fragments
5. **ISLANDS** (70 entries) - "Cook Islands" variations
6. **REPUBLIC** (66 entries) - Czech/Slovak Republic addresses
7. **Z** (65 entries) - "N.Z" fragments
8. **HOSPITAL** (65 entries) - Medical facilities
9. **S** (61 entries) - Abbreviation fragments
10. **CZECH** (61 entries) - Czech Republic addresses

## Actionable Improvements

### Priority 1: Discard Invalid Entries (High Impact, Low Effort)

**Impact:** ~150-200 entries removed from garbage

```typescript
// Add to processAddress() before any matching:
const trimmed = address.trim()

// Discard obviously invalid entries
if (
  trimmed.length <= 3 ||                    // Too short (34 entries)
  /^\d+$/.test(trimmed) ||                  // Pure numbers (7 entries)
  /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed) || // Dates like "14/02/2020"
  /^-+$/.test(trimmed) ||                   // Dashes only
  trimmed === 'NIL' ||                      // Explicit nulls
  trimmed === 'P' ||                        // Single letters
  trimmed === '0'                           // Zero
) {
  garbage.push(address)
  return
}
```

### Priority 2: Handle Truncated Addresses (Medium Impact, Medium Effort)

**Impact:** ~100-150 entries moved from garbage → international

Many addresses are truncated at exactly 50 characters:
- "102 TREMEWAN STREET LINDEN TAWA WELLINGTON, NEW ZE"
- "40 DARNELL CRESCENT, MANUKAU, AUCKLAND, NEW ZEALAN"
- "44 KUDU ROAD, OTARA, MANUKAU 2023, AUCKLAND, NEW Z"

```typescript
// After normalization:
let searchAddress = normalize(address)

// Handle truncated addresses - try completing common truncations
if (address.length >= 48) { // Close to 50 char limit
  // Try adding common completions
  const completions = [
    { pattern: /NEW ZE(A|AL|ALA|ALAN)?$/i, complete: 'NEW ZEALAND' },
    { pattern: /AUSTRALI?$/i, complete: 'AUSTRALIA' },
    { pattern: /GERMA?$/i, complete: 'GERMANY' },
    { pattern: /ENGLA?$/i, complete: 'ENGLAND' }
  ]
  
  for (const {pattern, complete} of completions) {
    if (pattern.test(searchAddress)) {
      searchAddress = searchAddress.replace(pattern, complete)
      break
    }
  }
}
```

### Priority 3: Expand Hospital Matching (Low Impact, Low Effort)

**Impact:** ~40-50 entries moved from garbage → facility

Add more hospital variants to [`seededFacilities.json`](./seededFacilities.json):

```typescript
// Examples from garbage:
"AUCKLAND HOSPITAL" → Rarotonga Hospital?
"AUCKLAND CITY HOSPITAL, AUCKLAND" → international
"CANTERBURY HOSPITAL" → international
"BLACKTOWN HOSPITAL, BLACKTOWN" → international
```

Most of these are **international** hospitals (not Cook Islands facilities).

**Recommendation:** Skip this - they should map to international locations instead.

### Priority 4: Handle Cook Islands Specific Locations (Medium Impact, High Effort)

**Impact:** ~80-100 entries moved from garbage → local

Many garbage entries are Cook Islands-specific location types:

#### Churches (100 entries with "CHURCH")
- "C.I.C.C. CHURCH YARD"
- "CATHOLIC CHURCH"
- "COOK ISLANDS CHRISTIAN CHURCH"
- "CICC CHURCH OIRETUMU CHURCH BUILDING"
- "ARE PURE L.M.S" (LMS = London Missionary Society)

#### Specific Places (37 entries with "ARE")
- "ARE OROMETUA" (Minister's house)
- "ARE PURE" (Church/prayer house)
- "AREMAUKU" (Traditional meeting place)
- "ONEROA" (57 entries - a specific location)

**Challenge:** These need to be mapped to their associated admin divisions, but may not exist in [`seededLocations.json`](../seededLocations.json).

**Recommendation:** 
1. Research whether these locations can be associated with specific Pcodes
2. Create a supplementary mapping file for religious/traditional locations
3. Or accept them as garbage if they can't be georeferenced

### Priority 5: Handle Tahiti/French Polynesia (Low Impact, Low Effort)

**Impact:** ~13 entries moved from garbage → international

Currently these fail because the script doesn't recognize them:
- "AFAREAITU, MOOREA"
- "BORA BORA"
- "HUAHINE"
- "PAPEETE"

```typescript
// Add special case in matchInternational:
const tahitiLocations = ['MOOREA', 'BORA BORA', 'HUAHINE', 'PAPEETE', 'TAHITI']
for (const location of tahitiLocations) {
  if (normalized.includes(location)) {
    return { country: 'PYF', town: location }
  }
}
```

### Priority 6: Handle Single-Word Entries Intelligently (Low Priority)

**Impact:** ~100-200 entries (case by case)

755 single-word entries include:
- Place names: "AREMAUKU", "ONEROA", "SUWARROW"
- Dates: "14/02/2020", "06 FEBRUARY 2014"
- Abbreviations: "N.Z", "AK.", "S.A."
- Errors: "---", "0", "NIL"

Most should be discarded (covered in Priority 1), but some are valid place names.

## Statistics

- **Average length:** 17.0 characters
- **Very short (≤3 chars):** 34 (1.3%)
- **Long (>50 chars):** 3 (0.1%)
- **Contains comma:** 963 (35.5%)
- **Contains slash:** 33 (1.2%)

## Implementation Priority

1. ✅ **Priority 1** - Discard invalid entries (immediate, low risk)
2. ✅ **Priority 2** - Handle truncated addresses (high value)
3. ⚠️ **Priority 3** - Skip hospital expansion (most are international)
4. 🔍 **Priority 4** - Research Cook Islands locations (requires domain knowledge)
5. ✅ **Priority 5** - Add Tahiti handling (quick win)
6. ⚠️ **Priority 6** - Single-word filtering (mostly covered by Priority 1)

## Expected Results

After implementing Priority 1, 2, and 5:

- **Current:** 2,712 garbage (12.52%)
- **After improvements:** ~2,400-2,500 garbage (11.1-11.5%)
- **Garbage reduction:** 200-300 entries (~8-11% improvement)

Priority 4 (Cook Islands locations) could reduce garbage by another 100-200 entries if location mappings are found.

## Files Generated

- [`garbage-analysis.csv`](./garbage-analysis.csv) - Full breakdown with terms
- [`GARBAGE_ANALYSIS.md`](./GARBAGE_ANALYSIS.md) - This report
- [`analyze-garbage.ts`](./analyze-garbage.ts) - Analysis script

## Next Steps

1. Review this analysis with domain experts
2. Implement Priority 1, 2, and 5 improvements in [`map-addresses.ts`](./map-addresses.ts)
3. Research Cook Islands location types with local knowledge
4. Re-run mapping and measure improvement
5. Iterate based on new garbage patterns
