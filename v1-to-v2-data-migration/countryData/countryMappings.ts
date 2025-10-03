/*
    Regular Field format: 
    {v1EventName}.{section.id}{v1Field.id}: {v2Field.id}

    Custom Field format:
    {v1Field.customQuestionMappingId}: {v2Field.id}
*/

export const COUNTRY_FIELD_MAPPINGS = {
  'birth.child.iD': 'child.nid',
  'birth.child.child-view-group.birthAttendantName': 'child.attendantName',
  'birth.child.child-view-group.birthAttendantId': 'child.attedantAtBirthId',
  'birth.informant.informantID': 'informant.nid',
  'birth.mother.iD': 'mother.nid',
  'birth.father.iD': 'father.nid',
  'birth.documents.uploadDocOther': 'documents.proofOther',
  'death.deceased.deceased-view-group.placeOfBirth': 'deceased.placeOfBirth',
  'death.deceased.deceased-view-group.birthRegNo': 'deceased.brn',
  'death.deceased.deceasedID': 'deceased.nid',
  'death.deceased.deceased-view-group.occupation': 'deceased.occupation',
  'death.deathEvent.death-event-details.timeOfDeath':
    'eventDetails.timeOfDeath',
  'death.informant.informantID': 'informant.nid',
  'death.informant.informantType': 'informant.informantType',
  'death.documents.uploadDocForInformant': 'documents.proofOfInformant',
}
