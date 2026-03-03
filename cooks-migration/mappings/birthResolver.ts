import { BirthCsvRecord, CsvFields } from '../helpers/csvTypes.ts'
import {
  BirthResolver,
  BirthInformant,
  BirthMetaData,
  AttendantAtBirth
} from '../helpers/birthTypes.ts'
import { IdType, LocationMap } from '../helpers/types.ts'
import { Country } from '../helpers/addressConfig.ts'
import { birthInformantMap } from '../lookupMappings/informantTypes.ts'
import { nationalityMap } from '../lookupMappings/nationalities.ts'
import { raceMap } from '../lookupMappings/races.ts'
import { twinsMap } from '../lookupMappings/twins.ts'
import {
  deriveName,
  getLocationCode,
  getLocationFromRegNum,
  resolveAddress,
  resolveFacility,
  toAge,
  toCrvsDate,
  toGender,
  toISODate,
  toLegacy,
  toName,
  toTitleCase
} from '../helpers/resolverHelpers.ts'
import { resolveNameChange } from '../helpers/renamingHelper.ts'

const lookUpNameChange = (CsvFields: CsvFields, birthRef: string) => {
  return CsvFields.deedpoll
    .filter((record) => record.BIRTH_REF === birthRef)
    .sort(
      (a, b) =>
        new Date(toISODate(a.DATE)).getTime() -
        new Date(toISODate(b.DATE)).getTime()
    )
    .map((record) => ({
      ...toName(record.NEW_FIRSTNAMES, record.NEW_SURNAME),
      dpNo: record.DP_REF
    }))
}

const toNationality = (
  nationality: string,
  race: string
): Country | undefined => {
  if (
    nationality.toLowerCase().includes('brit') &&
    race.toLowerCase().includes('cook')
  )
    return 'COK'
  return nationalityMap[nationality] || raceMap[race] || undefined
}

const fatherDetailsUnavailable = (data: BirthCsvRecord) =>
  Boolean(
    !data.FATHERS_NAME &&
    !data.FATHERS_SURNAME &&
    !data.FATHERS_DOB &&
    !data.FATHERS_AGE &&
    !data.FATHERS_BIRTHPLACE &&
    !data.FATHERS_NATIONALITY &&
    !data.FATHERS_RACE
  )

const motherDetailsUnavailable = (data: BirthCsvRecord) =>
  Boolean(
    !data.MOTHERS_NAME &&
    !data.MOTHERS_SURNAME &&
    !data.MOTHERS_DOB &&
    !data.MOTHERS_AGE &&
    !data.MOTHERS_BIRTHPLACE &&
    !data.MOTHERS_NATIONALITY &&
    !data.MOTHERS_RACE
  )

export const getNameChanges = (data: BirthCsvRecord, all: CsvFields) => {
  const deedPoll = lookUpNameChange(all, data.BIRTH_REF)
  const inSheet = resolveNameChange(data.CHILDS_NEW_NAME)
  return deedPoll.length > 0 ? deedPoll : inSheet
}

