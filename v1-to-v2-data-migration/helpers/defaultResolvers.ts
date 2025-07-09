import {
  convertAddress,
  getCustomField,
  getDocuments,
  getIdentifier,
  getName,
} from './resolverUtils.ts'

const informantResolver = {
  'informant.dob': (data) => data.informant.birthDate, // type: 'DATE',
  /* @todo Addresses need to be properly handled */
  'informant.address': (data) => convertAddress(data.informant.address[0]), // type: FieldType.ADDRESS,
  // @question, is informant.telecom correct or this?
  'informant.phoneNo': (data) =>
    data.registration.contactPhoneNumber?.replace('+26', ''), // @todo https://github.com/opencrvs/opencrvs-core/issues/9601
  'informant.email': (data) => data.registration.contactEmail, // type: FieldType.EMAIL,
  'informant.relation': (data) => data.informant.relationship, // FieldType.SELECT
  'informant.other.relation': (data) => data.informant.otherRelationship, // FieldType.TEXT
  'informant.name': (data) => getName(data.informant.name[0]), // FieldType.TEXT
  'informant.dobUnknown': (data) => data.informant.exactDateOfBirthUnknown, // FieldType.CHECKBOX
  // @question, is this informant.age or informant.ageOfIndividualInYears?
  'informant.age': (data) =>
    data.informant.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  'informant.nationality': (data) => data.informant.nationality?.[0], // FieldType.COUNTRY
  'informant.brn': (data) =>
    getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER'),
  'informant.nid': (data) => getIdentifier(data.informant, 'NATIONAL_ID'),
  'informant.passport': (data) => getIdentifier(data.informant, 'PASSPORT'),
}

export const deathResolver = {
  'deceased.name': (data) => getName(data.deceased.name[0]),
  'deceased.gender': (data) => data.deceased.gender,
  'deceased.dob': (data) => data.deceased.birthDate,
  'deceased.dobUnknown': (data) => data.deceased.exactDateOfBirthUnknown,
  'deceased.age': (data) => data.deceased.ageOfIndividualInYears?.toString(),
  'deceased.nationality': (data) => data.deceased.nationality?.[0],
  'deceased.idType': (data) =>
    getCustomField(data, 'death.deceased.deceased-view-group.deceasedIdType'),
  'deceased.nid': (data) => getIdentifier(data.deceased, 'NATIONAL_ID'),
  'deceased.passport': (data) => getIdentifier(data.deceased, 'PASSPORT'),
  'deceased.brn': (data) =>
    getIdentifier(data.deceased, 'BIRTH_REGISTRATION_NUMBER'),
  'deceased.maritalStatus': (data) => data.deceased.maritalStatus,
  'deceased.numberOfDependants': (data) =>
    parseInt(
      getCustomField(
        data,
        'death.deceased.deceased-view-group.numberOfDependants'
      )
    ),
  'deceased.address': (data) => convertAddress(data.deceased.address[0]),
  'eventDetails.date': (data) => data.deceased.deceased.deathDate,
  'eventDetails.description': (data) => data.deathDescription,
  'eventDetails.reasonForLateRegistration': (data) =>
    getCustomField(
      data,
      'death.deathEvent.death-event-details.reasonForLateRegistration'
    ),
  'eventDetails.causeOfDeathEstablished': (data) =>
    Boolean(data.causeOfDeathEstablished),
  'eventDetails.sourceCauseDeath': (data) => data.causeOfDeathMethod,
  'eventDetails.mannerOfDeath': (data) => data.mannerOfDeath,
  'eventDetails.placeOfDeath': (data) => data.eventLocation.type,
  'eventDetails.deathLocation': (data) =>
    data.eventLocation.type === 'HEALTH_FACILITY'
      ? data.eventLocation.id
      : null,
  'eventDetails.deathLocationOther': (data) =>
    data.eventLocation.type === 'OTHER'
      ? convertAddress(data.eventLocation.address)
      : null,
  'informant.addressSameAs': (data) =>
    JSON.stringify(data.informant.address[0]) ===
    JSON.stringify(data.deceased.address[0])
      ? 'YES'
      : 'NO',
  'informant.idType': (data) =>
    getCustomField(
      data,
      'death.informant.informant-view-group.informantIdType'
    ),
  'spouse.detailsNotAvailable': (data) => !data.spouse.detailsExist,
  'spouse.reason': (data) => data.spouse.reasonNotApplying,
  'spouse.name': (data) => getName(data.spouse?.name[0]),
  'spouse.dob': (data) => data.spouse.birthDate,
  'spouse.dobUnknown': (data) => data.spouse.exactDateOfBirthUnknown,
  'spouse.age': (data) => data.spouse.ageOfIndividualInYears,
  'spouse.nationality': (data) => data.spouse.nationality?.[0],
  'spouse.idType': (data) =>
    getCustomField(data, 'death.spouse.spouse-view-group.spouseIdType'),
  'spouse.nid': (data) => getIdentifier(data.spouse, 'NATIONAL_ID'),
  'spouse.passport': (data) => getIdentifier(data.spouse, 'PASSPORT'),
  'spouse.brn': (data) =>
    getIdentifier(data.spouse, 'BIRTH_REGISTRATION_NUMBER'),
  'spouse.address': (data) => convertAddress(data.spouse.address[0]),
  'spouse.addressSameAs': (data) =>
    JSON.stringify(data.deceased.address[0]) ===
    JSON.stringify(data.spouse.address[0])
      ? 'YES'
      : 'NO',
  'documents.proofOfDeceased': (data) =>
    getDocuments(data, 'DECEASED_ID_PROOF'),
  'documents.proofOfDeath': (data) => getDocuments(data, 'INFORMANT_ID_PROOF'), // TODO not this
  'documents.proofOfCauseOfDeath': (data) =>
    getDocuments(data, 'DECEASED_DEATH_PROOF'),
}

