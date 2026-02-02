interface LocationEntry {
  name: string
  map: string | null
  facilityCode: string | null
  country: string | null
  intlTown: string | null
}

interface Facility {
  name: string
  id: string
}

// Normalize string for comparison
function normalize(str: string): string {
  return str
    .toUpperCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Main function
async function mapFacilities() {
  console.log('Loading facilities.json...')
  const facilitiesPath = 'cooks-migration/lookupMappings/facilities.json'
  const facilitiesContent = await Deno.readTextFile(facilitiesPath)
  const facilities: Facility[] = JSON.parse(facilitiesContent)
  console.log(`Loaded ${facilities.length} facilities`)

  console.log('\nLoading locationsRaw.json...')
  const locationsPath = 'cooks-migration/lookupMappings/locationsRaw.json'
  const locationsContent = await Deno.readTextFile(locationsPath)
  const locations: LocationEntry[] = JSON.parse(locationsContent)
  console.log(`Loaded ${locations.length} location entries`)

  // Create a map of normalized facility names to facility IDs
  const facilityMap = new Map<string, string>()
  for (const facility of facilities) {
    const normalizedName = normalize(facility.name)
    facilityMap.set(normalizedName, facility.id)
    console.log(`  Facility: "${facility.name}" -> ${facility.id}`)
  }

  console.log('\nProcessing locations...')
  let matchedCount = 0
  let resetPropertiesCount = 0
  const matchedExamples: Array<{ name: string; facilityId: string }> = []

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i]
    const normalizedLocationName = normalize(location.name)

    if (i % 1000 === 0) {
      console.log(`Progress: ${i}/${locations.length}`)
    }

    // Check if location name matches any facility name
    const facilityId = facilityMap.get(normalizedLocationName)

    if (facilityId) {
      // Set the facility code
      location.facilityCode = facilityId

      // Clear other properties if they were set
      let hadOtherProperties = false
      if (location.map !== null) {
        location.map = null
        hadOtherProperties = true
      }
      if (location.country !== null) {
        location.country = null
        hadOtherProperties = true
      }
      if (location.intlTown !== null) {
        location.intlTown = null
        hadOtherProperties = true
      }

      matchedCount++
      if (hadOtherProperties) {
        resetPropertiesCount++
      }

      // Collect examples
      if (matchedExamples.length < 20) {
        matchedExamples.push({
          name: location.name,
          facilityId: facilityId,
        })
      }
    }
  }

  console.log('\n=== Results ===')
  console.log(`Total location entries: ${locations.length}`)
  console.log(`Matched to facilities: ${matchedCount}`)
  console.log(
    `Had other properties reset: ${resetPropertiesCount} (map/country/intlTown cleared)`,
  )

  if (matchedExamples.length > 0) {
    console.log('\nMatched location entries:')
    matchedExamples.forEach((ex) => {
      console.log(`  "${ex.name}" -> facility ID: ${ex.facilityId}`)
    })
  }

  console.log('\nSaving updated JSON...')
  await Deno.writeTextFile(locationsPath, JSON.stringify(locations, null, 2))

  console.log('Done! Updated file saved to:', locationsPath)
}

// Run the script
if (import.meta.main) {
  await mapFacilities()
}
