import { v4 as uuidv4 } from 'npm:uuid'

//TODO how will this work for dynamic location levels like Uganda
function convertAddress(address) {
  if (!address) {
    return null
  }
  const international = address.country !== 'FAR'
  if (international) {
    return {
      addressType: 'INTERNATIONAL',
      country: address.country,
      state: address.state,
      district2: address.district,
      cityOrTown: address.city,
      addressLine1: address.line.filter(Boolean)[0],
      addressLine2: address.line.filter(Boolean)[1],
      addressLine3: address.line.filter(Boolean).slice(2).join(', '),
      postcodeOrZip: address.postalCode,
    }
  }

  const rural = address.line.some((line) => line === 'RURAL')

  if (rural) {
    return {
      addressType: 'DOMESTIC',
      urbanOrRural: 'RURAL',
      country: address.country,
      province: address.state,
      district: address.district,
      village: address.line.find((line) => line.trim() !== ''),
    }
  }

  return {
    addressType: 'DOMESTIC',
    urbanOrRural: 'URBAN',
    country: address.country,
    province: address.state,
    district: address.district,
    town: address.city,
    zipCode: address.postalCode,
  }
}

const getIdentifier = (data, identifier) =>
  data.identifier?.find(({ type }) => type === identifier)?.id

const getDocuments = (data, type) => {
  const documents = data.registration.attachments
    ?.filter(({ subject }) => subject === type)
    ?.map((doc) => ({
      filename: doc.uri.replace('/ocrvs/', ''),
      originalFilename: doc.uri.replace('/ocrvs/', ''),
      type: doc.contentType,
      option: doc.type,
    }))
  if (!documents) {
    return null
  }
  return documents
}

// What about custom fields
const getName = (name) => ({
  firstname: name?.firstNames,
  middleName: name?.middleName,
  surname: name?.familyName,
})

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
    getCustomField(
      data,
      'death.deceased.deceased-view-group.numberOfDependants'
    ),
  'deceased.address': (data) => convertAddress(data.deceased.address[0]),
  'eventDetails.date': (data) => data.deceased.deceased.deathDate,
  'eventDetails.reasonForLateRegistration': (data) =>
    getCustomField(
      data,
      'death.deathEvent.death-event-details.reasonForLateRegistration'
    ),
  'eventDetails.causeOfDeathEstablished': (data) =>
    data.causeOfDeathEstablished,
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
  'spouse.detailsNotAvailable': (data) => !data.spouse.detailsExist,
  'spouse.reason': (data) => data.spouse.reasonNotApplying,
  'spouse.name': (data) => getName(data.spouse?.name[0]),
  'spouse.dob': (data) => data.spouse.birthDate,
  'spouse.dobUnknown': (data) => data.spouse.exactDateOfBirthUnknown,
  'spouse.age': (data) => data.spouse.ageOfIndividualInYears,
  'spouse.nationality': (data) => data.spouse.nationality?.[0],
  'spouse.idType': (data) =>
    getCustomField(
      data,
      'death.informant.informant-view-group.informantIdType'
    ),
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

export const resolver = {
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
  'documents.proofOfBirth': (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === 'CHILD'
    )
    if (!document) {
      return null
    }
    return {
      filename: document.uri.replace('/ocrvs/', ''),
      originalFilename: document.uri.replace('/ocrvs/', ''),
      type: document.contentType,
    }
  },
  'documents.proofOfMother': (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === 'MOTHER'
    )
    if (!document) {
      return null
    }
    return [
      {
        filename: document.uri.replace('/ocrvs/', ''),
        originalFilename: document.uri.replace('/ocrvs/', ''),
        type: document.contentType,
        option: document.type,
      },
    ]
  },
  'documents.proofOfFather': (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === 'FATHER'
    )
    if (!document) {
      return null
    }
    return [
      {
        filename: document.uri.replace('/ocrvs/', ''),
        originalFilename: document.uri.replace('/ocrvs/', ''),
        type: document.contentType,
        option: document.type,
      },
    ]
  },
  'documents.proofOfInformant': (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === 'INFORMANT_ID_PROOF'
    )
    if (!document) {
      return null
    }
    return [
      {
        filename: document.uri.replace('/ocrvs/', ''),
        originalFilename: document.uri.replace('/ocrvs/', ''),
        type: document.contentType,
        option: document.type,
      },
    ]
  },
  'documents.proofOther': (data) => {
    const document = data.registration.attachments?.find(
      ({ subject }) => subject === 'OTHER'
    )
    if (!document) {
      return null
    }
    return [
      {
        filename: document.uri.replace('/ocrvs/', ''),
        originalFilename: document.uri.replace('/ocrvs/', ''),
        type: document.contentType,
        option: document.type,
      },
    ]
  },
  'informant.brn': (data) =>
    getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER'),
  'mother.brn': (data) =>
    getIdentifier(data.mother, 'BIRTH_REGISTRATION_NUMBER'),
  'father.brn': (data) =>
    getIdentifier(data.father, 'BIRTH_REGISTRATION_NUMBER'),

  'informant.nid': (data) => getIdentifier(data.informant, 'NATIONAL_ID'),
  'mother.nid': (data) => getIdentifier(data.mother, 'NATIONAL_ID'),
  'father.nid': (data) => getIdentifier(data.father, 'NATIONAL_ID'),

  'informant.passport': (data) => getIdentifier(data.informant, 'PASSPORT'),
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