export const birthResolver = {
  'child.name': (data) => getName(data.child.name[0]),

  /*
   * OPTIONAL FOR COUNTRIES
   */

  'child.gender': (data) => data.child.gender,
  'child.dob': (data) => data.child.birthDate,
  /*
   * Address fields in different situations
   * @todo Addresses need to be properly handled
   */
  'child.placeOfBirth': (data) => data.eventLocation.type,
  'child.birthLocation': (data) =>
    data.eventLocation.type === 'HEALTH_FACILITY'
      ? data.eventLocation.id
      : null,
  'child.address.privateHome': (data) =>
    data.eventLocation.type === 'PRIVATE_HOME'
      ? convertAddress(data.eventLocation.address)
      : null,
  'child.address.other': (data) =>
    data.eventLocation.type === 'OTHER'
      ? convertAddress(data.eventLocation.address)
      : null,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * In GraphQL there's a field "otherAttendantAtBirth". I wonder what that is
   */
  'child.attendantAtBirth': (data) => data.attendantAtBirth, // FieldType.SELECT,
  'child.birthType': (data) => data.birthType, // FieldType.SELECT,
  'child.weightAtBirth': (data) => data.weightAtBirth, // FieldType.NUMBER,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * childrenBornAliveToMother
   * foetalDeathsToMother
   * lastPreviousLiveBirth
   */
  'mother.detailsNotAvailable': (data) => !data.mother.detailsExist,
  'mother.reason': (data) => data.mother.reasonNotApplying,
  'mother.name': (data) => getName(data.mother.name?.[0]),
  'mother.dob': (data) => data.mother.birthDate,
  'mother.dobUnknown': (data) => data.mother.exactDateOfBirthUnknown,
  'mother.age': (data) =>
    data.mother.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  'mother.nationality': (data) => data.mother.nationality?.[0],
  'mother.maritalStatus': (data) => data.mother.maritalStatus,
  'mother.educationalAttainment': (data) => data.mother.educationalAttainment,
  'mother.occupation': (data) => data.mother.occupation,
  'mother.previousBirths': (data) => data.mother.multipleBirth,
  'mother.address': (data) => convertAddress(data.mother.address?.[0]),
  'father.detailsNotAvailable': (data) => !data.father.detailsExist,
  // @question, is this the right field?
  'father.reason': (data) => data.father.reasonNotApplying,
  'father.name': (data) => getName(data.father.name?.[0]),
  'father.dob': (data) => data.father.birthDate,
  'father.dobUnknown': (data) => data.father.exactDateOfBirthUnknown,
  'father.age': (data) =>
    data.father.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  'father.nationality': (data) => data.father.nationality?.[0],
  'father.maritalStatus': (data) => data.father.maritalStatus,
  'father.educationalAttainment': (data) => data.father.educationalAttainment,
  'father.occupation': (data) => data.father.occupation,
  'father.address': (data) => convertAddress(data.father.address[0]),
  // @todo this is a nasty one as it never was a field in the database
  // but instead a computed field that just copied mothers address data for father as
  'father.addressSameAs': (data) =>
    JSON.stringify(data.father.address?.[0]) ===
    JSON.stringify(data.mother.address?.[0])
      ? 'YES'
      : 'NO',

  // @todo
  // PARENT: 'PARENT',
  // INFORMANT_ID_PROOF: 'INFORMANT_ID_PROOF',
  // LEGAL_GUARDIAN_PROOF: 'LEGAL_GUARDIAN_PROOF'
  'documents.proofOfBirth': (data) => getDocuments(data, 'CHILD'),
  'documents.proofOfMother': (data) => getDocuments(data, 'MOTHER'),
  'documents.proofOfFather': (data) => getDocuments(data, 'FATHER'),
  'documents.proofOfInformant': (data) =>
    getDocuments(data, 'INFORMANT_ID_PROOF'),
  'documents.proofOther': (data) => getDocuments(data, 'OTHER'),

  'informant.brn': (data) =>
    getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER'),
  'mother.brn': (data) =>
    getIdentifier(data.mother, 'BIRTH_REGISTRATION_NUMBER'),
  'father.brn': (data) =>
    getIdentifier(data.father, 'BIRTH_REGISTRATION_NUMBER'),

  'mother.nid': (data) => getIdentifier(data.mother, 'NATIONAL_ID'),
  'father.nid': (data) => getIdentifier(data.father, 'NATIONAL_ID'),

  'mother.passport': (data) => getIdentifier(data.mother, 'PASSPORT'),
  'father.passport': (data) => getIdentifier(data.father, 'PASSPORT'),

  // Previously custom fields
  'child.reason': (data) =>
    getCustomField(
      data,
      'birth.child.child-view-group.reasonForLateRegistration'
    ),

  'informant.idType': (data) =>
    getCustomField(
      data,
      'birth.informant.informant-view-group.informantIdType'
    ),

  'mother.idType': (data) =>
    getCustomField(data, 'birth.mother.mother-view-group.motherIdType'),

  'father.idType': (data) =>
    getCustomField(data, 'birth.father.father-view-group.fatherIdType'),
}

export default { ...birthResolver, ...deathResolver, ...informantResolver }
