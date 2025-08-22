// This exists for the sake of corrections where we may have to handle certain types of mappings differently, for now
export const DEFAULT_FIELD_MAPPINGS = {
  // birth

  'birth.child-view-group.gender': 'child.gender',
  'birth.child-view-group.childBirthDate': 'child.dob',

  'birth.child-view-group.placeOfBirth': 'child.placeOfBirth',

  'birth.child-view-group.birthLocation': 'child.birthLocation',

  'birth.child-view-group.attendantAtBirth': 'child.attendantAtBirth',
  'birth.child-view-group.birthType': 'child.birthType',
  'birth.child-view-group.weightAtBirth': 'child.weightAtBirth',

  'birth.informant-view-group.informantBirthDate': 'informant.dob',

  'birth.informant-view-group.registrationPhone': 'informant.phoneNo',
  'birth.informant-view-group.registrationEmail': 'informant.email',
  'birth.informant-view-group.informantType': 'informant.relation',
  'birth.informant-view-group.otherInformantType': 'informant.other.relation',

  'birth.informant-view-group.exactDateOfBirthUnknown': 'informant.dobUnknown',
  'birth.informant-view-group.ageOfIndividualInYears': 'informant.age',
  'birth.informant-view-group.nationality': 'informant.nationality',
  'birth.mother-view-group.detailsExist': 'mother.detailsNotAvailable',
  'birth.mother-view-group.reasonNotApplying': 'mother.reason',

  'birth.mother-view-group.motherBirthDate': 'mother.dob',
  'birth.mother-view-group.exactDateOfBirthUnknown': 'mother.dobUnknown',
  'birth.mother-view-group.ageOfIndividualInYears': 'mother.age',
  'birth.mother-view-group.nationality': 'mother.nationality',
  'birth.mother-view-group.maritalStatus': 'mother.maritalStatus',
  'birth.mother-view-group.educationalAttainment':
    'mother.educationalAttainment',
  'birth.mother-view-group.occupation': 'mother.occupation',
  'birth.mother-view-group.multipleBirth': 'mother.previousBirths',

  'birth.father-view-group.detailsExist': 'father.detailsNotAvailable',
  'birth.father-view-group.reasonNotApplying': 'father.reason',

  'birth.father-view-group.fatherBirthDate': 'father.dob',
  'birth.father-view-group.exactDateOfBirthUnknown': 'father.dobUnknown',
  'birth.father-view-group.ageOfIndividualInYears': 'father.age',
  'birth.father-view-group.nationality': 'father.nationality',
  'birth.father-view-group.maritalStatus': 'father.maritalStatus',
  'birth.father-view-group.educationalAttainment':
    'father.educationalAttainment',
  'birth.father-view-group.occupation': 'father.occupation',

  'birth.documents-view-group.uploadDocForChildDOB': 'documents.proofOfBirth',
  'birth.documents-view-group.uploadDocForMother': 'documents.proofOfMother',
  'birth.documents-view-group.uploadDocForFather': 'documents.proofOfFather',
  'birth.documents-view-group.uploadDocForInformant':
    'documents.proofOfInformant',
  'birth.documents-view-group.uploadDocForProofOfLegalGuardian':
    'documents.proofOther',

  // death

  'death.deceased-view-group.gender': 'deceased.gender',
  'death.deceased-view-group.deceasedBirthDate': 'deceased.dob',
  'death.deceased-view-group.exactDateOfBirthUnknown': 'deceased.dobUnknown',
  'death.deceased-view-group.ageOfIndividualInYears': 'deceased.age',
  'death.deceased-view-group.nationality': 'deceased.nationality',
  'death.deceased-view-group.deceasedIdType': 'deceased.idType',
  'death.deceased-view-group.deceasedNationalId': 'deceased.nid',
  'death.deceased-view-group.deceasedPassport': 'deceased.passport',
  'death.deceased-view-group.deceasedBirthRegistrationNumber': 'deceased.brn',
  'death.deceased-view-group.maritalStatus': 'deceased.maritalStatus',
  'death.deceased-view-group.numberOfDependants': 'deceased.numberOfDependants',

  'death.death-event-details.deathDate': 'eventDetails.date',
  'death.death-event-details.reasonForLateRegistration':
    'eventDetails.reasonForLateRegistration',
  'death.death-event-details.mannerOfDeath': 'eventDetails.mannerOfDeath',
  'death.death-event-details.causeOfDeathEstablished':
    'eventDetails.causeOfDeathEstablished',
  'death.death-event-details.causeOfDeathMethod':
    'eventDetails.sourceCauseDeath',
  'death.death-event-details.deathDescription': 'eventDetails.description',
  'death.death-event-details.placeOfDeath': 'eventDetails.placeOfDeath',
  'death.death-event-details.deathLocation': 'eventDetails.deathLocation',

  'death.informant-view-group.informantType': 'informant.relation',
  'death.informant-view-group.otherInformantType': 'informant.other.relation',

  'death.informant-view-group.informantBirthDate': 'informant.dob',
  'death.informant-view-group.exactDateOfBirthUnknown': 'informant.dobUnknown',
  'death.informant-view-group.ageOfIndividualInYears': 'informant.age',
  'death.informant-view-group.nationality': 'informant.nationality',
  'death.informant-view-group.informantIdType': 'informant.idType',
  'death.informant-view-group.informantNationalId': 'informant.nid',
  'death.informant-view-group.informantPassport': 'informant.passport',
  'death.informant-view-group.informantBirthRegistrationNumber':
    'informant.brn',
  'death.informant-view-group.primaryAddressSameAsOtherPrimary':
    'informant.addressSameAs',

  'death.informant-view-group.registrationPhone': 'informant.phoneNo',
  'death.informant-view-group.registrationEmail': 'informant.email',

  'death.spouse-view-group.detailsExist': 'spouse.detailsNotAvailable',
  'death.spouse-view-group.reasonNotApplying': 'spouse.reason',

  'death.spouse-view-group.spouseBirthDate': 'spouse.dob',
  'death.spouse-view-group.exactDateOfBirthUnknown': 'spouse.dobUnknown',
  'death.spouse-view-group.ageOfIndividualInYears': 'spouse.age',
  'death.spouse-view-group.nationality': 'spouse.nationality',
  'death.spouse-view-group.spouseIdType': 'spouse.idType',
  'death.spouse-view-group.spouseNationalId': 'spouse.nid',
  'death.spouse-view-group.spousePassport': 'spouse.passport',
  'death.spouse-view-group.spouseBirthRegistrationNumber': 'spouse.brn',

  'death.documents-view-group.paragraph': 'documents.helper',
  'death.documents-view-group.uploadDocForDeceased':
    'documents.proofOfDeceased',
  'death.documents-view-group.uploadDocForInformant':
    'documents.proofOfInformant',
  'death.documents-view-group.uploadDocForDeceasedDeath':
    'documents.proofOfDeath',
  'death.documents-view-group.uploadDocForCauseOfDeath':
    'documents.proofOfCauseOfDeath',

  'death.preview-view-group.informantSignature': 'review.signature',
  'death.review-view-group.informantSignature': 'review.signature',
}

