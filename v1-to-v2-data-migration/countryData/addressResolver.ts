import { Address, AddressLine, EventRegistration } from '../helpers/types.ts'

const COUNTRY_CODE = 'FAR' //Replace with actual country code

export function resolveAddress(
  data: EventRegistration,
  address: AddressLine | undefined
): Address | null {
  if (!address) {
    return null
  }
  const international = address.country !== COUNTRY_CODE
  if (international) {
    return {
      addressType: 'INTERNATIONAL',
      country: address.country,
      streetLevelDetails: {
        state: address.state,
        district2: address.district,
        cityOrTown: address.city,
        addressLine1: address.line.filter(Boolean)[0],
        addressLine2: address.line.filter(Boolean)[1],
        addressLine3: address.line.filter(Boolean).slice(2).join(', '),
        postcodeOrZip: address.postalCode,
        /* For potential custom field
        kebele: getCustomField(data, 'birth.child.address.kebele'),
         */
      },
    }
  }

  return {
    addressType: 'DOMESTIC',
    country: address.country,
    administrativeArea: address.district,
    streetLevelDetails: {
      town: address.city,
      number: address.line.filter(Boolean)[0],
      street: address.line.filter(Boolean)[1],
      residentialArea: address.line.filter(Boolean)[2],
      zipCode: address.postalCode,
    },
  }
}