export function generateFieldId() {}

function getCustomField(data, id) {
  return data.questionnaire.find(({ fieldId }) => fieldId === id)?.value
}

function legacyHistoryItemToV2ActionType(record, declaration, historyItem) {
  if (!historyItem.action) {
    if (historyItem.regStatus === 'DECLARED') {
      return {
        type: 'DECLARE',
        declaration: declaration,
        annotation: {
          'review.signature': record.registration.informantsSignature,
          'review.comment': historyItem.comments
            ?.map(({ comment }) => comment)
            .join('\n'),
        },
      }
    }
    if (historyItem.regStatus === 'REGISTERED') {
      return {
        type: 'REGISTER',
        declaration: {},
        registrationNumber: record.registration.registrationNumber,
      }
    }
    if (historyItem.regStatus === 'WAITING_VALIDATION') {
      return {
        type: 'REGISTER',
        declaration: {},
        status: 'Requested',
      }
    }
    if (historyItem.regStatus === 'VALIDATED') {
      return {
        type: 'VALIDATE',
        declaration: {},
      }
    }
  }

  const type = {
    FLAGGED_AS_POTENTIAL_DUPLICATE: 'DETECT_DUPLICATE',
    MARKED_AS_DUPLICATE: 'MARKED_AS_DUPLICATE',
    DOWNLOADED: 'READ',
    REQUESTED_CORRECTION: 'REQUEST_CORRECTION',
    APPROVED_CORRECTION: 'APPROVE_CORRECTION',
    REJECTED_CORRECTION: 'REJECT_CORRECTION',
  }[historyItem.action]
  if (!type) {
    console.log('Invalid action', historyItem)
  }

  return { type, declaration: {} }
}

export function transform(eventRegistration) {
  const res = eventRegistration.child ? resolver : deathResolver
  const result = Object.entries(res).map(([fieldId, r]) => {
    return [fieldId, r(eventRegistration)]
  })
  const withOutNulls = result.filter(
    ([_, value]) => value !== null && value !== undefined
  )
  const declaration = Object.fromEntries(withOutNulls)

  const historyAsc = eventRegistration.history
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    .filter(
      (history) =>
        history.action !== 'ASSIGNED' && history.action !== 'UNASSIGNED'
    )
  const newest = historyAsc[historyAsc.length - 1]

  const documents = {
    id: eventRegistration.id,
    type: eventRegistration.child ? 'v2.birth' : 'v2.death',
    createdAt: new Date(historyAsc[0].date).toISOString(),
    updatedAt: new Date(newest.date).toISOString(),
    updatedAtLocation: newest.office.id,
    trackingId: eventRegistration.registration.trackingId,
    actions: [
      {
        type: 'CREATE',
        createdAt: new Date(historyAsc[0].date).toISOString(),
        createdBy: historyAsc[0].user.id,
        createdByUserType: 'user',
        createdByRole: historyAsc[0].user.role.id,
        createdAtLocation: historyAsc[0].office.id,
        updatedAtLocation: historyAsc[0].office.id,
        status: 'Accepted',
        declaration: {},
        id: uuidv4(),
        transactionId: uuidv4(),
      },
      ...historyAsc
        .filter((history) => history.action !== 'VIEWED')
        .map((history) => {
          return {
            id: uuidv4(), // history.id /* @todo add to graphql */,
            transactionId: uuidv4(),
            createdAt: new Date(history.date).toISOString(),
            createdBy: history.user.id,
            createdByUserType: 'user',
            createdByRole: history.user.role.id,
            createdAtLocation: history.office.id,
            updatedAtLocation: history.office.id,
            status: 'Accepted',
            ...legacyHistoryItemToV2ActionType(
              eventRegistration,
              declaration,
              history
            ),
          }
        }),
    ],
  }

  return documents
}
