#!/usr/bin/env -S deno run --allow-read --allow-write

// Analyze garbage.json to find patterns and suggest improvements

interface TermFrequency {
  term: string
  count: number
  examples: string[]
}

interface Pattern {
  pattern: string
  count: number
  examples: string[]
  suggestion: string
}

// Read garbage.json
const garbage: string[] = JSON.parse(await Deno.readTextFile('garbage.json'))

console.log(`Total garbage entries: ${garbage.length}\n`)

// Split all entries into terms and count frequency
const termCounts = new Map<string, Set<string>>()

for (const entry of garbage) {
  const normalized = entry.toUpperCase().trim()

  // Split by common delimiters
  const terms = normalized.split(/[\s,\.\/\-]+/).filter((t) => t.length > 0)

  for (const term of terms) {
    if (!termCounts.has(term)) {
      termCounts.set(term, new Set())
    }
    termCounts.get(term)!.add(entry)
  }
}

// Convert to sorted array
const termFrequencies: TermFrequency[] = []
for (const [term, entries] of termCounts.entries()) {
  termFrequencies.push({
    term,
    count: entries.size,
    examples: Array.from(entries).slice(0, 5),
  })
}

termFrequencies.sort((a, b) => b.count - a.count)

// Print top 50 terms
console.log('='.repeat(80))
console.log('TOP 50 MOST COMMON TERMS IN GARBAGE')
console.log('='.repeat(80))
for (let i = 0; i < Math.min(50, termFrequencies.length); i++) {
  const tf = termFrequencies[i]
  console.log(`\n${i + 1}. "${tf.term}" - appears in ${tf.count} entries`)
  console.log(`   Examples:`)
  tf.examples.forEach((ex) => console.log(`   - ${ex}`))
}

// Analyze patterns
console.log('\n\n')
console.log('='.repeat(80))
console.log('PATTERN ANALYSIS')
console.log('='.repeat(80))

const patterns: Pattern[] = []

// Pattern 1: Entries with Cook Islands location names but not in local.json
const cookIslandsLocations = [
  'RAROTONGA',
  'AITUTAKI',
  'ATIU',
  'MAUKE',
  'MITIARO',
  'MANGAIA',
  'PENRHYN',
  'RAKAHANGA',
  'MANIHIKI',
  'PUKAPUKA',
  'NASSAU',
  'SUWARROW',
  'PALMERSTON',
  'ARORANGI',
  'AVARUA',
  'NGATANGIIA',
  'MATAVERA',
  'TITIKAVEKA',
]

const cookIslandsEntries = garbage.filter((entry) => {
  const upper = entry.toUpperCase()
  return cookIslandsLocations.some((loc) => upper.includes(loc))
})

if (cookIslandsEntries.length > 0) {
  patterns.push({
    pattern: 'Cook Islands locations in garbage',
    count: cookIslandsEntries.length,
    examples: cookIslandsEntries.slice(0, 10),
    suggestion:
      'These contain Cook Islands location names but failed to match. Check for extra text, typos, or missing locations in seededLocations.json',
  })
}

// Pattern 2: Entries with country names
const countriesInGarbage = garbage.filter((entry) => {
  const upper = entry.toUpperCase()
  return /NEW ZEALAND|AUSTRALIA|USA|UK|FIJI|SAMOA|TAHITI|FRANCE|GERMANY|ENGLAND|CANADA/i.test(
    entry,
  )
})

if (countriesInGarbage.length > 0) {
  patterns.push({
    pattern: 'Entries with recognizable country names',
    count: countriesInGarbage.length,
    examples: countriesInGarbage.slice(0, 10),
    suggestion:
      'These contain country names but failed international matching. Likely due to formatting issues or missing town extraction logic',
  })
}

// Pattern 3: Short entries (likely incomplete)
const shortEntries = garbage.filter((entry) => entry.length <= 3)

if (shortEntries.length > 0) {
  patterns.push({
    pattern: 'Very short entries (<=3 chars)',
    count: shortEntries.length,
    examples: shortEntries.slice(0, 20),
    suggestion:
      'Too short to be meaningful. Consider discarding entries under 4 characters',
  })
}

// Pattern 4: Numeric-only or mostly numeric
const numericEntries = garbage.filter((entry) => /^\d+$/.test(entry.trim()))

if (numericEntries.length > 0) {
  patterns.push({
    pattern: 'Numeric-only entries',
    count: numericEntries.length,
    examples: numericEntries.slice(0, 20),
    suggestion: 'Pure numbers should be discarded as invalid addresses',
  })
}

// Pattern 5: Single words without context
const singleWords = garbage.filter(
  (entry) => !entry.includes(' ') && !entry.includes(','),
)

if (singleWords.length > 0) {
  patterns.push({
    pattern: 'Single words (no spaces or commas)',
    count: singleWords.length,
    examples: singleWords.slice(0, 20),
    suggestion:
      'Single words are difficult to map. Could be island names, family names, or errors',
  })
}

