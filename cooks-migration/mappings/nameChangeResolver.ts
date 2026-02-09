import { Address } from '../helpers/addressConfig.ts'
import { BirthCsvRecord, DeedpollCsvRecord } from '../helpers/csvTypes.ts'
import { toCrvsDate, toISODate, toName } from '../helpers/resolverHelpers.ts'
import { Name } from '../helpers/types.ts'

const getPreviousChanges = (
  current: DeedpollCsvRecord,
  all: DeedpollCsvRecord[],
) => {
  const currentIndex = all.indexOf(current)
  return all.slice(0, currentIndex)
}

export type ResolverFunction<T> =
  | ((data: DeedpollCsvRecord) => T)
  | ((data: DeedpollCsvRecord, birth: BirthCsvRecord) => T)
  | ((
      data: DeedpollCsvRecord,
      all: BirthCsvRecord,
      changes: DeedpollCsvRecord[],
    ) => T)

type NameChangeResolver = {
  'reason.option': string
  'reason.other': string
  'subjects.nationality': string
  'subjects.brn': string | ((data: DeedpollCsvRecord) => string)
  'subjects.brnText': string
  'subjects.name': ResolverFunction<string>
  'subjects.dob': ResolverFunction<string>
  'subjects.address': ResolverFunction<Address>
  'subjects.nameChangedViaDeadPoll': ResolverFunction<boolean>
  'subjects.nameChange1.deedPollNumber': ResolverFunction<string | undefined>
  'subjects.nameChange1.firstname': ResolverFunction<string | undefined>
  'subjects.nameChange1.surname': ResolverFunction<string | undefined>
  'subjects.nameChange1.addAnother': string
  'subjects.nameChange2.deedPollNumber': ResolverFunction<string | undefined>
  'subjects.nameChange2.firstname': ResolverFunction<string | undefined>
  'subjects.nameChange2.surname': ResolverFunction<string | undefined>
  'subjects.nameChange2.addAnother': string
  'subjects.nameChange3.deedPollNumber': ResolverFunction<string | undefined>
  'subjects.nameChange3.firstname': ResolverFunction<string | undefined>
  'subjects.nameChange3.surname': ResolverFunction<string | undefined>
  'newName.name.firstname': ResolverFunction<string>
  'newName.name.surname': ResolverFunction<string>
  'newName.reason': string
  'informant.informantType': string
  'informant.relationship': string
  'informant.name': string
  'informant.dob': string
  'informant.dobUnknown': string
  'informant.age': string
  'informant.idType': string
  'informant.passport': string
  'informant.bc': string
  'informant.idOther': string
  'informant.address': string
  'informant.address.city': string
  'informant.phone': string
  'informant.email': string
  'witness.name': ResolverFunction<Name>
  'witness.occupation': ResolverFunction<string>
  'witness.address': ResolverFunction<string>
}

export const nameChangeResolver: NameChangeResolver = {
  'reason.option': '',
  'reason.other': '',
  'subjects.nationality': '',
  'subjects.brn': '',
  'subjects.brnText': '',
  'subjects.name': (_: DeedpollCsvRecord, birth: BirthCsvRecord) =>
    birth.CHILDS_NAME,
  'subjects.dob': (_: DeedpollCsvRecord, birth: BirthCsvRecord) =>
    toCrvsDate(birth.CHILDS_DOB),
  'subjects.address': (data: DeedpollCsvRecord) => data.ISLAND, // Not so sure about this
  'subjects.nameChangedViaDeadPoll': () => true,
  'subjects.nameChange1.deedPollNumber': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[0]?.DP_REF,
  'subjects.nameChange1.firstname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[0]?.NEW_FIRSTNAMES,
  'subjects.nameChange1.surname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[0]?.NEW_SURNAME,
  'subjects.nameChange1.addAnother': '',
  'subjects.nameChange2.deedPollNumber': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[1]?.DP_REF,
  'subjects.nameChange2.firstname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[1]?.NEW_FIRSTNAMES,
  'subjects.nameChange2.surname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[1]?.NEW_SURNAME,
  'subjects.nameChange2.addAnother': '',
  'subjects.nameChange3.deedPollNumber': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[2]?.DP_REF,
  'subjects.nameChange3.firstname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[2]?.NEW_FIRSTNAMES,
  'subjects.nameChange3.surname': (
    data: DeedpollCsvRecord,
    _: BirthCsvRecord,
    changes: DeedpollCsvRecord[],
  ) => getPreviousChanges(data, changes)[2]?.NEW_SURNAME,
  'newName.name.firstname': (data: DeedpollCsvRecord) => data.NEW_FIRSTNAMES,
  'newName.name.surname': (data: DeedpollCsvRecord) => data.NEW_SURNAME,
  'newName.reason': '',
  'informant.informantType': '',
  'informant.relationship': '',
  'informant.name': '',
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.idOther': '',
  'informant.address': '',
  'informant.address.city': '',
  'informant.phone': '',
  'informant.email': '',
  'witness.name': (data: DeedpollCsvRecord) => {
    const names = data.WITNESS.split(' ').filter(Boolean)
    const surname = names.length > 1 ? names.pop() || '' : ''
    const firstname = names.join(' ')
    return toName(firstname, surname)
  },
  'witness.occupation': (data: DeedpollCsvRecord) => data.WITNESS_OCCUPATION,
  'witness.address': (data: DeedpollCsvRecord) => data.WITNESS_ADDRESS,
}

export const nameChangeMetaDataMapping: Record<string, string> = {
  registrationNumber: 'deedpoll.DP_REF', //doesn't look unique
  dateOfRegistration: 'deedpoll.DATE',
}

export type NameChangeMetaData = {
  registrationDate: ResolverFunction<string>
  registrar: ResolverFunction<string>
  locationCode: ResolverFunction<string | null>
}

export const nameChangeMetaData: NameChangeMetaData = {
  registrationDate: (data: DeedpollCsvRecord) => toISODate(data.DATE),
  registrar: (data: DeedpollCsvRecord) => data.REGISTRAR, // TODO Create from island?
  locationCode: (
    data: DeedpollCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => {
    const location = getLocation(data.CHILDS_BIRTHPLACE, locationMap)
    if (location?.map?.includes('COK')) {
      return location.map
    }
    return (
      Object.entries(FALLBACK_ISLAND_PREFIX_MAP).find(
        ([_, value]) => value === data.BIRTH_REF.substring(0, 4),
      )?.[0] || null
    )
  },
}
