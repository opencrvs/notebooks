import { Address } from './addressConfig.ts'
import { Gender, LocationMap, Name } from './types.ts'

export const toCrvsDate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export const toName = (firstname: string, surname: string): Name => ({
  firstname,
  surname,
})

export const deriveName = (name: string): Name => {
  const names = name.split(' ').filter(Boolean)
  const surname = names.length > 1 ? names.pop() || '' : ''
  const firstname = names.join(' ')
  return toName(firstname, surname)
}

export const toAge = (ageString: string) => {
  const age = Number(ageString)
  return isNaN(age) || age === 0 ? null : age
}

export const toGender = (genderString: string): Gender => {
  switch (genderString) {
    case 'M':
      return 'male'
    case 'F':
      return 'female'
    default:
      return 'unknown'
  }
}

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

export const resolveFacility = (
  name: string,
  locationMap: LocationMap[],
): string | null => {
  const location = locationMap.find((loc) => loc.name === name)
  return location?.facilityCode ? location.id : null
}
