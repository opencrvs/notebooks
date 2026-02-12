import { format, isValid, parse } from 'date-fns'
import { Address } from './addressConfig.ts'
import { FALLBACK_ISLAND_PREFIX_MAP } from './generators.ts'
import {
  EVENT_TYPE_MAP,
  EventType,
  Gender,
  LocationMap,
  Name,
} from './types.ts'

type DateFormat = 'MM/dd/yyyy' | 'dd/MM/yyyy'

export const toCrvsDate = (
  dateString: string,
  dateFormat: DateFormat = 'MM/dd/yyyy',
): string => {
  const trimmedDate = dateString.trim()

  if (!trimmedDate) {
    return ''
  }

  let parsedDate = parse(trimmedDate, dateFormat, new Date())

  if (!isValid(parsedDate)) {
    const alternativeFormat =
      dateFormat === 'MM/dd/yyyy' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'
    parsedDate = parse(trimmedDate, alternativeFormat, new Date())

    if (!isValid(parsedDate)) {
      return ''
    }
  }

  return format(parsedDate, 'yyyy-MM-dd')
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

export const getLocation = (name: string, locationMap: LocationMap[]) => {
  return locationMap.find((loc) => loc.name === name)
}

export const getLocationCode = (
  name: string,
  locationMap: LocationMap[],
): string | null => {
  const location = getLocation(name, locationMap)
  if (location?.map?.includes('COK')) {
    return location.map
  }
  return null
}

export const getLocationFromRegNum = (data: string): string | null =>
  Object.entries(FALLBACK_ISLAND_PREFIX_MAP).find(
    ([_, value]) => value === data.substring(0, 4),
  )?.[0] || null

export const resolveFacility = (
  name: string,
  locationMap: LocationMap[],
): string | null => {
  const location = getLocation(name, locationMap)
  return location?.facilityCode ? location.id : null
}

export const toLegacy = (registration: string, eventType: EventType) => {
  const suffix = EVENT_TYPE_MAP[eventType]
  return `${registration}${suffix}`
}
