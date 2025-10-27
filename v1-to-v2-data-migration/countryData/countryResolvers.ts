import { getCustomField, getDocuments } from '../helpers/resolverUtils.ts'
import { EventRegistration } from '../helpers/types.ts'

export const countryResolver = {
  'child.birthTime': (data: EventRegistration) =>
    getCustomField(data, 'birth.child.child-view-group.birthTime'),
  'child.iD': (data: EventRegistration) => data.child?.identifier?.[0]?.id,
  'child.legacyBirthRegistrationNumber': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.child.child-view-group.legacyBirthRegistrationNumber'
    ),
  'child.legacyBirthRegistrationDate': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.child.child-view-group.legacyBirthRegistrationDate'
    ),
  'child.legacyBirthRegistrationTime': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.child.child-view-group.legacyBirthRegistrationTime'
    ),
  'informant.customizedExactDateOfBirthUnknown': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.informant.informant-view-group.customizedExactDateOfBirthUnknown'
    ),
  'informant.yearOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'birth.informant.informant-view-group.yearOfBirth'),
  'informant.iD': (data: EventRegistration) =>
    Number(data.informant?.identifier?.[0]?.id),
  'informant.birthPlace': (data: EventRegistration) =>
    getCustomField(data, 'birth.informant.informant-view-group.birthPlace'),
  'informant.occupation': (data: EventRegistration) =>
    data.informant?.occupation,
  'mother.motherIsDeceased': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.motherIsDeceased'),
  /* 'mother.address.streetLevelDetails.fokontanyCustomAddress': (data) => getCustomField(data,'birth.mother.mother-view-group.fokontanyCustomAddress'), */
  'mother.customizedExactDateOfBirthUnknown': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.mother.mother-view-group.customizedExactDateOfBirthUnknown'
    ),
  'mother.yearOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.yearOfBirth'),
  'mother.iD': (data: EventRegistration) => data.mother?.identifier?.[0]?.id,
  'mother.birthPlace': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.birthPlace'),
  'father.fatherIsDeceased': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.fatherIsDeceased'),
  'father.fatherHasFormallyRecognisedChild': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.father.father-view-group.fatherHasFormallyRecognisedChild'
    ),
  'father.customizedExactDateOfBirthUnknown': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.father.father-view-group.customizedExactDateOfBirthUnknown'
    ),
  'father.yearOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.yearOfBirth'),
  'father.iD': (data: EventRegistration) => data.father?.identifier?.[0]?.id,
  'father.birthPlace': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.birthPlace'),
  'documents.upload': (data: EventRegistration) =>
    !!data?.registration?.attachments,
  'documents.proofOther': (data: EventRegistration) =>
    getDocuments(data, 'LEGAL_GUARDIAN_PROOF'),
}

/* 
'child.createNUI': ,
'child.nuiGenerator': ,
'birth.child-view-group.fokontanyCustomAddress' : 'child.address.privateHome.fokontanyCustomAddress',
'birth.child-view-group.otherPlaceOfBirthAddress' : 'child.address.other', */
/* 'birth.child-view-group.nuiGeneratorError' : '', */
/* 'birth.child-view-group.iDManual' : '', */
/* 'birth.informant-view-group.fokontanyCustomAddress' : 'informant.address.streetLevelDetails.fokontanyCustomAddress',  */
/* 'birth.father-view-group.fokontanyCustomAddress' : 'father.address.streetLevelDetails.fokontanyCustomAddress' */
/* 'birth.documents-view-group.uploadDocForRecognition' : '' */
