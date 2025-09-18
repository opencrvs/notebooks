import {
  convertAddress,
  getCustomField,
  getDocuments,
  getIdentifier,
  getName,
} from './resolverUtils.ts'
import { EventRegistration, ResolverMap } from './types.ts'

// Type definition for resolver data parameter
type ResolverData = EventRegistration

const ZAMBIA_COUNTRY_CODE = '+26'

const informantResolver: ResolverMap = {
  'informant.dob': (data: ResolverData) => data.informant?.birthDate, // type: 'DATE',
  /* @todo Addresses need to be properly handled */
  'informant.address': (data: ResolverData) =>
    convertAddress(data.informant?.address?.[0]), // type: FieldType.ADDRESS,
  // @question, is informant.telecom correct or this?
  'informant.phoneNo': (data: ResolverData) =>
    data.registration.contactPhoneNumber?.replace(ZAMBIA_COUNTRY_CODE, ''), // @todo https://github.com/opencrvs/opencrvs-core/issues/9601
  'informant.email': (data: ResolverData) => data.registration.contactEmail, // type: FieldType.EMAIL,
  'informant.relation': (data: ResolverData) => data.informant?.relationship, // FieldType.SELECT
  'informant.other.relation': (data: ResolverData) =>
    data.informant?.otherRelationship, // FieldType.TEXT
  'informant.name': (data: ResolverData) => getName(data.informant?.name?.[0]), // FieldType.TEXT
  'informant.dobUnknown': (data: ResolverData) =>
    data.informant?.exactDateOfBirthUnknown, // FieldType.CHECKBOX
  // @question, is this informant.age or informant.ageOfIndividualInYears?
  'informant.age': (data: ResolverData) =>
    data.informant?.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  'informant.nationality': (data: ResolverData) =>
    data.informant?.nationality?.[0], // FieldType.COUNTRY
  'informant.brn': (data: ResolverData) =>
    getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER'),
  'informant.nid': (data: ResolverData) =>
    getIdentifier(data.informant, 'NATIONAL_ID'),
  'informant.passport': (data: ResolverData) =>
    getIdentifier(data.informant, 'PASSPORT'),
}

const documentsResolver: ResolverMap = {
  'documents.proofOfBirth': (data: ResolverData) => getDocuments(data, 'CHILD'),
  'documents.proofOfMother': (data: ResolverData) =>
    getDocuments(data, 'MOTHER'),
  'documents.proofOfFather': (data: ResolverData) =>
    getDocuments(data, 'FATHER'),
  'documents.proofOfInformant': (data: ResolverData) =>
    getDocuments(data, 'INFORMANT_ID_PROOF'),
  'documents.proofOther': (data: ResolverData) => getDocuments(data, 'OTHER'),
  'documents.proofOfDeceased': (data: ResolverData) =>
    getDocuments(data, 'DECEASED_ID_PROOF'),
  'documents.proofOfDeath': (data: ResolverData) =>
    getDocuments(data, 'INFORMANT_ID_PROOF'), // TODO not this
  'documents.proofOfCauseOfDeath': (data: ResolverData) =>
    getDocuments(data, 'DECEASED_DEATH_PROOF'),
}

