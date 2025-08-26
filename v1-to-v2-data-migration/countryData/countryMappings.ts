/*
    Regular Field format: 
    {v1EventName}.{section.id}{v1Field.id}: {v2Field.id}

    Custom Field format:
    {v1Field.customQuestionMappingId}: {v2Field.id}
*/

export const COUNTRY_FIELD_MAPPINGS = {
  'birth.child-view-group.iD': 'child.nid',
  'birth.child-view-group.countryPrimaryChild': 'child.address',
  'birth.child-view-group.statePrimaryChild': 'child.address',
  'birth.child-view-group.districtPrimaryChild': 'child.address',
  'birth.child-view-group.cityPrimaryChild': 'child.address',
  'birth.child-view-group.addressLine1PrimaryChild': 'child.address',
  'birth.child-view-group.addressLine2PrimaryChild': 'child.address',
  'birth.child-view-group.addressLine3PrimaryChild': 'child.address',
  'birth.child-view-group.postalCodePrimaryChild': 'child.address',
  'birth.child-view-group.internationalCityPrimaryChild': 'child.address',
  'birth.child-view-group.birthAttendantName': 'child.attendantName',
  'birth.child-view-group.birthAttendantId': 'child.attedantAtBirthId',
  'birth.informant-view-group.informantID': 'informant.nid',
  'birth.mother-view-group.iD': 'mother.nid',
  'birth.father-view-group.iD': 'father.nid',
  'birth.documents-view-group.uploadDocOther': 'documents.proofOther',
  'death.deceased-view-group.placeOfBirth': 'deceased.placeOfBirth',
  'death.deceased-view-group.birthRegNo': 'deceased.brn',
  'death.deceased-view-group.deceasedID': 'deceased.nid',
  'death.deceased-view-group.occupation': 'deceased.occupation',
  'death.death-event-details.timeOfDeath': 'eventDetails.timeOfDeath',
  'death.informant-view-group.informantID': 'informant.nid',
  'death.informant-view-group.informantType': 'informant.informantType',
  'death.documents-view-group.uploadDocForInformant':
    'documents.proofOfInformant',
}
