#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Manual classification script for garbage entries
 * Processes each garbage entry and classifies it into the appropriate category
 */

// Load current files
const garbage: string[] = JSON.parse(await Deno.readTextFile('garbage.json'))
const local = JSON.parse(await Deno.readTextFile('local.json'))
const intl = JSON.parse(await Deno.readTextFile('intl.json'))
const facility = JSON.parse(await Deno.readTextFile('facility.json'))

// Country list for reference
const countries = JSON.parse(
  await Deno.readTextFile('../../helpers/addressConfig.ts').then((text) => {
    // Extract countries array from the TypeScript file
    const match = text.match(
      /export const countries:\s*Country\[\]\s*=\s*(\[[^\]]+\])/s,
    )
    if (!match) throw new Error('Could not find countries array')
    // Simple extraction - get country names
    const names: string[] = []
    const nameMatches = match[1].matchAll(/name:\s*'([^']+)'/g)
    for (const m of nameMatches) {
      names.push(m[1].toUpperCase())
    }
    return JSON.stringify(names)
  }),
)

console.log(`\nManual Classification Tool`)
console.log(`=========================`)
console.log(`Total garbage entries: ${garbage.length}\n`)
console.log(`Instructions:`)
console.log(`- Review each entry`)
console.log(
  `- Press 'i' for international, 'l' for local, 'f' for facility, 'g' for keep as garbage`,
)
console.log(`- For 'i', you'll be prompted for country code and town`)
console.log(`- For 'l', you'll be prompted for Pcode`)
console.log(`- For 'f', you'll be prompted for facility ID\n`)

// Track modifications
const newGarbage: string[] = []
let classified = 0
let skipped = 0

// Process first 50 entries for now
const batch = garbage.slice(0, Math.min(50, garbage.length))

console.log(`Processing first ${batch.length} entries...\n`)

for (let i = 0; i < batch.length; i++) {
  const entry = batch[i]
  console.log(`\n[${i + 1}/${batch.length}] "${entry}"`)

  // Automatic classification logic
  let classification = 'unknown'
  let details: any = null

  // Check if it contains a recognizable country name
  const upper = entry.toUpperCase()

  // Pattern 1: Contains TANZANIA
  if (/\bTANZANIA\b/i.test(entry)) {
    classification = 'international'
    const town = entry.replace(/,?\s*TANZANIA\s*$/i, '').trim()
    details = { country: 'TZA', town }
    console.log(`  → Auto-classified as INTERNATIONAL: Tanzania`)
  }
  // Pattern 2: Contains recognizable country at end
  else if (
    /,\s*(CANADA|JAPAN|CHINA|INDIA|BRAZIL|MEXICO|CHILE|PERU|ARGENTINA)\s*$/i.test(
      entry,
    )
  ) {
    const match = entry.match(
      /,?\s*(CANADA|JAPAN|CHINA|INDIA|BRAZIL|MEXICO|CHILE|PERU|ARGENTINA)\s*$/i,
    )
    if (match) {
      const countryName = match[1].toUpperCase()
      const countryMap: Record<string, string> = {
        CANADA: 'CAN',
        JAPAN: 'JPN',
        CHINA: 'CHN',
        INDIA: 'IND',
        BRAZIL: 'BRA',
        MEXICO: 'MEX',
        CHILE: 'CHL',
        PERU: 'PER',
        ARGENTINA: 'ARG',
      }
      const town = entry
        .replace(
          /,?\s*(CANADA|JAPAN|CHINA|INDIA|BRAZIL|MEXICO|CHILE|PERU|ARGENTINA)\s*$/i,
          '',
        )
        .trim()
      details = { country: countryMap[countryName], town }
      classification = 'international'
      console.log(`  → Auto-classified as INTERNATIONAL: ${countryName}`)
    }
  }
  // Pattern 3: Pure dates/numbers/dashes
  else if (
    /^[0-9\/\-\s]+$/.test(entry) ||
    entry.length <= 2 ||
    /^-+$/.test(entry)
  ) {
    classification = 'garbage'
    console.log(`  → Auto-classified as GARBAGE (invalid)`)
  }
  // Pattern 4: Cook Islands religious locations (keep as garbage for now - needs local knowledge)
  else if (
    /\b(CHURCH|CICC|LMS|CATHOLIC|MISSION|OROMETUA|ARE PURE)\b/i.test(entry)
  ) {
    classification = 'garbage'
    console.log(
      `  → Keeping as GARBAGE (CI religious/cultural - needs local knowledge)`,
    )
  }
  // Pattern 5: Generic street address without city (keep as garbage)
  else if (
    /^\d+\s+[A-Z\s]+(?:STREET|ROAD|AVENUE|DRIVE|PLACE|COURT|LANE|CRESCENT)\b/i.test(
      entry,
    ) &&
    entry.length < 40
  ) {
    classification = 'garbage'
    console.log(`  → Keeping as GARBAGE (generic street, no city)`)
  }

  // Apply classification
  if (classification === 'international' && details) {
    intl[entry] = details
    classified++
    console.log(`  ✓ Added to intl.json`)
  } else if (classification === 'garbage') {
    newGarbage.push(entry)
    skipped++
  } else {
    // Keep as garbage if unknown
    newGarbage.push(entry)
    skipped++
    console.log(`  → Keeping as garbage (no auto-rule matched)`)
  }
}

// Add remaining unprocessed entries back to garbage
for (let i = batch.length; i < garbage.length; i++) {
  newGarbage.push(garbage[i])
}

// Write updated files
await Deno.writeTextFile('intl.json', JSON.stringify(intl, null, 2))
await Deno.writeTextFile('garbage.json', JSON.stringify(newGarbage, null, 2))
await Deno.writeTextFile('local.json', JSON.stringify(local, null, 2))
await Deno.writeTextFile('facility.json', JSON.stringify(facility, null, 2))

console.log(`\n\n=== Summary ===`)
console.log(`Processed: ${batch.length} entries`)
console.log(`Classified: ${classified}`)
console.log(`Kept as garbage: ${skipped}`)
console.log(`Remaining garbage: ${newGarbage.length}`)
console.log(`\nFiles updated!`)