// Pattern 6: Entries with "HOSPITAL" or medical terms
const hospitalEntries = garbage.filter((entry) =>
  /HOSPITAL|CLINIC|MATERNITY|MEDICAL/i.test(entry),
)

if (hospitalEntries.length > 0) {
  patterns.push({
    pattern: 'Medical facility references',
    count: hospitalEntries.length,
    examples: hospitalEntries.slice(0, 10),
    suggestion:
      'These mention facilities but failed facility matching. Add more variants to seededFacilities.json',
  })
}

// Pattern 7: Entries with special characters or unusual formatting
const specialCharEntries = garbage.filter(
  (entry) => /[^\w\s,\.\-\/]/.test(entry) || /\s{2,}/.test(entry),
)

if (specialCharEntries.length > 0) {
  patterns.push({
    pattern: 'Special characters or formatting issues',
    count: specialCharEntries.length,
    examples: specialCharEntries.slice(0, 10),
    suggestion:
      'Entries with unusual characters or multiple spaces. Improve normalization',
  })
}

// Pattern 8: Tahiti/French Polynesia entries
const tahitiEntries = garbage.filter((entry) =>
  /TAHITI|PAPEETE|MOOREA|BORA BORA|HUAHINE|FRENCH POLYNESIA/i.test(entry),
)

if (tahitiEntries.length > 0) {
  patterns.push({
    pattern: 'Tahiti/French Polynesia references',
    count: tahitiEntries.length,
    examples: tahitiEntries.slice(0, 10),
    suggestion:
      'French Polynesia entries need special handling - country code PYF',
  })
}

// Print patterns
patterns.forEach((pattern, idx) => {
  console.log(`\nPattern ${idx + 1}: ${pattern.pattern}`)
  console.log(`Count: ${pattern.count}`)
  console.log(`Suggestion: ${pattern.suggestion}`)
  console.log(`Examples:`)
  pattern.examples.forEach((ex) => console.log(`  - ${ex}`))
})

// Statistics
console.log('\n\n')
console.log('='.repeat(80))
console.log('STATISTICS')
console.log('='.repeat(80))

const avgLength = garbage.reduce((sum, e) => sum + e.length, 0) / garbage.length
const shortCount = garbage.filter((e) => e.length <= 3).length
const longCount = garbage.filter((e) => e.length > 50).length
const withComma = garbage.filter((e) => e.includes(',')).length
const withSlash = garbage.filter((e) => e.includes('/')).length

console.log(`Average length: ${avgLength.toFixed(1)} characters`)
console.log(
  `Very short (<=3 chars): ${shortCount} (${((shortCount / garbage.length) * 100).toFixed(1)}%)`,
)
console.log(
  `Long (>50 chars): ${longCount} (${((longCount / garbage.length) * 100).toFixed(1)}%)`,
)
console.log(
  `Contains comma: ${withComma} (${((withComma / garbage.length) * 100).toFixed(1)}%)`,
)
console.log(
  `Contains slash: ${withSlash} (${((withSlash / garbage.length) * 100).toFixed(1)}%)`,
)

// Generate detailed CSV report
const csvLines = [
  'Address,Length,Has Comma,Has Slash,Top Term,Second Term,Third Term',
]

for (const entry of garbage) {
  const normalized = entry.toUpperCase().trim()
  const terms = normalized.split(/[\s,\.\/\-]+/).filter((t) => t.length > 0)
  const topTerms = terms
    .slice(0, 3)
    .map((t) => `"${t}"`)
    .join(',')
  const missing = 3 - Math.min(3, terms.length)
  const padding = ','.repeat(missing)

  csvLines.push(
    `"${entry.replace(/"/g, '""')}",${entry.length},${entry.includes(',')},${entry.includes('/')},${topTerms}${padding}`,
  )
}

await Deno.writeTextFile('garbage-analysis.csv', csvLines.join('\n'))
console.log(`\n✓ Detailed report saved to garbage-analysis.csv`)

console.log('\n' + '='.repeat(80))
console.log('RECOMMENDATIONS')
console.log('='.repeat(80))

console.log(`
1. Discard entries under 4 characters (${shortCount} entries)
2. Discard pure numeric entries (${numericEntries.length} entries)
3. Add ${cookIslandsEntries.length} Cook Islands entries by improving location matching
4. Add ${hospitalEntries.length} facility entries by expanding facility variants
5. Improve international matching for ${countriesInGarbage.length} entries with country names
6. Handle Tahiti/French Polynesia specially (${tahitiEntries.length} entries)
7. Consider single-word entries case-by-case (${singleWords.length} entries)

Estimated garbage reduction: ${shortCount + numericEntries.length} entries (${(((shortCount + numericEntries.length) / garbage.length) * 100).toFixed(1)}%)
`)
