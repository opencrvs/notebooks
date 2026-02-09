/**
 * Script to normalize registrar names and create mapping files
 *
 * Normalization rules:
 * - Uppercases
 * - Removes any text in parentheses
 * - Removes any special characters and numbers (except period .)
 * - Remove any instances of: D/REGISTRAR, REGISTRAR, DEPUTY, ACTING, CLERK, CHARGE, CLERK IN CHARGE
 * - Trims whitespace
 * - Replace whitespace between characters with a period . but never allow multiple periods
 */

function normalizeRegistrarName(name: string): string {
  // Uppercase
  let normalized = name.toUpperCase()

  // Remove text in parentheses (including the parentheses)
  normalized = normalized.replace(/\([^)]*\)/g, '')

  // Remove special characters and numbers, keeping only letters, spaces, and periods
  normalized = normalized.replace(/[^A-Z\s.]/g, '')

  // Trim whitespace
  normalized = normalized.trim()

  // Remove title/role words (order matters - remove longer phrases first)
  const titlesToRemove = [
    'CLERK IN CHARGE',
    'CLERK.IN.CHARGE',
    'D.REGISTRAR',
    'DREGISTRAR',
    'D REGISTRAR',
    'REGISTRAR',
    'DEPUTY',
    'ACTING',
    'CLERK',
    'CHARGE',
    'DR',
    'AR',
    'CAO',
    'CIC',
    'RA',
    'DEPYTY',
    'DEPT',
  ]

  for (const title of titlesToRemove) {
    // Create regex to match the title with various spacing/period combinations
    const titlePattern = title.split(/[\s.]+/).join('[\\s.]*')
    const regex = new RegExp(`\\b${titlePattern}\\b`, 'gi')
    normalized = normalized.replace(regex, '')
  }

  // Trim again after removing titles
  normalized = normalized.trim()

  // Replace whitespace with periods
  normalized = normalized.replace(/\s+/g, '.')

  // Remove multiple consecutive periods
  normalized = normalized.replace(/\.{2,}/g, '.')

  // Remove leading/trailing periods
  normalized = normalized.replace(/^\.+|\.+$/g, '')

  return normalized
}

async function main() {
  // Read the source file
  const sourceFile = await Deno.readTextFile(
    'cooks-migration/lookupMappings/allUniqueRegistrars.json',
  )
  const registrars: string[] = JSON.parse(sourceFile)

  console.log(`Processing ${registrars.length} registrar names...`)

  // Create the mapping object (un-normalized -> normalized)
  const mappedRegistrars: Record<string, string> = {}
  const uniqueNormalizedNames = new Set<string>()

  for (const registrar of registrars) {
    const normalized = normalizeRegistrarName(registrar)
    mappedRegistrars[registrar] = normalized
    if (normalized) {
      uniqueNormalizedNames.add(normalized)
    }
  }

  // Convert set to sorted array
  const allRegistrars = Array.from(uniqueNormalizedNames).sort()

  console.log(`Found ${allRegistrars.length} unique normalized registrar names`)
  console.log(`Created ${Object.keys(mappedRegistrars).length} mappings`)

  // Write the unique normalized names file
  await Deno.writeTextFile(
    'cooks-migration/lookupMappings/generated/allRegistrars.json',
    JSON.stringify(allRegistrars, null, 2),
  )

  console.log(
    '✓ Written: cooks-migration/lookupMappings/generated/allRegistrars.json',
  )

  // Write the mapping file
  await Deno.writeTextFile(
    'cooks-migration/lookupMappings/generated/mappedRegistrars.json',
    JSON.stringify(mappedRegistrars, null, 2),
  )

  console.log(
    '✓ Written: cooks-migration/lookupMappings/generated/mappedRegistrars.json',
  )

  // Print some examples
  console.log('\nExample mappings:')
  const examples = Object.entries(mappedRegistrars).slice(0, 10)
  for (const [original, normalized] of examples) {
    console.log(`  "${original}" -> "${normalized}"`)
  }
}

if (import.meta.main) {
  main()
}
