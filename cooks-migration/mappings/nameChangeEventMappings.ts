export const nameChangeEventMapping: Record<string, string> = {
  'reason.option': '',
  'reason.other': '',
  'subjects.nationality': '',
  'subjects.brn': 'deedpoll.BIRTH_REF',
  'subjects.brnText': '',
  'subjects.name': 'birth.CHILDS_NAME',
  'subjects.dob': 'birth.CHILDS_DOB',
  'subjects.address': 'deedpoll.ISLAND', // Not so sure about this
  'subjects.nameChangedViaDeadPoll': '',
  'subjects.nameChange1.deedPollNumber': 'deedpoll.DP_REF',
  'subjects.nameChange1.firstname': 'deedpoll.NEW_FIRSTNAMES',
  'subjects.nameChange1.surname': 'deedpoll.NEW_SURNAME',
  'subjects.nameChange1.addAnother': '',
  'subjects.nameChange2.deedPollNumber': 'deedpoll.DP_REF',
  'subjects.nameChange2.firstname': 'deedpoll.NEW_FIRSTNAMES',
  'subjects.nameChange2.surname': 'deedpoll.NEW_SURNAME',
  'subjects.nameChange2.addAnother': '',
  'subjects.nameChange3.deedPollNumber': 'deedpoll.DP_REF',
  'subjects.nameChange3.firstname': 'deedpoll.NEW_FIRSTNAMES',
  'subjects.nameChange3.surname': 'deedpoll.NEW_SURNAME',
  'newName.name.firstname': 'deedpoll.NEW_FIRSTNAMES',
  'newName.name.surname': 'deedpoll.NEW_SURNAME', // Sort by date to determine latest?
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
  'witness.name': 'deedpoll.WITNESS',
  'witness.occupation': 'deedpoll.WITNESS_OCCUPATION',
  'witness.address': 'deedpoll.WITNESS_ADDRESS',
}

export const nameChangeMetaDataMapping: Record<string, string> = {
  registrationNumber: 'deedpoll.DP_REF', //doesn't look unique
  dateOfRegistration: 'deedpoll.DATE',
}

export default {
  ...nameChangeEventMapping,
  ...nameChangeMetaDataMapping,
}
