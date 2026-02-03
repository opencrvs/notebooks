import registrarsRaw from './registrarsRaw.json' with { type: 'json' }

// Function to check if a string is likely a date
function isLikelyDate(str: string): boolean {
  // Check for date patterns like DD/MM/YYYY, D/M/YY, etc.
  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/
  return datePattern.test(str)
}

// Function to check if a string is likely bad data
function isBadData(str: string): boolean {
  if (!str || str.trim().length === 0) return true
  if (str === ')' || str === '`' || str === 'C' || str === 'V') return true
  if (isLikelyDate(str)) return true
  if (str.length < 2) return true
  return false
}

// Function to normalize a name for comparison
function normalizeName(name: string): string {
  return name
    .toUpperCase()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\./g, '') // Remove periods
    .replace(/,/g, '') // Remove commas
    .replace(/`/g, '') // Remove backticks
    .replace(/\(/g, ' ') // Replace parentheses with spaces
    .replace(/\)/g, ' ')
    .replace(/\\/g, '/') // Normalize slashes
    .replace(/\s+/g, ' ') // Clean up spaces again
    .trim()
}

// Function to extract the core name (remove titles, roles, etc.)
function extractCoreName(name: string): string {
  const normalized = normalizeName(name)

  // Remove common suffixes and roles
  const removals = [
    / D\/REGISTRAR.*$/,
    / DEPUTY REGISTRAR.*$/,
    / DEPUTY.*$/,
    / ACTING.*$/,
    / REGISTRAR.*$/,
    / CLERK IN CHARGE.*$/,
    / CIC.*$/,
    / DR.*$/,
    / D\.R.*$/,
    / CAO.*$/,
    / C\.I\.C\.?.*$/,
    / ACTING D\/R.*$/,
    / A\/D REGISTRAR.*$/,
    / FOR .*$/,
    / PER .*$/,
    /\d+\/\d+\/\d+.*$/, // Remove trailing dates
  ]

  let coreName = normalized
  for (const pattern of removals) {
    coreName = coreName.replace(pattern, '').trim()
  }

  return coreName
}

// Function to calculate similarity between two strings
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

// Levenshtein distance calculation
function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

// Main processing
const validNames = registrarsRaw.filter((name) => !isBadData(name))

// Group similar names
const groups: Map<string, string[]> = new Map()

for (const name of validNames) {
  const coreName = extractCoreName(name)

  // Skip if too short after extraction
  if (coreName.length < 2) continue

  // Find if this belongs to an existing group
  let foundGroup = false

  for (const [groupKey, groupMembers] of groups.entries()) {
    const groupCore = extractCoreName(groupKey)

    // Check similarity
    if (similarity(coreName, groupCore) > 0.85) {
      // Add to existing group if not already there
      if (!groupMembers.includes(name)) {
        groupMembers.push(name)
      }
      foundGroup = true
      break
    }
  }

  // If no matching group found, create a new one
  if (!foundGroup) {
    groups.set(name, [name])
  }
}

// Convert to the desired output format
const result = Array.from(groups.entries())
  .filter(([_, members]) => members.length >= 1) // Keep all groups
  .map(([key, members]) => {
    // Sort members to get a consistent "primary" name
    const sortedMembers = [...members].sort((a, b) => {
      // Prefer shorter names without special characters
      const aClean = a.replace(/[^A-Z]/g, '').length
      const bClean = b.replace(/[^A-Z]/g, '').length
      if (aClean !== bClean) return bClean - aClean
      return a.length - b.length
    })

    const primaryName = sortedMembers[0]
    const alternates = sortedMembers.slice(1)

    return {
      name: primaryName,
      alt: alternates,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

// Output the result
console.log(JSON.stringify(result, null, 2))

// Also save to a file
const outputPath = './registrars.json'
await Deno.writeTextFile(
  new URL(outputPath, import.meta.url),
  JSON.stringify(result, null, 2),
)

console.log(
  `\nProcessed ${validNames.length} valid names into ${result.length} unique groups`,
)
console.log(`Output saved to ${outputPath}`)
