export const COLLECTOR_RESOLVER = {
  'collector.requesterId': (data) => data.collector?.relationship,
  'collector.OTHER.name': (data) =>
    other(data) && {
      surname: data.collector?.name[0].familyName, // TODO - dodgy
      firstname: data.collector?.name[0].firstNames,
    },
  'collector.brn': (data) => getIdForType(data, 'BIRTH_REGISTRATION_NUMBER'),
  'collector.nid': (data) => getIdForType(data, 'NATIONAL_ID'),
  'collector.OTHER.idType': (data) => other(data) && getId(data).type,
  'collector.PASSPORT.details': (data) => getIdForType(data, 'PASSPORT'),
  'collector.DRIVING_LICENSE.details': (data) =>
    getIdForType(data, 'DRIVING_LICENSE'),
  'collector.REFUGEE_NUMBER.details': (data) =>
    getIdForType(data, 'REFUGEE_NUMBER'),
  'collector.ALIEN_NUMBER.details': (data) =>
    getIdForType(data, 'ALIEN_NUMBER'),
  'collector.OTHER.idTypeOther': (data) => other(data) && getId(data).otherType,
  'collector.OTHER.idNumberOther': (data) => getIdForType(data, 'OTHER'),
  'collector.OTHER.relationshipToChild': (data) =>
    data.collector?.otherRelationship,
  'collector.OTHER.signedAffidavit': (data) => data.x,
  'collector.identity.verify': (data) => data.hasShowedVerifiedDocument,
  'collector.identity.verify.data.mother': (data) => data.x, // check validity
  'collector.identity.verify.data.father': (data) => data.x, // check validity
  'collector.identity.verify.data.other': (data) => data.x, // check validity
  'collector.collect.payment.data.afterLateRegistrationTarget': (data) =>
    data.x,
  'collector.collect.payment.data.inBetweenRegistrationTargets': (data) =>
    data.x,
  'collector.collect.payment.data.beforeRegistrationTarget': (data) => data.x,
}

function getIdForType(data: any, type: string) {
  return data.collector?.identifier?.find((id: any) => id.type === type)?.id
}

function getId(data: any) {
  return data.collector?.identifier?.[0]
}

function other(data: any) {
  return data.collector?.relationship === 'OTHER'
}