export const deathResolver: ResolverMap = {
  'deceased.name': (data: ResolverData) => getName(data.deceased?.name?.[0]),
  'deceased.gender': (data: ResolverData) => data.deceased?.gender,
  'deceased.dob': (data: ResolverData) => data.deceased?.birthDate,
  'deceased.dobUnknown': (data: ResolverData) =>
    data.deceased?.exactDateOfBirthUnknown,
  'deceased.age': (data: ResolverData) =>
    data.deceased?.ageOfIndividualInYears?.toString(),
  'deceased.nationality': (data: ResolverData) =>
    data.deceased?.nationality?.[0],
  'deceased.idType': (data: ResolverData) =>
    getCustomField(data, 'death.deceased.deceased-view-group.deceasedIdType'),
  'deceased.nid': (data: ResolverData) =>
    getIdentifier(data.deceased, 'NATIONAL_ID'),
  'deceased.passport': (data: ResolverData) =>
    getIdentifier(data.deceased, 'PASSPORT'),
  'deceased.brn': (data: ResolverData) =>
    getIdentifier(data.deceased, 'BIRTH_REGISTRATION_NUMBER'),
  'deceased.maritalStatus': (data: ResolverData) =>
    data.deceased?.maritalStatus,
  'deceased.numberOfDependants': (data: ResolverData) => {
    const numberOfDependants = getCustomField(
      data,
      'death.deceased.deceased-view-group.numberOfDependants'
    )
    return numberOfDependants ? parseInt(numberOfDependants, 10) : undefined
  },
  'deceased.address': (data: ResolverData) =>
    convertAddress(data.deceased?.address?.[0]),
  'eventDetails.date': (data: ResolverData) =>
    data.deceased?.deathDate || data.deathDate,
  'eventDetails.description': (data: ResolverData) => data.deathDescription,
  'eventDetails.reasonForLateRegistration': (data: ResolverData) =>
    getCustomField(
      data,
      'death.deathEvent.death-event-details.reasonForLateRegistration'
    ),
  'eventDetails.causeOfDeathEstablished': (data: ResolverData) =>
    Boolean(data.causeOfDeathEstablished),
  'eventDetails.sourceCauseDeath': (data: ResolverData) =>
    data.causeOfDeathMethod,
  'eventDetails.mannerOfDeath': (data: ResolverData) => data.mannerOfDeath,
  'eventDetails.placeOfDeath': (data: ResolverData) => data.eventLocation?.type,
  'eventDetails.deathLocation': (data: ResolverData) =>
    data.eventLocation?.type === 'HEALTH_FACILITY'
      ? data.eventLocation.id
      : null,
  'eventDetails.deathLocationOther': (data: ResolverData) =>
    data.eventLocation?.type === 'OTHER'
      ? convertAddress(data.eventLocation.address)
      : null,
  'informant.addressSameAs': (data: ResolverData) =>
    JSON.stringify(data.informant?.address?.[0]) ===
    JSON.stringify(data.deceased?.address?.[0])
      ? 'YES'
      : 'NO',
  'informant.idType': (data: ResolverData) =>
    getCustomField(
      data,
      'death.informant.informant-view-group.informantIdType'
    ),
  'spouse.detailsNotAvailable': (data: ResolverData) =>
    !data.spouse?.detailsExist,
  'spouse.reason': (data: ResolverData) => data.spouse?.reasonNotApplying,
  'spouse.name': (data: ResolverData) => getName(data.spouse?.name?.[0]),
  'spouse.dob': (data: ResolverData) => data.spouse?.birthDate,
  'spouse.dobUnknown': (data: ResolverData) =>
    data.spouse?.exactDateOfBirthUnknown,
  'spouse.age': (data: ResolverData) => data.spouse?.ageOfIndividualInYears,
  'spouse.nationality': (data: ResolverData) => data.spouse?.nationality?.[0],
  'spouse.idType': (data: ResolverData) =>
    getCustomField(data, 'death.spouse.spouse-view-group.spouseIdType'),
  'spouse.nid': (data: ResolverData) =>
    getIdentifier(data.spouse, 'NATIONAL_ID'),
  'spouse.passport': (data: ResolverData) =>
    getIdentifier(data.spouse, 'PASSPORT'),
  'spouse.brn': (data: ResolverData) =>
    getIdentifier(data.spouse, 'BIRTH_REGISTRATION_NUMBER'),
  'spouse.address': (data: ResolverData) =>
    convertAddress(data.spouse?.address?.[0]),
  'spouse.addressSameAs': (data: ResolverData) =>
    JSON.stringify(data.deceased?.address?.[0]) ===
    JSON.stringify(data.spouse?.address?.[0])
      ? 'YES'
      : 'NO',
}

