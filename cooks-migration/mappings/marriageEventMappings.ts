export const marriageEventMapping: Record<string, string> = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'marriageDetails.licenceNumber': 'marriage.NOTICE_NUMBER',
  'marriageDetails.expiryDate': 'marriage.LICENCE_EXPIRY_DATE',
  'marriageDetails.dateOfMarriage': 'marriage.MARRIAGE_DATE',
  'marriageDetails.address': 'marriage.MARRIAGE_PLACE',
  'marriageDetails.venueName': 'marriage.CHURCH_NAME',
  'marriageDetails.officiantType': '',
  'marriageDetails.officiantFullName': 'marriage.PASTOR_NAME',
  'marriageDetails.officiantAffiliation': 'marriage.DENOMINATION',
  'marriageDetails.bridegroomName': 'marriage.GROOM_FIRSTNAME',
  'marriageDetails.bridegroomDob': 'marriage.GROOM_DOB',
  'marriageDetails.bridegroomPlaceOfBirth': 'marriage.GROOM_BIRTHPLACE',
  'marriageDetails.bridegroomOccupation': 'marriage.GROOM_OCCUPATION',
  'marriageDetails.bridegroomConjugalStatus': 'marriage.GROOM_STATUS',
  'marriageDetails.bridegroomDateOfDecreeAbsolute': '',
  'marriageDetails.bridegroomDateOfDeathFormerWife': 'marriage.GROOM_DOD_WIDOW',
  'marriageDetails.bridegroomAddress': 'marriage.GROOM_RESIDENCE',
  'marriageDetails.brideName': 'marriage.BRIDE_FIRSTNAME',
  'marriageDetails.brideDob': 'marriage.BRIDE_DOB',
  'marriageDetails.bridePlaceOfBirth': 'marriage.BRIDE_BIRTHPLACE',
  'marriageDetails.brideOccupation': 'marriage.BRIDE_OCCUPATION',
  'marriageDetails.brideConjugalStatus': 'marriage.BRIDE_STATUS',
  'marriageDetails.brideDateOfDecreeAbsolute': '',
  'marriageDetails.brideDateOfDeathFormerHusband': 'marriage.BRIDE_DOD_WIDOWER',
  'marriageDetails.brideAddress': 'marriage.BRIDE_RESIDENCE',
  'informantDetails.informantType': '',
  'informantDetails.relationshipToOfficiantOrCouple': '',
  'informantDetails.name': '',
  'informantDetails.phoneNumber': '',
  'informantDetails.email': '',
  'supportingDocuments.marriageRegisterForm': '',
  'supportingDocuments.authorisationLetter': '',
}

export const marriageMetaDataMapping: Record<string, string> = {
  registrationNumber: 'marriage.NOTICE_NUMBER',
  dateOfRegistration: 'marriage.MARRIAGE_DATE',
  registrar: 'marriage.REGISTRAR',
}

export const marriageNameMapping: Record<string, string> = {
  'marriageDetails.bridegroomName.firstname': 'marriage.GROOM_FIRSTNAME',
  'marriageDetails.bridegroomName.surname': 'marriage.GROOM_LASTNAME',
  'marriageDetails.brideName.firstname': 'marriage.BRIDE_FIRSTNAME',
  'marriageDetails.brideName.surname': 'marriage.BRIDE_LASTNAME',
}

export default {
  ...marriageEventMapping,
  ...marriageNameMapping,
  ...marriageMetaDataMapping,
}
