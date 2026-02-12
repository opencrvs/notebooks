import { BirthCsvRecord, CsvFields } from '../helpers/csvTypes.ts'
import {
  BirthResolver,
  BirthInformant,
  BirthMetaData,
} from '../helpers/birthTypes.ts'
import { LocationMap } from '../helpers/types.ts'
import { Country } from '../helpers/addressConfig.ts'
import { birthInformantMap } from '../lookupMappings/informantTypes.ts'
import { nationalityMap } from '../lookupMappings/nationalities.ts'
import { raceMap } from '../lookupMappings/races.ts'
import { twinsMap } from '../lookupMappings/twins.ts'
import { FALLBACK_ISLAND_PREFIX_MAP } from '../helpers/generators.ts'
import {
  deriveName,
  getLocation,
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  resolveFacility,
  toAge,
  toCrvsDate,
  toGender,
  toISODate,
  toName,
} from '../helpers/resolverHelpers.ts'

const lookUpNameChange = (CsvFields: CsvFields, birthRef: string) => {
  return CsvFields.deedpoll
    .filter((record) => record.BIRTH_REF === birthRef)
    .sort(
      (a, b) =>
        new Date(toISODate(a.DATE)).getTime() -
        new Date(toISODate(b.DATE)).getTime(),
    )
}

const toNationality = (
  nationality: string,
  race: string,
): Country | undefined => {
  return nationalityMap[nationality] || raceMap[race] || undefined
}

export const birthResolver: BirthResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'child.name': (data: BirthCsvRecord) =>
    toName(data.CHILDS_NAME, data.FATHERS_SURNAME || data.MOTHERS_SURNAME),
  'child.dob': (data: BirthCsvRecord) => toCrvsDate(data.CHILDS_DOB),
  'child.reason': (_: BirthCsvRecord) => 'Data migration', // Confirm this with Shez, maybe Legacy record
  'child.gender': (data: BirthCsvRecord) => toGender(data.CHILDS_GENDER),
  'child.placeOfBirth': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) =>
    resolveFacility(data.CHILDS_BIRTHPLACE, locationMap)
      ? 'HEALTH_FACILITY'
      : 'OTHER',
  'child.birthLocation': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveFacility(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthLocation.privateHome': '',
  'child.birthLocation.other': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthType': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.type || 'SINGLE',
  'child.orderOfBirth.twins': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.orderTwins,
  'child.orderOfBirth.triplets': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.orderTriplets,
  'child.orderOfBirth.higherMultiple': (data: BirthCsvRecord) =>
    twinsMap[data.CHILDS_TWIN]?.orderHigher,
  'child.weightAtBirth': '',
  'child.attendantAtBirth': '',
  'child.attendantAtBirth.other': '',
  'child.attendantAtBirth.givenNames': '',
  'child.attendantAtBirth.surname': '',
  'child.isRenamed': (data: BirthCsvRecord) => !!data.CHILDS_NEW_NAME, // Calculate !!birth.CHILDS_NEW_NAME
  'child.isAdoptionOrder': (data: BirthCsvRecord) => !!data.ADOP_REC_REF,

  'nameChange.deedPollNumber1': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[0]?.DP_REF,
  'nameChange.newGivenNames1': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[0]?.NEW_FIRSTNAMES,
  'nameChange.newSurname1': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[0]?.NEW_SURNAME,
  'nameChange.addAnother1': '',
  'nameChange.deedPollNumber2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.DP_REF,
  'nameChange.newGivenNames2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.NEW_FIRSTNAMES,
  'nameChange.newSurname2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.NEW_SURNAME,
  'nameChange.addAnother2': '',
  'nameChange.deedPollNumber3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.DP_REF,
  'nameChange.newGivenNames3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.NEW_FIRSTNAMES,
  'nameChange.newSurname3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.NEW_SURNAME,

  'adoptionOrder.registrationNumber': (data: BirthCsvRecord) =>
    data.ADOP_REC_REF, // Might need to add sdoption suffix
  'adoptionOrder.orderDocument': '', //(data: BirthCsvRecord) => data.ADOPT_BOOK_REF,

  'mother.detailsUnavailable': '',
  'mother.unavailableReason': '',
  'mother.name': (data: BirthCsvRecord) =>
    toName(data.MOTHERS_NAME, data.MOTHERS_SURNAME),
  'mother.dob': (data: BirthCsvRecord) => toCrvsDate(data.MOTHERS_DOB),
  'mother.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.MOTHERS_DOB && data.MOTHERS_AGE),
  'mother.age': (data: BirthCsvRecord) => toAge(data.MOTHERS_AGE),
  'mother.maritalStatus': '',
  'mother.maidenName': (data: BirthCsvRecord) => data.MOTHERS_MAIDEN_NAME,
  'mother.placeOfBirth': (data: BirthCsvRecord) => data.MOTHERS_BIRTHPLACE,
  'mother.nationality': (data: BirthCsvRecord) =>
    toNationality(data.MOTHERS_NATIONALITY, data.MOTHERS_RACE),
  'mother.idType': '',
  'mother.passport': '',
  'mother.bc': '',
  'mother.other': '',
  'mother.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.MOTHERS_ADDRESS, locationMap),
  'mother.occupation': '',
  'father.detailsUnavailable': '',
  'father.unavailableReason': '',
  'father.name': (data: BirthCsvRecord) =>
    toName(data.FATHERS_NAME, data.FATHERS_SURNAME),
  'father.dob': (data: BirthCsvRecord) => toCrvsDate(data.FATHERS_DOB),
  'father.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.FATHERS_DOB && data.FATHERS_AGE),
  'father.age': (data: BirthCsvRecord) => toAge(data.FATHERS_AGE),
  'father.placeOfBirth': (data: BirthCsvRecord) => data.FATHERS_BIRTHPLACE,
  'father.nationality': (data: BirthCsvRecord) =>
    toNationality(data.FATHERS_NATIONALITY, data.FATHERS_RACE),
  'father.idType': '',
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.sameAsMotherResidence': '', // Calculate
  'father.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.FATHERS_ADDRESS, locationMap),
  'father.occupation': (data: BirthCsvRecord) => data.FATHERS_OCCUPATION,
  'informant.relation': (data: BirthCsvRecord): BirthInformant => {
    const relation = data.INFORMANTS_RELATIONSHIP || ''
    return birthInformantMap[relation] || 'OTHER'
  },
  'informant.other.relation': (data: BirthCsvRecord) => {
    const relation = birthInformantMap[data.INFORMANTS_RELATIONSHIP || '']
    return relation === 'OTHER' ? data.INFORMANTS_RELATIONSHIP : null
  },
  'informant.name': (data: BirthCsvRecord) => deriveName(data.INFORMANTS_NAME),
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.nationality': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.other': '',
  'informant.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.INFORMANTS_ADDRESS, locationMap),
  'informant.occupation': (data: BirthCsvRecord) => data.INFORMANTS_OCCUPATION,
  'informant.phoneNo': '',
  'informant.email': '',
}

export const birthMetaData: BirthMetaData = {
  registrationDate: (data: BirthCsvRecord) => toISODate(data.DATE_REGISTERED),
  registrar: (data: BirthCsvRecord) => data.REGISTRAR,
  locationCode: (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) =>
    getLocationCode(data.CHILDS_BIRTHPLACE, locationMap) ||
    getLocationFromRegNum(data.BIRTH_REF),
}
