import { BirthCsvRecord, DeedpollCsvRecord } from '../helpers/csvTypes.ts'

const getPreviousChanges = (
  current: DeedpollCsvRecord,
  all: DeedpollCsvRecord[],
) => {
  const currentIndex = all.indexOf(current)
  return all.slice(0, currentIndex)
}

//type  NameChangeResolver =

export const nameChangeResolver: NameChangeResolver = {
  'reason.option': '',
  'reason.other': '',
  'subjects.nationality': '',
  'subjects.brn': '', // (data: DeedpollCsvRecord) => data.BIRTH_REF, // That's a search
  'subjects.brnText': '',
  'subjects.name': (_: DeedpollCsvRecord, birth: BirthCsvRecord) =>
    birth.CHILDS_NAME,
  'subjects.dob': (_: DeedpollCsvRecord, birth: BirthCsvRecord) =>
    birth.CHILDS_DOB,
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
  'newName.name.surname': (data: DeedpollCsvRecord) => data.NEW_SURNAME, // Sort by date to determine latest?
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
  'witness.name': (data: DeedpollCsvRecord) => data.WITNESS, // But there is a witness per name change? Do I take latest
  'witness.occupation': (data: DeedpollCsvRecord) => data.WITNESS_OCCUPATION,
  'witness.address': (data: DeedpollCsvRecord) => data.WITNESS_ADDRESS,
}

export const nameChangeMetaDataMapping: Record<string, string> = {
  registrationNumber: 'deedpoll.DP_REF', //doesn't look unique
  dateOfRegistration: 'deedpoll.DATE',
}
