import { getCustomField } from "../helpers/resolverUtils.ts";

export const countryResolver = {
'child.birthTime': (data) => getCustomField(
      data,
      'birth.child.child-view-group.birthTime'
    ),
'child.iD': (data) => data.child.identifier[0].id,
'child.legacyBirthRegistrationNumber': (data) => getCustomField(data, 'birth.child.child-view-group.legacyBirthRegistrationNumber'),
'child.legacyBirthRegistrationDate': (data) => getCustomField(data, 'birth.child-view-group.legacyBirthRegistrationDate'),
'child.legacyBirthRegistrationTime': (data) => getCustomField(data, 'birth.child.child-view-group.legacyBirthRegistrationTime'),
'informant.customizedExactDateOfBirthUnknown': (data) =>  getCustomField(data, 'birth.informant-view-group.customizedExactDateOfBirthUnknown'),
'informant.yearOfBirth': (data) => getCustomField(data, 'birth.informant-view-group.yearOfBirth'),
'informant.iD': (data) => Number(data.informant.id),
'informant.birthPlace': (data) => getCustomField(data, 'birth.informant.informant-view-group.birthPlace'),
'informant.occupation': (data) => data.informant.occupation,
'mother.motherIsDeceased': (data) => getCustomField(data, 'birth.mother-view-group.motherIsDeceased'),
/* 'mother.address.streetLevelDetails.fokontanyCustomAddress': (data) => getCustomField(data,'birth.mother.mother-view-group.fokontanyCustomAddress'), */
'mother.customizedExactDateOfBirthUnknown': (data) => getCustomField(data, 'birth.mother-view-group.customizedExactDateOfBirthUnknown'),
'mother.yearOfBirth': (data) => getCustomField(data, 'birth.mother-view-group.yearOfBirth'),
'mother.iD': (data) => data.mother.identifier?.[0]?.id,
'mother.birthPlace': (data) => getCustomField(
      data,
      'birth.mother.mother-view-group.birthPlace'
    ),
'father.fatherIsDeceased': (data) => getCustomField(
      data,
      'birth.father.father-view-group.fatherIsDeceased'
    ),
'father.fatherHasFormallyRecognisedChild': (data) => getCustomField(data, 'birth.father.father-view-group.fatherHasFormallyRecognisedChild'),
'father.customizedExactDateOfBirthUnknown': (data) => getCustomField(data, 'birth.father-view-group.customizedExactDateOfBirthUnknown'),
'father.yearOfBirth': (data) => getCustomField(data, 'birth.father-view-group.yearOfBirth'),
'father.iD': (data) => data.father.identifier?.[0]?.id,
'father.birthPlace': (data) => getCustomField(data, 'birth.father.father-view-group.birthPlace'),
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



