/*
    Regular Field format: 
    {v1EventName}.{section.id}{v1Field.id}: {v2Field.id}

    Custom Field format:
    {v1Field.customQuestionMappingId}: {v2Field.id}
*/

export const COUNTRY_FIELD_MAPPINGS = {
'birth.child.child-view-group.birthTime' : 'child.birthTime',
'birth.child.child-view-group.fokontanyCustomAddress' : 'child.birthLocation.privateHome',
'birth.child.child-view-group.otherPlaceOfBirthAddress' : 'child.birthLocation.other',
/* 'birth.child-view-group.createNUI' : 'child.createNUI', */
/* 'birth.child-view-group.nuiGeneratorError' : '', */
/* 'birth.child-view-group.nuiGenerator' : 'child.nuiGenerator', */
'birth.child.iD' : 'child.iD',
'birth.child.iDManual' : 'child.iD',
'birth.child.child-view-group.legacyBirthRegistrationNumber' : 'child.legacyBirthRegistrationNumber',
'birth.child.child-view-group.legacyBirthRegistrationDate' : 'child.legacyBirthRegistrationDate',
'birth.child.child-view-group.legacyBirthRegistrationTime' : 'child.legacyBirthRegistrationTime',
'birth.informant.informant-view-group.customizedExactDateOfBirthUnknown' : 'informant.customizedExactDateOfBirthUnknown',
'birth.informant.informant-view-group.yearOfBirth' : 'informant.yearOfBirth',
'birth.informant.iD' : 'informant.iD',
'birth.informant.informant-view-group.birthPlace' : 'informant.birthPlace',
'birth.informant.informant-view-group.fokontanyCustomAddress' : 'informant.address',
'birth.informant.occupation' : 'informant.occupation',
'birth.mother.mother-view-group.motherIsDeceased' : 'mother.motherIsDeceased',
'birth.mother.mother-view-group.customizedExactDateOfBirthUnknown' : 'mother.customizedExactDateOfBirthUnknown',
'birth.mother.mother-view-group.yearOfBirth' : 'mother.yearOfBirth',
'birth.mother.iD' : 'mother.iD',
'birth.mother.mother-view-group.birthPlace' : 'mother.birthPlace',      
'birth.mother.mother-view-group.fokontanyCustomAddress' : 'mother.address',
'birth.father.father-view-group.fatherIsDeceased' : 'father.fatherIsDeceased',
'birth.father.father-view-group.fatherHasFormallyRecognisedChild' : 'father.fatherHasFormallyRecognisedChild',
'birth.father.father-view-group.customizedExactDateOfBirthUnknown' : 'father.customizedExactDateOfBirthUnknown',
'birth.father.father-view-group.yearOfBirth' : 'father.yearOfBirth',
'birth.father.iD' : 'father.iD',
'birth.father.father-view-group.birthPlace' : 'father.birthPlace',
'birth.father.father-view-group.fokontanyCustomAddress' : 'father.address'
/* 'birth.documents-view-group.uploadDocForRecognition' : '' */
}
