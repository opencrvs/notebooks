import { AdoptionCsvRecord, CsvFields } from '../helpers/csvTypes.ts'
import { AdoptionResolver, AdoptionMetaData } from '../helpers/adoptionTypes.ts'
import { IdType, LocationMap, Name } from '../helpers/types.ts'
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
  toLegacy,
  toName,
  toTitleCase
} from '../helpers/resolverHelpers.ts'

const toNationality = (
  nationality: string,
  race: string
): Country | undefined => {
  return nationalityMap[nationality] || raceMap[race] || undefined
}

/*
 Create regex to extract name and surname
 Can be in the form:
 CHRISTIAN NAME "Jim Bob" SURNAME "Smith" D.P NO 178/90 : { firstname: Jim Bob; surname: Smith }
 CHRISTINA NAME: "Steve" D.P. NO: 109/23 - 15.12.2023 : { firstname: Steve; surname: undefined }
 CH N: "SALLY JOE" 1098 : { firstname: SALLY JOE; surname: undefined }
 CHRISTIAN NAME " Jess Benson" D.P : { firstname: Jess Benson; surname: undefined }
 CHRISTIAN NAMES: "JOHNMARY TEOKOTAI"  D.P. : { firstname: JOHNMARY TEOKOTAI; surname: undefined }
 CN: "MAY MAUI"  S: "MANI"  D.P : { firstname: MAY MAUI; surname: MANI }
 SURNAME "HERIA HARETI "D.P : { firstname: undefined; surname: HERIA HARETI }
 SURNAME:  "LEVI" : { firstname: undefined; surname: LEVI }
 SURNAME: AUMATANGI D.P. 24/94 : { firstname: undefined; surname: AUMATANGI }
 SURNAME: HERMAN COURT ORDER DATED 28.4.2003 : { firstname: undefined; surname: HERMAN }
 SURNAME: RAMANIA D.P. : { firstname: undefined; surname: RAMANIA }
 SURNAME:"FOSTER-JONASSEN" D.P NO: 7/11   CHRISTIAN NAME:" ARTHUR DAMIEN EDWIN HEZEKIAH" : { firstname: ARTHUR DAMIEN EDWIN HEZEKIAH; surname: FOSTER-JONASSEN }

*/
const getNewName = (data: string): Name => {
  // Match firstname from: CHRISTIAN NAME[S], CH N, CN — always quoted
  const firstnameMatch = data.match(
    /(?:CHRISTIAN\s+NAMES?|CH\s+N(?:AME)?|CN)\s*:?\s*"\s*([^"]+?)\s*"/i
  )

  // Match surname — quoted form: SURNAME or S: followed by quoted value
  const surnameQuotedMatch = data.match(
    /(?:SURNAME|\bS(?=\s*:))\s*:?\s*"\s*([^"]+?)\s*"/i
  )

  // Match surname — unquoted form: SURNAME: WORD (no quotes, stops at whitespace/end)
  const surnameUnquotedMatch = surnameQuotedMatch
    ? null
    : data.match(/SURNAME\s*:\s*([A-Z][A-Z-]*)(?=\s|$)/i)

  return toName(
    firstnameMatch ? firstnameMatch[1].trim() : '',
    surnameQuotedMatch
      ? surnameQuotedMatch[1].trim()
      : surnameUnquotedMatch
        ? surnameUnquotedMatch[1].trim()
        : ''
  )
}

const motherDetailsUnavailable = (data: AdoptionCsvRecord): boolean =>
  Boolean(
    !data.MOTHERS_NAME &&
    !data.MOTHERS_DOB &&
    !data.MOTHERS_AGE &&
    !data.MOTHERS_MAIDEN_NAME &&
    !data.MOTHERS_BIRTHPLACE &&
    !data.MOTHERS_NATIONALITY &&
    !data.MOTHERS_RACE &&
    !data.MOTHERS_ADDRESS
  )

const fatherDetailsUnavailable = (data: AdoptionCsvRecord): boolean =>
  Boolean(
    !data.FATHERS_NAME &&
    !data.FATHERS_DOB &&
    !data.FATHERS_AGE &&
    !data.FATHERS_BIRTHPLACE &&
    !data.FATHERS_NATIONALITY &&
    !data.FATHERS_RACE &&
    !data.FATHERS_ADDRESS &&
    !data.FATHERS_OCCUPATION
  )

export const adoptionResolver: AdoptionResolver = {
  'child.brnSearch': '',
  'child.brn': (data: AdoptionCsvRecord) => toLegacy(data.BIRTH_REF, 'birth'),
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
  'consent.notProvidedOrWaived': (_: AdoptionCsvRecord) => true,
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
  'adoptiveMother.detailsUnavailable': (data: AdoptionCsvRecord) =>
    motherDetailsUnavailable(data),
  'adoptiveMother.unavailableReason': (data: AdoptionCsvRecord) =>
    motherDetailsUnavailable(data) ? 'Legacy record' : undefined,
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
    toTitleCase(data.MOTHERS_MAIDEN_NAME),
  'adoptiveMother.placeOfBirth': (data: AdoptionCsvRecord) =>
    toTitleCase(data.MOTHERS_BIRTHPLACE),
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
  'adoptiveFather.detailsUnavailable': (data: AdoptionCsvRecord) =>
    fatherDetailsUnavailable(data),
  'adoptiveFather.unavailableReason': (data: AdoptionCsvRecord) =>
    fatherDetailsUnavailable(data) ? 'Legacy record' : undefined,
  'adoptiveFather.name': (data: AdoptionCsvRecord) =>
    toName(data.FATHERS_NAME, data.FATHERS_SURNAME),
  'adoptiveFather.dob': (data: AdoptionCsvRecord) =>
    toCrvsDate(data.FATHERS_DOB),
  'adoptiveFather.dobUnknown': (data: AdoptionCsvRecord) =>
    Boolean(!data.FATHERS_DOB && data.FATHERS_AGE),
  'adoptiveFather.age': (data: AdoptionCsvRecord) =>
    toAgeObject(data.FATHERS_AGE, 'eventDetails.date'),
  'adoptiveFather.placeOfBirth': (data: AdoptionCsvRecord) =>
    toTitleCase(data.FATHERS_BIRTHPLACE),
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
    data.CHILDS_NEW_NAME ? 'yes' : 'no',
  'adoptionOrder.childNewName': (data: AdoptionCsvRecord) =>
    data.CHILDS_NEW_NAME
      ? { ...deriveName(data.CHILDS_NAME), ...getNewName(data.CHILDS_NEW_NAME) }
      : undefined
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
