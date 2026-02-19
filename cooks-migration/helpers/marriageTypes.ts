import { Address } from './addressConfig.ts'
import { CsvFields, MarriageCsvRecord } from './csvTypes.ts'
import { CrvsDate, LocationMap, Name } from './types.ts'

export type MarriageResolverFunction<T> =
  | ((data: MarriageCsvRecord) => T)
  | ((data: MarriageCsvRecord, all: CsvFields) => T)
  | ((data: MarriageCsvRecord, all: CsvFields, locationMap: LocationMap[]) => T)

export type GroomConjugalStatus = 'BACHELOR' | 'DIVORCED' | 'WIDOWER'
export type BrideConjugalStatus = 'SPINSTER' | 'DIVORCED' | 'WIDOW'

export type MarriageResolver = {
  'marriageDetails.licenceNumber': string
  'marriageDetails.expiryDate': MarriageResolverFunction<CrvsDate>
  'marriageDetails.dateOfMarriage': MarriageResolverFunction<CrvsDate>
  'marriageDetails.address': MarriageResolverFunction<Address | undefined>
  'marriageDetails.venueName': MarriageResolverFunction<string>
  'marriageDetails.officiantType': string
  'marriageDetails.officiantFullName': MarriageResolverFunction<string>
  'marriageDetails.officiantAffiliation': MarriageResolverFunction<string>
  'marriageDetails.bridegroomName': MarriageResolverFunction<Name>
  'marriageDetails.bridegroomDob': MarriageResolverFunction<CrvsDate>
  'marriageDetails.bridegroomPlaceOfBirth': MarriageResolverFunction<string>
  'marriageDetails.bridegroomOccupation': MarriageResolverFunction<string>
  'marriageDetails.bridegroomConjugalStatus': MarriageResolverFunction<
    GroomConjugalStatus | undefined
  >
  'marriageDetails.bridegroomDateOfDecreeAbsolute': MarriageResolverFunction<CrvsDate>
  'marriageDetails.bridegroomDateOfDeathFormerWife': MarriageResolverFunction<CrvsDate>
  'marriageDetails.bridegroomAddress': MarriageResolverFunction<
    Address | undefined
  >
  'marriageDetails.brideName': MarriageResolverFunction<Name>
  'marriageDetails.brideDob': MarriageResolverFunction<CrvsDate>
  'marriageDetails.bridePlaceOfBirth': MarriageResolverFunction<string>
  'marriageDetails.brideOccupation': MarriageResolverFunction<string>
  'marriageDetails.brideConjugalStatus': MarriageResolverFunction<
    BrideConjugalStatus | undefined
  >
  'marriageDetails.brideDateOfDecreeAbsolute': MarriageResolverFunction<CrvsDate>
  'marriageDetails.brideDateOfDeathFormerHusband': MarriageResolverFunction<CrvsDate>
  'marriageDetails.brideAddress': MarriageResolverFunction<Address | undefined>
  'informantDetails.informantType': string
  'informantDetails.relationshipToOfficiantOrCouple': string
  'informantDetails.name': string
  'informantDetails.phoneNumber': string
  'informantDetails.email': string
}

export type MarriageMetaData = {
  registrationDate: MarriageResolverFunction<string>
  registrar: MarriageResolverFunction<string>
  locationCode: MarriageResolverFunction<string | null>
}