export const NAME_FIELDS = {
  'birth.child-view-group.firstNamesEng': 'child.name',
  'birth.child-view-group.familyNameEng': 'child.name',
  'birth.informant-view-group.firstNamesEng': 'informant.name',
  'birth.informant-view-group.familyNameEng': 'informant.name',
  'birth.mother-view-group.firstNamesEng': 'mother.name',
  'birth.mother-view-group.familyNameEng': 'mother.name',
  'birth.father-view-group.firstNamesEng': 'father.name',
  'birth.father-view-group.familyNameEng': 'father.name',
  'death.deceased-view-group.firstNamesEng': 'deceased.name',
  'death.deceased-view-group.familyNameEng': 'deceased.name',
  'death.informant-view-group.firstNamesEng': 'informant.name',
  'death.informant-view-group.familyNameEng': 'informant.name',
  'death.spouse-view-group.firstNamesEng': 'spouse.name',
  'death.spouse-view-group.familyNameEng': 'spouse.name',
}

export const ADDRESS_FIELDS = {
  'birth.child-view-group.countryPlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.statePlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.districtPlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.ruralOrUrbanPlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.cityPlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.addressLine1Placeofbirth': 'child.placeOfBirth',
  'birth.child-view-group.addressLine2Placeofbirth': 'child.placeOfBirth',
  'birth.child-view-group.addressLine3Placeofbirth': 'child.placeOfBirth',
  'birth.child-view-group.addressLine2UrbanOptionPlaceofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.addressLine3UrbanOptionPlaceofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.postalCodePlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.internationalStatePlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.internationalDistrictPlaceofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.internationalCityPlaceofbirth': 'child.placeOfBirth',
  'birth.child-view-group.internationalAddressLine1Placeofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.internationalAddressLine2Placeofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.internationalAddressLine3Placeofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.internationalPostalCodePlaceofbirth':
    'child.placeOfBirth',
  'birth.child-view-group.addressLine1UrbanOptionPlaceofbirth':
    'child.address.privateHome',
  'birth.child-view-group.addressLine1RuralOptionPlaceofbirth':
    'child.address.other',

  'birth.informant-view-group.countryPrimaryInformant': 'informant.address',
  'birth.informant-view-group.statePrimaryInformant': 'informant.address',
  'birth.informant-view-group.districtPrimaryInformant': 'informant.address',
  'birth.informant-view-group.ruralOrUrbanPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.cityPrimaryInformant': 'informant.address',
  'birth.informant-view-group.addressLine1PrimaryInformant':
    'informant.address',
  'birth.informant-view-group.addressLine2PrimaryInformant':
    'informant.address',
  'birth.informant-view-group.addressLine3PrimaryInformant':
    'informant.address',
  'birth.informant-view-group.addressLine1UrbanOptionPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.addressLine2UrbanOptionPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.addressLine3UrbanOptionPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.postalCodePrimaryInformant': 'informant.address',
  'birth.informant-view-group.addressLine1RuralOptionPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalStatePrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalDistrictPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalCityPrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalAddressLine1PrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalAddressLine2PrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalAddressLine3PrimaryInformant':
    'informant.address',
  'birth.informant-view-group.internationalPostalCodePrimaryInformant':
    'informant.address',
  'birth.informant-view-group.primaryAddress': 'informant.address',
  'birth.mother-view-group.primaryAddress': 'mother.address',
  'birth.mother-view-group.countryPrimaryMother': 'mother.address',
  'birth.mother-view-group.statePrimaryMother': 'mother.address',
  'birth.mother-view-group.districtPrimaryMother': 'mother.address',
  'birth.mother-view-group.ruralOrUrbanPrimaryMother': 'mother.address',
  'birth.mother-view-group.cityPrimaryMother': 'mother.address',
  'birth.mother-view-group.addressLine1PrimaryMother': 'mother.address',
  'birth.mother-view-group.addressLine2PrimaryMother': 'mother.address',
  'birth.mother-view-group.addressLine3PrimaryMother': 'mother.address',
  'birth.mother-view-group.addressLine1UrbanOptionPrimaryMother':
    'mother.address',
  'birth.mother-view-group.addressLine2UrbanOptionPrimaryMother':
    'mother.address',
  'birth.mother-view-group.addressLine3UrbanOptionPrimaryMother':
    'mother.address',
  'birth.mother-view-group.postalCodePrimaryMother': 'mother.address',
  'birth.mother-view-group.addressLine1RuralOptionPrimaryMother':
    'mother.address',
  'birth.mother-view-group.internationalStatePrimaryMother': 'mother.address',
  'birth.mother-view-group.internationalDistrictPrimaryMother':
    'mother.address',
  'birth.mother-view-group.internationalCityPrimaryMother': 'mother.address',
  'birth.mother-view-group.internationalAddressLine1PrimaryMother':
    'mother.address',
  'birth.mother-view-group.internationalAddressLine2PrimaryMother':
    'mother.address',
  'birth.mother-view-group.internationalAddressLine3PrimaryMother':
    'mother.address',
  'birth.mother-view-group.internationalPostalCodePrimaryMother':
    'mother.address',
  'birth.father-view-group.primaryAddress': 'father.address',
  'birth.father-view-group.primaryAddressSameAsOtherPrimary':
    'father.addressSameAs',
  'birth.father-view-group.countryPrimaryFather': 'father.address',
  'birth.father-view-group.statePrimaryFather': 'father.address',
  'birth.father-view-group.districtPrimaryFather': 'father.address',
  'birth.father-view-group.ruralOrUrbanPrimaryFather': 'father.address',
  'birth.father-view-group.cityPrimaryFather': 'father.address',
  'birth.father-view-group.addressLine1PrimaryFather': 'father.address',
  'birth.father-view-group.addressLine2PrimaryFather': 'father.address',
  'birth.father-view-group.addressLine3PrimaryFather': 'father.address',
  'birth.father-view-group.addressLine1UrbanOptionPrimaryFather':
    'father.address',
  'birth.father-view-group.addressLine2UrbanOptionPrimaryFather':
    'father.address',
  'birth.father-view-group.addressLine3UrbanOptionPrimaryFather':
    'father.address',
  'birth.father-view-group.postalCodePrimaryFather': 'father.address',
  'birth.father-view-group.addressLine1RuralOptionPrimaryFather':
    'father.address',
  'birth.father-view-group.internationalStatePrimaryFather': 'father.address',
  'birth.father-view-group.internationalDistrictPrimaryFather':
    'father.address',
  'birth.father-view-group.internationalCityPrimaryFather': 'father.address',
  'birth.father-view-group.internationalAddressLine1PrimaryFather':
    'father.address',
  'birth.father-view-group.internationalAddressLine2PrimaryFather':
    'father.address',
  'birth.father-view-group.internationalAddressLine3PrimaryFather':
    'father.address',
  'birth.father-view-group.internationalPostalCodePrimaryFather':
    'father.address',
  'death.deceased-view-group.primaryAddress': 'deceased.address',
  'death.deceased-view-group.countryPrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.statePrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.districtPrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.cityPrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.addressLine1PrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.addressLine2PrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.addressLine3PrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.postalCodePrimaryDeceased': 'deceased.address',
  'death.deceased-view-group.internationalStatePrimaryDeceased':
    'deceased.address',
  'death.deceased-view-group.internationalDistrictPrimaryDeceased':
    'deceased.address',
  'death.deceased-view-group.internationalCityPrimaryDeceased':
    'deceased.address',
  'death.deceased-view-group.internationalAddressLine1PrimaryDeceased':
    'deceased.address',
  'death.deceased-view-group.internationalAddressLine2PrimaryDeceased':
    'deceased.address',
  'death.deceased-view-group.internationalAddressLine3PrimaryDeceased':
    'deceased.address',
  'death.deceased-view-group.internationalPostalCodePrimaryDeceased':
    'deceased.address',

  'death.death-event-details.countryPlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.statePlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.districtPlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.cityPlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.addressLine1Placeofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.addressLine2Placeofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.addressLine3Placeofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.postalCodePlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalStatePlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalDistrictPlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalCityPlaceofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalAddressLine1Placeofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalAddressLine2Placeofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalAddressLine3Placeofdeath':
    'eventDetails.deathLocationOther',
  'death.death-event-details.internationalPostalCodePlaceofdeath':
    'eventDetails.deathLocationOther',

  'death.informant-view-group.primaryAddress': 'informant.address',
  'death.informant-view-group.countryPrimaryInformant': 'informant.address',
  'death.informant-view-group.statePrimaryInformant': 'informant.address',
  'death.informant-view-group.districtPrimaryInformant': 'informant.address',
  'death.informant-view-group.cityPrimaryInformant': 'informant.address',
  'death.informant-view-group.addressLine1PrimaryInformant':
    'informant.address',
  'death.informant-view-group.addressLine2PrimaryInformant':
    'informant.address',
  'death.informant-view-group.addressLine3PrimaryInformant':
    'informant.address',
  'death.informant-view-group.postalCodePrimaryInformant': 'informant.address',
  'death.informant-view-group.internationalStatePrimaryInformant':
    'informant.address',
  'death.informant-view-group.internationalDistrictPrimaryInformant':
    'informant.address',
  'death.informant-view-group.internationalCityPrimaryInformant':
    'informant.address',
  'death.informant-view-group.internationalAddressLine1PrimaryInformant':
    'informant.address',
  'death.informant-view-group.internationalAddressLine2PrimaryInformant':
    'informant.address',
  'death.informant-view-group.internationalAddressLine3PrimaryInformant':
    'informant.address',
  'death.informant-view-group.internationalPostalCodePrimaryInformant':
    'informant.address',

  'death.spouse-view-group.primaryAddress': 'spouse.address',
  'death.spouse-view-group.primaryAddressSameAsOtherPrimary':
    'spouse.addressSameAs',
  'death.spouse-view-group.countryPrimarySpouse': 'spouse.address',
  'death.spouse-view-group.statePrimarySpouse': 'spouse.address',
  'death.spouse-view-group.districtPrimarySpouse': 'spouse.address',
  'death.spouse-view-group.cityPrimarySpouse': 'spouse.address',
  'death.spouse-view-group.addressLine1PrimarySpouse': 'spouse.address',
  'death.spouse-view-group.addressLine2PrimarySpouse': 'spouse.address',
  'death.spouse-view-group.addressLine3PrimarySpouse': 'spouse.address',
  'death.spouse-view-group.postalCodePrimarySpouse': 'spouse.address',
  'death.spouse-view-group.internationalStatePrimarySpouse': 'spouse.address',
  'death.spouse-view-group.internationalDistrictPrimarySpouse':
    'spouse.address',
  'death.spouse-view-group.internationalCityPrimarySpouse': 'spouse.address',
  'death.spouse-view-group.internationalAddressLine1PrimarySpouse':
    'spouse.address',
  'death.spouse-view-group.internationalAddressLine2PrimarySpouse':
    'spouse.address',
  'death.spouse-view-group.internationalAddressLine3PrimarySpouse':
    'spouse.address',
  'death.spouse-view-group.internationalPostalCodePrimarySpouse':
    'spouse.address',
}

export const MAPPING_FOR_CUSTOM_FIELDS = {
  'birth.child-view-group.reasonForLateRegistration': 'child.reason',
  'birth.informant-view-group.informantIdType': 'informant.idType',
  'birth.informant-view-group.informantNationalId': 'informant.nid',
  'birth.informant-view-group.informantPassport': 'informant.passport',
  'birth.informant-view-group.informantBirthRegistrationNumber':
    'informant.brn',
  'birth.mother-view-group.motherIdType': 'mother.idType',
  'birth.mother-view-group.motherNationalId': 'mother.nid',
  'birth.mother-view-group.motherPassport': 'mother.passport',
  'birth.mother-view-group.motherBirthRegistrationNumber': 'mother.brn',
  'birth.father-view-group.fatherIdType': 'father.idType',
  'birth.father-view-group.fatherNationalId': 'father.nid',
  'birth.father-view-group.fatherPassport': 'father.passport',
  'birth.father-view-group.fatherBirthRegistrationNumber': 'father.brn',
}
