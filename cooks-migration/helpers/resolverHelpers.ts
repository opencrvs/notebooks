import { Address } from './addressConfig.ts'
import { LocationMap, Name } from './types.ts'

export const toCrvsDate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export const toName = (firstname: string, surname: string): Name => ({
  firstname,
  surname,
})

export const toISODate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString()
}

export const resolveAddress = (
  addressString: string,
  locationMap: LocationMap[],
): Address | undefined => {
  const location = locationMap.find((loc) => loc.name === addressString)
  if (location?.map && location?.id) {
    return {
      addressType: 'DOMESTIC',
      country: 'COK',
      administrativeArea: location.id,
      streetLevelDetails: {},
    }
  }
  if (location?.intlTown) {
    return {
      addressType: 'INTERNATIONAL',
      country: location.country,
      streetLevelDetails: {
        town: location.intlTown,
      },
    }
  }
}
