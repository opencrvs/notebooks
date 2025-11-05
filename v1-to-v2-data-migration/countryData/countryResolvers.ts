import { getCustomField, getIdentifier } from '../helpers/resolverUtils.ts'
import { EventRegistration } from '../helpers/types.ts'
import { Address, COUNTRY_CODE, resolveAddress } from './addressResolver.ts'

const convertChildAddress = (data: EventRegistration): Address => {
  const country = getCustomField(
    data,
    'birth.child.child-view-group.countryPrimaryChild'
  )

  return {
    addressType: country === COUNTRY_CODE ? 'DOMESTIC' : 'INTERNATIONAL',
    country: country,
    administrativeArea: getCustomField(
      data,
      'birth.child.child-view-group.districtPrimaryChild'
    ),
    streetLevelDetails: {
      city: getCustomField(
        data,
        'birth.child.child-view-group.cityPrimaryChild'
      ),
      number: getCustomField(
        data,
        'birth.child.child-view-group.addressLine1PrimaryChild'
      ),
      street: getCustomField(
        data,
        'birth.child.child-view-group.addressLine2PrimaryChild'
      ),
      residentialArea: getCustomField(
        data,
        'birth.child.child-view-group.addressLine3PrimaryChild'
      ),
      zipCode: getCustomField(
        data,
        'birth.child.child-view-group.postalCodePrimaryChild'
      ),
      internationalCity: getCustomField(
        data,
        'birth.child.child-view-group.internationalCityPrimaryChild'
      ),
    },
  }
}

export const countryResolver = {
  'child.nid': (data: EventRegistration) =>
    getIdentifier(data.child, 'NATIONAL_ID'),
  'child.address': (data: EventRegistration) => convertChildAddress(data),
  'child.attendantName': (data: EventRegistration) =>
    getCustomField(data, 'birth.child.child-view-group.birthAttendantName'),
  'child.attedantAtBirthId': (data: EventRegistration) =>
    getCustomField(data, 'birth.child.child-view-group.birthAttendantId'),
  'child.birthLocation.privateHome': (data: EventRegistration) =>
    data.eventLocation?.type === 'PRIVATE_HOME'
      ? resolveAddress(data, data.eventLocation?.address)
      : null,
  'child.birthLocation.other': (data: EventRegistration) =>
    data.eventLocation?.type === 'OTHER'
      ? resolveAddress(data, data.eventLocation?.address)
      : null,
  'deceased.placeOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'death.deceased.deceased-view-group.placeOfBirth'),
  'deceased.occupation': (data: EventRegistration) =>
    getCustomField(data, 'death.deceased.deceased-view-group.occupation'),
  'eventDetails.timeOfDeath': (data: EventRegistration) =>
    getCustomField(data, 'death.deathEvent.death-event-details.timeOfDeath'),
  'informant.relation': (data: EventRegistration) =>
    data.informant?.relationship,
  'eventDetails.date': (data: EventRegistration) =>
    data.deceased?.deceased?.deathDate,
  'deceased.brn': (data: EventRegistration) =>
    getCustomField(data, 'death.deceased.deceased-view-group.birthRegNo'),
}
