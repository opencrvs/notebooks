import { AdoptionCsvRecord, CsvFields } from '../helpers/csvTypes.ts'
import { AdoptionResolver, AdoptionMetaData } from '../helpers/adoptionTypes.ts'
import { IdType, LocationMap } from '../helpers/types.ts'
import { Country } from '../helpers/addressConfig.ts'
import { nationalityMap } from '../lookupMappings/nationalities.ts'
import { raceMap } from '../lookupMappings/races.ts'
import {
  deriveName,
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  resolveFacility,
  toAgeObject,
  toCrvsDate,
  toGender,
  toISODate,
  toName
} from '../helpers/resolverHelpers.ts'

const toNationality = (
  nationality: string,
  race: string
): Country | undefined => {
  return nationalityMap[nationality] || raceMap[race] || undefined
}

export const adoptionResolver: AdoptionResolver = {
  'child.brnSearch': '',
  'child.brn': (data: AdoptionCsvRecord) => data.BIRTH_REF, // Does this need to be convertedf to legaccy format
  'child.name': (data: AdoptionCsvRecord) => deriveName(data.CHILDS_NAME),
  'child.dob': (data: AdoptionCsvRecord) => toCrvsDate(data.CHILDS_DOB),
  'child.gender': (data: AdoptionCsvRecord) => toGender(data.CHILDS_GENDER),
  'child.birthLocation': (
    data: AdoptionCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    resolveFacility(data.CHILDS_BIRTHPLACE, locationMap)
      ? 'HEALTH_FACILITY'
      : 'OTHER',
  'consent.notProvidedOrWaived': '',
  'consent.numberOfParties': '',
  'consenter.cp1.name': '',
  'consenter.cp1.relationship': '',
  'consenter.cp1.relationshipSpecify': '',
  'consenter.cp1.dob': '',
  'consenter.cp1.dobUnknown': '',
  'consenter.cp1.age': '',
  'consenter.cp1.residence': '',
  'consenter.cp1.occupation': '',
  'consenter.cp2.name': '',
  'consenter.cp2.relationship': '',
  'consenter.cp2.relationshipSpecify': '',
  'consenter.cp2.dob': '',
  'consenter.cp2.dobUnknown': '',
  'consenter.cp2.age': '',
  'consenter.cp2.residence': '',
  'consenter.cp2.occupation': '',
  'adoptiveMother.detailsUnavailable': '', // Can calculate this
  'adoptiveMother.unavailableReason': '',
  'adoptiveMother.name': (data: AdoptionCsvRecord) =>
    toName(data.MOTHERS_NAME, data.MOTHERS_SURNAME),
  'adoptiveMother.dob': (data: AdoptionCsvRecord) =>
    toCrvsDate(data.MOTHERS_DOB),
  'adoptiveMother.dobUnknown': (data: AdoptionCsvRecord) =>
    Boolean(!data.MOTHERS_DOB && data.MOTHERS_AGE),
  'adoptiveMother.age': (data: AdoptionCsvRecord) =>
    toAgeObject(data.MOTHERS_AGE, 'eventDetails.date'),
  'adoptiveMother.maritalStatus': '',
  'adoptiveMother.maidenName': (data: AdoptionCsvRecord) =>
    data.MOTHERS_MAIDEN_NAME,
  'adoptiveMother.placeOfBirth': (data: AdoptionCsvRecord) =>
    data.MOTHERS_BIRTHPLACE,
  'adoptiveMother.nationality': (data: AdoptionCsvRecord) =>
    toNationality(data.MOTHERS_NATIONALITY, data.MOTHERS_RACE),
  'adoptiveMother.idType': (_: AdoptionCsvRecord) => 'NONE' as IdType,
  'adoptiveMother.idTypeOther': '',
  'adoptiveMother.idNumber': '',
  'adoptiveMother.residence': (
    data: AdoptionCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.MOTHERS_ADDRESS, locationMap),
  'adoptiveMother.occupation': '',
  'adoptiveFather.detailsUnavailable': '', // Calculate
  'adoptiveFather.unavailableReason': '',
  'adoptiveFather.name': (data: AdoptionCsvRecord) =>
    toName(data.FATHERS_NAME, data.FATHERS_SURNAME),
  'adoptiveFather.dob': (data: AdoptionCsvRecord) =>
    toCrvsDate(data.FATHERS_DOB),
  'adoptiveFather.dobUnknown': (data: AdoptionCsvRecord) =>
    Boolean(!data.FATHERS_DOB && data.FATHERS_AGE),
  'adoptiveFather.age': (data: AdoptionCsvRecord) =>
    toAgeObject(data.FATHERS_AGE, 'eventDetails.date'),
  'adoptiveFather.placeOfBirth': (data: AdoptionCsvRecord) =>
    data.FATHERS_BIRTHPLACE,
  'adoptiveFather.nationality': (data: AdoptionCsvRecord) =>
    toNationality(data.FATHERS_NATIONALITY, data.FATHERS_RACE),
  'adoptiveFather.idType': (_: AdoptionCsvRecord) => 'NONE' as IdType,
  'adoptiveFather.idTypeOther': '',
  'adoptiveFather.idNumber': '',
  'adoptiveFather.residence': (
    data: AdoptionCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.FATHERS_ADDRESS, locationMap),
  'adoptiveFather.occupation': (data: AdoptionCsvRecord) =>
    data.FATHERS_OCCUPATION,
  'adoptionOrder.number': (data: AdoptionCsvRecord) => data.ADOPTION_REF,
  'adoptionOrder.issuingAuthority': () => 'high-court-of-the-cook-islands',
  'adoptionOrder.date': (data: AdoptionCsvRecord) =>
    toCrvsDate(data.DATE_REGISTERED),
  'adoptionOrder.changesChildLegalName': (data: AdoptionCsvRecord) =>
    !!data.CHILDS_NEW_NAME,
  'adoptionOrder.childNewName': (data: AdoptionCsvRecord) =>
    data.CHILDS_NEW_NAME ? toName(data.CHILDS_NEW_NAME, '') : undefined // Need tp parse
}

export const adoptionMetaData: AdoptionMetaData = {
  registrationDate: (data: AdoptionCsvRecord) =>
    toISODate(data.DATE_REGISTERED),
  locationCode: (
    data: AdoptionCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    getLocationCode(data.CHILDS_BIRTHPLACE, locationMap) ||
    getLocationFromRegNum(data.ADOPTION_REF)
}
