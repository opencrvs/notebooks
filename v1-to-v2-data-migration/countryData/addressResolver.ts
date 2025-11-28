import { AddressLine, EventRegistration } from '../helpers/types.ts'

export const COUNTRY_CODE = 'SOM' //Replace with actual country code
export const COUNTRY_PHONE_CODE = '+252' //Replace with actual country phone code

// Required to handle 2:1 mapping of birth location fields in corrections
export const BIRTH_LOCATION_PRIVATE_HOME_KEY = 'birth.birthLocation.privateHome'
export const BIRTH_LOCATION_OTHER_HOME_KEY = 'birth.birthLocation.otherHome'

// Set up street level details as they are in your country config
// src/form/street-address-configuration.ts
export type StreetLevelDetails = {
  city?: string
  number?: string
  street?: string
  residentialArea?: string
  zipCode?: string
  internationalCity?: string
}

export interface Address {
  addressType?: 'INTERNATIONAL' | 'DOMESTIC'
  country?: string
  administrativeArea?: string
  streetLevelDetails?: StreetLevelDetails
}

export function resolveAddress(
  data: EventRegistration,
  address: AddressLine | undefined
): Address | null {
  if (!address) {
    return null
  }
  const lines = address.line.filter(Boolean).filter((line) => !['URBAN', 'RURAL'].includes(line))
  const international = address.country !== COUNTRY_CODE
  if (international) {
    return {
      addressType: 'INTERNATIONAL',
      country: address.country,
      streetLevelDetails: {
        internationalCity: address.city || '',
      },
    }
  }

  return {
    addressType: 'DOMESTIC',
    country: address.country,
    administrativeArea: address.district,
    streetLevelDetails: {
      city: address.city || '',
      number: address.line.filter(Boolean)[0] || '',
      street: address.line.filter(Boolean)[1] || '',
      residentialArea: address.line.filter(Boolean)[2] || '',
      zipCode: address.postalCode || '',
    },
  }
}
