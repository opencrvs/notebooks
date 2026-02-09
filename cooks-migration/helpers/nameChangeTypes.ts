import { Address } from './addressConfig.ts'
import { BirthCsvRecord, DeedpollCsvRecord } from './csvTypes.ts'
import { LocationMap } from './types.ts'

export type ResolverFunction<T> =
  | ((data: DeedpollCsvRecord) => T)
  | ((data: DeedpollCsvRecord, birth: BirthCsvRecord) => T)
  | ((
      data: DeedpollCsvRecord,
      all: BirthCsvRecord,
      changes: DeedpollCsvRecord[],
    ) => T)
  | ((
      data: DeedpollCsvRecord,
      all: BirthCsvRecord,
      changes: DeedpollCsvRecord[],
      locationMap: LocationMap[],
    ) => T)

export type NameChangeResolver = {
  'reason.option': string
  'reason.other': string
  'subjects.nationality': string
  'subjects.brn': string | ((data: DeedpollCsvRecord) => string)
  'subjects.brnText': string
  'subjects.name': ResolverFunction<string>
  'subjects.dob': ResolverFunction<string>
  'subjects.address': ResolverFunction<Address | undefined>
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