export const birthResolver: ResolverMap = {
  'child.name': (data: ResolverData) => getName(data.child?.name?.[0]),

  /*
   * OPTIONAL FOR COUNTRIES
   */

  'child.gender': (data: ResolverData) => data.child?.gender,
  'child.dob': (data: ResolverData) => data.child?.birthDate,
  /*
   * Address fields in different situations
   * @todo Addresses need to be properly handled
   */
  'child.placeOfBirth': (data: ResolverData) => data.eventLocation?.type,
  'child.birthLocation': (data: ResolverData) =>
    data.eventLocation?.type === 'HEALTH_FACILITY'
      ? data.eventLocation.id
      : null,
  'child.address.privateHome': (data: ResolverData) =>
    data.eventLocation?.type === 'PRIVATE_HOME'
      ? convertAddress(data.eventLocation?.address)
      : null,
  'child.address.other': (data: ResolverData) =>
    data.eventLocation?.type === 'OTHER'
      ? convertAddress(data.eventLocation?.address)
      : null,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * In GraphQL there's a field "otherAttendantAtBirth". I wonder what that is
   */
  'child.attendantAtBirth': (data: ResolverData) => data.attendantAtBirth, // FieldType.SELECT,
  'child.birthType': (data: ResolverData) => data.birthType, // FieldType.SELECT,
  'child.weightAtBirth': (data: ResolverData) => data.weightAtBirth, // FieldType.NUMBER,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * childrenBornAliveToMother
   * foetalDeathsToMother
   * lastPreviousLiveBirth
   */
  'mother.detailsNotAvailable': (data: ResolverData) =>
    !data.mother?.detailsExist,
  'mother.reason': (data: ResolverData) => data.mother?.reasonNotApplying,
  'mother.name': (data: ResolverData) => getName(data.mother?.name?.[0]),
  'mother.dob': (data: ResolverData) => data.mother?.birthDate,
  'mother.dobUnknown': (data: ResolverData) =>
    data.mother?.exactDateOfBirthUnknown,
  'mother.age': (data: ResolverData) =>
    data.mother?.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  'mother.nationality': (data: ResolverData) => data.mother?.nationality?.[0],
  'mother.maritalStatus': (data: ResolverData) => data.mother?.maritalStatus,
  'mother.educationalAttainment': (data: ResolverData) =>
    data.mother?.educationalAttainment,
  'mother.occupation': (data: ResolverData) => data.mother?.occupation,
  'mother.previousBirths': (data: ResolverData) => data.mother?.multipleBirth,
  'mother.address': (data: ResolverData) =>
    convertAddress(data.mother?.address?.[0]),
  'father.detailsNotAvailable': (data: ResolverData) =>
    !data.father?.detailsExist,
  // @question, is this the right field?
  'father.reason': (data: ResolverData) => data.father?.reasonNotApplying,
  'father.name': (data: ResolverData) => getName(data.father?.name?.[0]),
  'father.dob': (data: ResolverData) => data.father?.birthDate,
  'father.dobUnknown': (data: ResolverData) =>
    data.father?.exactDateOfBirthUnknown,
  'father.age': (data: ResolverData) =>
    data.father?.ageOfIndividualInYears?.toString() /* @todo not a fan of this */,
  'father.nationality': (data: ResolverData) => data.father?.nationality?.[0],
  'father.maritalStatus': (data: ResolverData) => data.father?.maritalStatus,
  'father.educationalAttainment': (data: ResolverData) =>
    data.father?.educationalAttainment,
  'father.occupation': (data: ResolverData) => data.father?.occupation,
  'father.address': (data: ResolverData) =>
    convertAddress(data.father?.address?.[0]),
  // @todo this is a nasty one as it never was a field in the database
  // but instead a computed field that just copied mothers address data for father as
  'father.addressSameAs': (data: ResolverData) =>
    JSON.stringify(data.father?.address?.[0]) ===
    JSON.stringify(data.mother?.address?.[0])
      ? 'YES'
      : 'NO',

  // @todo
  // PARENT: 'PARENT',
  // INFORMANT_ID_PROOF: 'INFORMANT_ID_PROOF',
  // LEGAL_GUARDIAN_PROOF: 'LEGAL_GUARDIAN_PROOF'

  'informant.brn': (data: ResolverData) =>
    getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER'),
  'mother.brn': (data: ResolverData) =>
    getIdentifier(data.mother, 'BIRTH_REGISTRATION_NUMBER'),
  'father.brn': (data: ResolverData) =>
    getIdentifier(data.father, 'BIRTH_REGISTRATION_NUMBER'),

  'mother.nid': (data: ResolverData) =>
    getIdentifier(data.mother, 'NATIONAL_ID'),
  'father.nid': (data: ResolverData) =>
    getIdentifier(data.father, 'NATIONAL_ID'),

  'mother.passport': (data: ResolverData) =>
    getIdentifier(data.mother, 'PASSPORT'),
  'father.passport': (data: ResolverData) =>
    getIdentifier(data.father, 'PASSPORT'),

  // Previously custom fields
  'child.reason': (data: ResolverData) =>
    getCustomField(
      data,
      'birth.child.child-view-group.reasonForLateRegistration'
    ),

  'informant.idType': (data: ResolverData) =>
    getCustomField(
      data,
      'birth.informant.informant-view-group.informantIdType'
    ),

  'mother.idType': (data: ResolverData) =>
    getCustomField(data, 'birth.mother.mother-view-group.motherIdType'),

  'father.idType': (data: ResolverData) =>
    getCustomField(data, 'birth.father.father-view-group.fatherIdType'),
}

const defaultResolvers: ResolverMap = {
  ...birthResolver,
  ...deathResolver,
  ...informantResolver,
  ...documentsResolver,
}

export default defaultResolvers
