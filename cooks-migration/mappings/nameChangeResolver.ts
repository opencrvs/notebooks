import { BirthCsvRecord, DeedpollCsvRecord } from '../helpers/csvTypes.ts'
import {
  NameChangeResolver,
  ResolverFunction
} from '../helpers/nameChangeTypes.ts'
import {
  deriveName,
  getLocationCode,
  resolveAddress,
  toCrvsDate,
  toISODate
} from '../helpers/resolverHelpers.ts'
import { IdType, LocationMap } from '../helpers/types.ts'

const getPreviousChanges = (
  current: DeedpollCsvRecord,
  all: DeedpollCsvRecord[]
) => {
  const currentIndex = all.indexOf(current)
  return all
    .slice(0, currentIndex)
    .map((record) => ({
      ...record,
      NEW_FIRSTNAMES: sanitiseName(record.NEW_FIRSTNAMES),
      NEW_SURNAME: sanitiseName(record.NEW_SURNAME)
    }))
    .reverse()
}

const sanitiseName = (str: string): string => {
  const match = str.match(/"([^"]*)"/)
  return match ? match[1] : str
}

export const nameChangeResolver: NameChangeResolver = {
  'subjects.nationality': (
    _: DeedpollCsvRecord,
    birth: BirthCsvRecord,
    __: DeedpollCsvRecord[],
    locationMap: LocationMap[]
  ) => resolveAddress(birth.CHILDS_BIRTHPLACE, locationMap)?.country,
  'subjects.brn': '',
  'subjects.brnText': '',
  'subjects.name': (_: DeedpollCsvRecord, birth: BirthCsvRecord) =>
    deriveName(birth.CHILDS_NAME),
  'subjects.dob': (_: DeedpollCsvRecord, birth: BirthCsvRecord) =>
    toCrvsDate(birth.CHILDS_DOB),
  'subjects.address': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    __: DeedpollCsvRecord[],
    locationMap: LocationMap[]
  ) => resolveAddress(data.ISLAND, locationMap), // Not so sure about this
  'subjects.nameChangedViaDeadPoll': () => true,
  'subjects.nameChange1.deedPollNumber': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[0]?.DP_REF,
  'subjects.nameChange1.firstname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[0]?.NEW_FIRSTNAMES,
  'subjects.nameChange1.surname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[0]?.NEW_SURNAME,
  'subjects.nameChange1.addAnother': '',
  'subjects.nameChange2.deedPollNumber': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[1]?.DP_REF,
  'subjects.nameChange2.firstname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[1]?.NEW_FIRSTNAMES,
  'subjects.nameChange2.surname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[1]?.NEW_SURNAME,
  'subjects.nameChange2.addAnother': '',
  'subjects.nameChange3.deedPollNumber': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[2]?.DP_REF,
  'subjects.nameChange3.firstname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[2]?.NEW_FIRSTNAMES,
  'subjects.nameChange3.surname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[]
  ) => getPreviousChanges(data, changes)[2]?.NEW_SURNAME,
  'newName.name.firstname': (data: DeedpollCsvRecord) =>
    sanitiseName(data.NEW_FIRSTNAMES),
  'newName.name.surname': (data: DeedpollCsvRecord) =>
    sanitiseName(data.NEW_SURNAME),
  'newName.reason': '',
  'informant.informantType': '',
  'informant.relationship': '',
  'informant.name': '',
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.idType': (_: DeedpollCsvRecord) => 'NONE' as IdType,
  'informant.passport': '',
  'informant.bc': '',
  'informant.idOther': '',
  'informant.address': '',
  'informant.address.city': '',
  'informant.phone': '',
  'informant.email': '',
  'witness.name': (data: DeedpollCsvRecord) => deriveName(data.WITNESS),
  'witness.occupation': (data: DeedpollCsvRecord) => data.WITNESS_OCCUPATION,
  'witness.address': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    __: DeedpollCsvRecord[],
    locationMap: LocationMap[]
  ) => resolveAddress(data.WITNESS_ADDRESS, locationMap)
}

export const nameChangeMetaDataMapping: Record<string, string> = {
  registrationNumber: 'deedpoll.DP_REF', //doesn't look unique
  dateOfRegistration: 'deedpoll.DATE'
}

export type NameChangeMetaData = {
  registrationDate: ResolverFunction<string>
  locationCode: ResolverFunction<string | null>
}

export const nameChangeMetaData: NameChangeMetaData = {
  registrationDate: (data: DeedpollCsvRecord) => toISODate(data.DATE),
  locationCode: (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    __: DeedpollCsvRecord[],
    locationMap: LocationMap[]
  ) => getLocationCode(data.ISLAND, locationMap)
}