export const birthResolver: BirthResolver = {
  'child.name': (data: BirthCsvRecord) =>
    toName(data.CHILDS_NAME, data.FATHERS_SURNAME || data.MOTHERS_SURNAME),
  'child.dob': (data: BirthCsvRecord) => toCrvsDate(data.CHILDS_DOB),
  'child.reason': (_: BirthCsvRecord) => 'Legacy record', // Confirm this with Shez, maybe Legacy record
  'child.gender': (data: BirthCsvRecord) => toGender(data.CHILDS_GENDER),
  'child.placeOfBirth': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    resolveFacility(data.CHILDS_BIRTHPLACE, locationMap)
      ? 'HEALTH_FACILITY'
      : 'OTHER',
  'child.birthLocation': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveFacility(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthLocation.privateHome': '',
  'child.birthLocation.other': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
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
  'child.attendantAtBirth': (_: BirthCsvRecord) => 'OTHER' as AttendantAtBirth,
  'child.attendantAtBirth.other': (_: BirthCsvRecord) => 'Legacy record',
  'child.attendantAtBirth.givenNames': (_: BirthCsvRecord) => '-',
  'child.attendantAtBirth.surname': (_: BirthCsvRecord) => '-',
  'child.isRenamed': (data: BirthCsvRecord, all: CsvFields) => {
    const latest = getNameChanges(data, all)[0]
    return latest?.firstname || latest?.surname ? true : false
  },
  'child.isAdoptionOrder': (data: BirthCsvRecord) => !!data.ADOP_REC_REF,
  'nameChange.deedPollNumber1': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[0]?.dpNo,
  'nameChange.newGivenNames1': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[0]?.firstname,
  'nameChange.newSurname1': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[0]?.surname,
  'nameChange.addAnother1': '',
  'nameChange.deedPollNumber2': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[1]?.dpNo,
  'nameChange.newGivenNames2': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[1]?.firstname,
  'nameChange.newSurname2': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[1]?.surname,
  'nameChange.addAnother2': '',
  'nameChange.deedPollNumber3': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[2]?.dpNo,
  'nameChange.newGivenNames3': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[2]?.firstname,
  'nameChange.newSurname3': (data: BirthCsvRecord, all: CsvFields) =>
    getNameChanges(data, all)[2]?.surname,
  'adoptionOrder.registrationNumber': (
    data: BirthCsvRecord,
    all: CsvFields
  ) => {
    if (!data.ADOP_REC_REF) return undefined
    const match = all.adoption.find(
      (record) => record.ADOPTION_REF === data.ADOP_REC_REF
    )
    if (match) {
      return toLegacy(match.ADOPTION_REF, 'adoption')
    }
    return data.ADOP_REC_REF
  },

  'adoptionOrder.orderDocument': '', //(data: BirthCsvRecord) => data.ADOPT_BOOK_REF,

  'mother.detailsUnavailable': (data: BirthCsvRecord) =>
    motherDetailsUnavailable(data),
  'mother.unavailableReason': (data: BirthCsvRecord) =>
    motherDetailsUnavailable(data) ? 'Legacy record' : undefined,
  'mother.name': (data: BirthCsvRecord) =>
    toName(data.MOTHERS_NAME, data.MOTHERS_SURNAME),
  'mother.dob': (data: BirthCsvRecord) => toCrvsDate(data.MOTHERS_DOB),
  'mother.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.MOTHERS_DOB && data.MOTHERS_AGE),
  'mother.age': (data: BirthCsvRecord) => toAge(data.MOTHERS_AGE),
  'mother.maritalStatus': '',
  'mother.maidenName': (data: BirthCsvRecord) =>
    toTitleCase(data.MOTHERS_MAIDEN_NAME),
  'mother.placeOfBirth': (data: BirthCsvRecord) =>
    toTitleCase(data.MOTHERS_BIRTHPLACE),
  'mother.nationality': (data: BirthCsvRecord) =>
    toNationality(data.MOTHERS_NATIONALITY, data.MOTHERS_RACE),
  'mother.idType': (_: BirthCsvRecord) => 'NONE' as IdType,
  'mother.passport': '',
  'mother.bc': '',
  'mother.other': '',
  'mother.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) => resolveAddress(data.MOTHERS_ADDRESS, locationMap),
  'mother.occupation': '',
  'father.detailsUnavailable': (data: BirthCsvRecord) =>
    fatherDetailsUnavailable(data),
  'father.unavailableReason': (data: BirthCsvRecord) =>
    fatherDetailsUnavailable(data) ? 'Legacy record' : undefined,
  'father.name': (data: BirthCsvRecord) =>
    toName(data.FATHERS_NAME, data.FATHERS_SURNAME),
  'father.dob': (data: BirthCsvRecord) => toCrvsDate(data.FATHERS_DOB),
  'father.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.FATHERS_DOB && data.FATHERS_AGE),
  'father.age': (data: BirthCsvRecord) => toAge(data.FATHERS_AGE),
  'father.placeOfBirth': (data: BirthCsvRecord) =>
    toTitleCase(data.FATHERS_BIRTHPLACE),
  'father.nationality': (data: BirthCsvRecord) =>
    toNationality(data.FATHERS_NATIONALITY, data.FATHERS_RACE),
  'father.idType': (_: BirthCsvRecord) => 'NONE' as IdType,
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.sameAsMotherResidence': '', // Calculate
  'father.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
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
    locationMap: LocationMap[]
  ) => resolveAddress(data.INFORMANTS_ADDRESS, locationMap),
  'informant.occupation': (data: BirthCsvRecord) => data.INFORMANTS_OCCUPATION,
  'informant.phoneNo': '',
  'informant.email': ''
}

export const birthMetaData: BirthMetaData = {
  registrationDate: (data: BirthCsvRecord) => toISODate(data.DATE_REGISTERED),
  locationCode: (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[]
  ) =>
    getLocationCode(data.CHILDS_BIRTHPLACE, locationMap) ||
    getLocationFromRegNum(data.BIRTH_REF)
}
